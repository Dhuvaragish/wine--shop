const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const PORT = 8089;
const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const WORKSPACE = path.resolve(__dirname, '..');

// MIME types
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

  // wait for chrome to start
  await new Promise(r => setTimeout(r, 2000));

  let versionData;
  for (let i = 0; i < 15; i++) {
    try {
      const res = await fetch('http://localhost:9222/json/version');
      const text = await res.text();
      try {
        versionData = JSON.parse(text);
        break;
      } catch (parseErr) {
        console.log('Version response not JSON yet:', text.slice(0, 100));
      }
    } catch (e) {
      // wait
    }
    await new Promise(r => setTimeout(r, 500));
  }

  if (!versionData) {
    console.error('Could not connect to Chrome CDP');
    chromeProcess.kill();
    server.close();
    return;
  }

  // Get active targets or create new target
  let targetData;
  try {
    const listRes = await fetch('http://localhost:9222/json/list');
    const list = await listRes.json();
    targetData = list.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
  } catch (e) {}

  if (!targetData) {
    const newTargetRes = await fetch('http://localhost:9222/json/new', { method: 'PUT' });
    targetData = await newTargetRes.json();
  }

  const ws = new WebSocket(targetData.webSocketDebuggerUrl);

  await new Promise((resolve) => {
    ws.onopen = resolve;
  });

  await sendCdp(ws, 'Page.enable');
  await sendCdp(ws, 'DOM.enable');
  await sendCdp(ws, 'Runtime.enable');

  const pages = [
    { name: 'Home1_index', url: `http://localhost:${port}/index.html` },
    { name: 'Home2_home2', url: `http://localhost:${port}/home-2.html` }
  ];

  const viewports = [
    { width: 360, height: 640, label: '360px_mobile' },
    { width: 390, height: 844, label: '390px_mobile' },
    { width: 768, height: 1024, label: '768px_tablet' },
    { width: 1024, height: 768, label: '1024px_laptop' },
    { width: 1280, height: 800, label: '1280px_desktop' }
  ];

  const modes = [
    { name: 'light_ltr', theme: 'light', dir: 'ltr' },
    { name: 'dark_ltr', theme: 'dark', dir: 'ltr' },
    { name: 'light_rtl', theme: 'light', dir: 'rtl' }
  ];

  const results = [];

  for (const p of pages) {
    for (const vp of viewports) {
      for (const m of modes) {
        // Only run dark and rtl on 360px and 1280px to keep test suite fast
        if ((m.name === 'dark_ltr' || m.name === 'light_rtl') && vp.width !== 360 && vp.width !== 1280) {
          continue;
        }

        await sendCdp(ws, 'Emulation.setDeviceMetricsOverride', {
          width: vp.width,
          height: vp.height,
          deviceScaleFactor: 1,
          mobile: vp.width < 992
        });

        await sendCdp(ws, 'Page.navigate', { url: p.url });
        await new Promise(r => setTimeout(r, 800));

        // Set theme and dir, bypass modal
        const evalRes = await sendCdp(ws, 'Runtime.evaluate', {
          expression: `(() => {
            localStorage.setItem('winecraft_age_verified', 'true');
            document.documentElement.setAttribute('data-theme', '${m.theme}');
            document.documentElement.setAttribute('dir', '${m.dir}');

            const ageModal = document.getElementById('ageVerificationModal');
            if (ageModal) {
              ageModal.classList.remove('active');
              ageModal.style.display = 'none';
            }
            const backdrop = document.querySelector('.modal-overlay.active');
            if (backdrop) backdrop.style.display = 'none';

            const header = document.querySelector('.header');
            const headerRect = header ? header.getBoundingClientRect() : null;

            const hero = document.querySelector('.hero-section-enhanced, .saas-hero');
            if (!hero) return { error: 'No hero found' };

            const heroRect = hero.getBoundingClientRect();
            const docScrollWidth = document.documentElement.scrollWidth;
            const docClientWidth = document.documentElement.clientWidth;
            const heroScrollWidth = hero.scrollWidth;
            const heroClientWidth = hero.clientWidth;

            const badge = hero.querySelector('.hero-badge, .badge, .saas-badge');
            const title = hero.querySelector('.hero-title, h1, .saas-hero-title');
            const desc = hero.querySelector('.hero-desc, p, .saas-hero-desc');
            const actions = hero.querySelector('.hero-actions, .saas-hero-actions');
            const statsGrid = hero.querySelector('.saas-stats-grid');

            const badgeR = badge ? badge.getBoundingClientRect() : null;
            const titleR = title ? title.getBoundingClientRect() : null;
            const descR = desc ? desc.getBoundingClientRect() : null;
            const actionsR = actions ? actions.getBoundingClientRect() : null;
            const statsR = statsGrid ? statsGrid.getBoundingClientRect() : null;

            // Check if any element overflows horizontally
            let horizontalOverflowElements = [];
            hero.querySelectorAll('*').forEach(el => {
              if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) {
                // allow svg or inline icons if within subpixel
                if (el.tagName !== 'svg' && el.tagName !== 'I') {
                  horizontalOverflowElements.push({ tag: el.tagName, cls: el.className, scrollW: el.scrollWidth, clientW: el.clientWidth });
                }
              }
            });

            return {
              windowInnerHeight: window.innerHeight,
              windowInnerWidth: window.innerWidth,
              headerHeight: headerRect ? Math.round(headerRect.height) : 0,
              hero: {
                top: Math.round(heroRect.top),
                bottom: Math.round(heroRect.bottom),
                width: Math.round(heroRect.width),
                height: Math.round(heroRect.height),
                scrollWidth: heroScrollWidth,
                clientWidth: heroClientWidth,
                fitsWithinViewport: Math.round(heroRect.bottom) <= window.innerHeight + 10,
                hasHorizontalOverflow: heroScrollWidth > heroClientWidth || docScrollWidth > docClientWidth
              },
              badge: badgeR ? { top: Math.round(badgeR.top), bottom: Math.round(badgeR.bottom), height: Math.round(badgeR.height) } : null,
              title: titleR ? { top: Math.round(titleR.top), bottom: Math.round(titleR.bottom), height: Math.round(titleR.height) } : null,
              desc: descR ? { top: Math.round(descR.top), bottom: Math.round(descR.bottom), height: Math.round(descR.height) } : null,
              actions: actionsR ? { top: Math.round(actionsR.top), bottom: Math.round(actionsR.bottom), height: Math.round(actionsR.height) } : null,
              statsGrid: statsR ? { top: Math.round(statsR.top), bottom: Math.round(statsR.bottom), height: Math.round(statsR.height) } : null,
              horizontalOverflowElements,
              docScrollWidth,
              docClientWidth
            };
          })()`,
          returnByValue: true
        });

        const data = evalRes.result.value;
        const testCase = { page: p.name, viewport: vp.label, mode: m.name, ...data };
        results.push(testCase);

        // Capture screenshot for key cases
        const ssRes = await sendCdp(ws, 'Page.captureScreenshot', { format: 'png' });
        const imgPath = path.join(__dirname, `${p.name}_${vp.label}_${m.name}.png`);
        fs.writeFileSync(imgPath, Buffer.from(ssRes.data, 'base64'));
      }
    }
  }

  console.log(JSON.stringify(results, null, 2));

  ws.close();
  chromeProcess.kill();
  server.close();
  try {
    fs.rmSync(tempProfile, { recursive: true, force: true });
  } catch (e) {}
}

run().catch(console.error);
