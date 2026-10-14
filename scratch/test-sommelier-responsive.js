const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const WORKSPACE = path.resolve(__dirname, '..');

const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath === '/') reqPath = '/pages/tasting-events.html';
  const filePath = path.join(WORKSPACE, reqPath);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const map = {
      '.html': 'text/html; charset=utf-8',
      '.css': 'text/css; charset=utf-8',
      '.js': 'application/javascript; charset=utf-8',
      '.jpg': 'image/jpeg',
      '.png': 'image/png',
      '.svg': 'image/svg+xml'
    };
    res.writeHead(200, { 'Content-Type': map[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(0, async () => {
  const port = server.address().port;
  const tempProfile = path.join(__dirname, 'chrome-temp-somm-resp');
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9225',
    '--remote-allow-origins=*',
    '--disable-gpu',
    '--no-sandbox',
    '--user-data-dir=' + tempProfile
  ]);

  await new Promise(r => setTimeout(r, 2000));

  let targetData;
  for (let i = 0; i < 15; i++) {
    try {
      const list = await (await fetch('http://localhost:9225/json/list')).json();
      targetData = list.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
      if (targetData) break;
    } catch (e) {}
    await new Promise(r => setTimeout(r, 400));
  }

  const ws = new WebSocket(targetData.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);

  function sendCdp(method, params = {}) {
    const id = Math.floor(Math.random() * 1000000);
    return new Promise((resolve, reject) => {
      const handler = (evt) => {
        const msg = JSON.parse(evt.data);
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(new Error(JSON.stringify(msg.error)));
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await sendCdp('Page.enable');
  await sendCdp('DOM.enable');
  await sendCdp('Runtime.enable');

  const viewports = [
    { width: 1200, height: 900, name: 'desktop' },
    { width: 768, height: 1024, name: 'tablet' },
    { width: 390, height: 844, name: 'mobile_390' },
    { width: 360, height: 640, name: 'mobile_360' }
  ];

  for (const vp of viewports) {
    await sendCdp('Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: vp.width < 992
    });

    await sendCdp('Page.navigate', { url: 'http://localhost:' + port + '/pages/tasting-events.html' });
    await new Promise(r => setTimeout(r, 1200));

    await sendCdp('Runtime.evaluate', {
      expression: `(() => {
        localStorage.setItem('winecraft_age_verified', 'true');
        const ageModal = document.getElementById('ageVerificationModal');
        if (ageModal) {
          ageModal.classList.remove('active');
          ageModal.style.display = 'none';
        }
        const backdrop = document.querySelector('.modal-overlay.active');
        if (backdrop) backdrop.style.display = 'none';

        const el = Array.from(document.querySelectorAll('h3')).find(h => h.textContent.includes('Elena Rostova'));
        if (el) el.closest('.card').scrollIntoView({ block: 'center', inline: 'center' });
      })()`
    });
    await new Promise(r => setTimeout(r, 800));

    const ss = await sendCdp('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(path.join(__dirname, 'sommeliers_' + vp.name + '.png'), Buffer.from(ss.data, 'base64'));
    console.log('Saved sommeliers_' + vp.name + '.png');
  }

  ws.close();
  chromeProcess.kill();
  server.close();
  try { fs.rmSync(tempProfile, { recursive: true, force: true }); } catch (e) {}
  console.log('All screenshots captured!');
});
