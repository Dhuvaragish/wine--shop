const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const WORKSPACE = path.resolve(__dirname, '..');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function startServer() {
  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/' || reqPath === '') reqPath = '/index.html';
    const filePath = path.join(WORKSPACE, reqPath);

    if (!fs.existsSync(filePath)) {
      console.log('404:', reqPath);
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      const idx = path.join(filePath, 'index.html');
      if (fs.existsSync(idx)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        fs.createReadStream(idx).pipe(res);
      } else {
        res.writeHead(403);
        res.end('Forbidden');
      }
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  });

  return new Promise((resolve) => {
    server.listen(0, () => {
      const port = server.address().port;
      console.log(`Static server running on http://localhost:${port}`);
      resolve({ server, port });
    });
  });
}

async function sendCdp(ws, method, params = {}) {
  const id = Math.floor(Math.random() * 1000000);
  return new Promise((resolve, reject) => {
    const handler = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id === id) {
        ws.removeEventListener('message', handler);
        if (msg.error) {
          reject(new Error(JSON.stringify(msg.error)));
        } else {
          resolve(msg.result);
        }
      }
    };
    ws.addEventListener('message', handler);
    ws.send(JSON.stringify({ id, method, params }));
  });
}

async function run() {
  const { server, port } = await startServer();

  const tempProfile = path.join(__dirname, 'chrome-temp-profile-' + Date.now());
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--remote-allow-origins=*',
    '--disable-gpu',
    '--no-sandbox',
    '--disable-extensions',
    `--user-data-dir=${tempProfile}`
  ]);

  await new Promise(r => setTimeout(r, 2000));

  let versionData;
  for (let i = 0; i < 15; i++) {
    try {
      const res = await fetch('http://localhost:9222/json/version');
      versionData = await res.json();
      break;
    } catch (e) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  if (!versionData) {
    console.error('Failed to connect to Chrome');
    chromeProcess.kill();
    server.close();
    return;
  }

  const newTargetRes = await fetch('http://localhost:9222/json/new', { method: 'PUT' });
  const targetData = await newTargetRes.json();
  const ws = new WebSocket(targetData.webSocketDebuggerUrl);

  await new Promise((resolve, reject) => {
    ws.addEventListener('open', resolve);
    ws.addEventListener('error', reject);
  });

  await sendCdp(ws, 'Page.enable');
  await sendCdp(ws, 'Network.enable');
  await sendCdp(ws, 'Runtime.enable');

  const failedRequests = [];
  const consoleErrors = [];

  ws.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    if (data.method === 'Network.loadingFailed') {
      failedRequests.push(data.params);
    }
    if (data.method === 'Runtime.consoleAPICalled' && data.params.type === 'error') {
      consoleErrors.push(data.params.args.map(a => a.value || a.description).join(' '));
    }
  });

  const testCases = [
    { name: 'Home1_Desktop', url: `http://localhost:${port}/index.html`, width: 1280, height: 800, selector: '.hero-section-enhanced' },
    { name: 'Home1_Dark_Desktop', url: `http://localhost:${port}/index.html`, width: 1280, height: 800, selector: '.hero-section-enhanced', theme: 'dark' },
    { name: 'Home1_RTL_Desktop', url: `http://localhost:${port}/index.html`, width: 1280, height: 800, selector: '.hero-section-enhanced', dir: 'rtl' },
    { name: 'Home1_Tablet', url: `http://localhost:${port}/index.html`, width: 768, height: 1024, selector: '.hero-section-enhanced' },
    { name: 'Home1_Mobile', url: `http://localhost:${port}/index.html`, width: 390, height: 844, selector: '.hero-section-enhanced' },
    { name: 'Home2_Desktop', url: `http://localhost:${port}/home-2.html`, width: 1280, height: 800, selector: '.saas-hero' },
    { name: 'Home2_Dark_Desktop', url: `http://localhost:${port}/home-2.html`, width: 1280, height: 800, selector: '.saas-hero', theme: 'dark' },
    { name: 'Home2_RTL_Desktop', url: `http://localhost:${port}/home-2.html`, width: 1280, height: 800, selector: '.saas-hero', dir: 'rtl' },
    { name: 'Home2_Tablet', url: `http://localhost:${port}/home-2.html`, width: 768, height: 1024, selector: '.saas-hero' },
    { name: 'Home2_Mobile', url: `http://localhost:${port}/home-2.html`, width: 390, height: 844, selector: '.saas-hero' },
    { name: 'Home2_index2_Desktop', url: `http://localhost:${port}/index-2.html`, width: 1280, height: 800, selector: '.saas-hero' }
  ];

  const results = [];

  for (const tc of testCases) {
    console.log(`\nTesting ${tc.name}...`);
    await sendCdp(ws, 'Emulation.setDeviceMetricsOverride', {
      width: tc.width,
      height: tc.height,
      deviceScaleFactor: 1,
      mobile: tc.width < 500
    });

    await sendCdp(ws, 'Page.navigate', { url: tc.url });
    await new Promise(r => setTimeout(r, 1000));

    // Dismiss age gate modal
    await sendCdp(ws, 'Runtime.evaluate', {
      expression: `(() => {
        localStorage.setItem('winecraft_age_verified', 'true');
        const ageModal = document.getElementById('ageVerificationModal');
        if (ageModal) {
          ageModal.classList.remove('active');
          ageModal.style.display = 'none';
        }
        const backdrop = document.querySelector('.modal-overlay.active, #ageVerificationModal');
        if (backdrop) backdrop.style.display = 'none';
      })()`
    });
    await new Promise(r => setTimeout(r, 300));

    if (tc.theme) {
      await sendCdp(ws, 'Runtime.evaluate', {
        expression: `document.documentElement.setAttribute('data-theme', '${tc.theme}')`
      });
      await new Promise(r => setTimeout(r, 400));
    }

    if (tc.dir) {
      await sendCdp(ws, 'Runtime.evaluate', {
        expression: `document.documentElement.setAttribute('dir', '${tc.dir}')`
      });
      await new Promise(r => setTimeout(r, 400));
    }

    const evalResult = await sendCdp(ws, 'Runtime.evaluate', {
      expression: `(() => {
        const el = document.querySelector('${tc.selector}');
        if (!el) return { found: false };
        const cs = window.getComputedStyle(el);
        return {
          found: true,
          tagName: el.tagName,
          className: el.className,
          backgroundImage: cs.backgroundImage,
          backgroundSize: cs.backgroundSize,
          backgroundPosition: cs.backgroundPosition,
          backgroundRepeat: cs.backgroundRepeat,
          offsetWidth: el.offsetWidth,
          offsetHeight: el.offsetHeight,
          inlineStyleBg: el.style.backgroundImage
        };
      })()`,
      returnByValue: true
    });

    const info = evalResult.result.value;
    console.log(`Results for ${tc.name}:`, JSON.stringify(info, null, 2));

    const shot = await sendCdp(ws, 'Page.captureScreenshot', {
      format: 'png',
      clip: { x: 0, y: 0, width: tc.width, height: Math.min(tc.height, info.offsetHeight + 100), scale: 1 }
    });

    const shotPath = path.join(WORKSPACE, 'scratch', `verify_${tc.name}.png`);
    fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
    console.log(`Saved screenshot to ${shotPath}`);

    results.push({ name: tc.name, info, screenshot: shotPath });
  }

  console.log('\n--- Failed Network Requests ---');
  console.log(failedRequests.length ? failedRequests : 'None! All requests succeeded.');

  console.log('\n--- Console Errors ---');
  console.log(consoleErrors.length ? consoleErrors : 'None! No console errors.');

  ws.close();
  chromeProcess.kill();
  server.close();

  try {
    fs.rmSync(tempProfile, { recursive: true, force: true });
  } catch (e) {}

  fs.writeFileSync(path.join(WORKSPACE, 'scratch', 'verification_results.json'), JSON.stringify({ results, failedRequests, consoleErrors }, null, 2));
  console.log('\nVerification completed successfully!');
}

run().catch(console.error);
