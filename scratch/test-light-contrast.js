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
  '.svg': 'image/svg+xml'
};

function startServer() {
  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/' || reqPath === '') reqPath = '/home-2.html';
    const filePath = path.join(WORKSPACE, reqPath);

    if (!fs.existsSync(filePath)) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }

    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      const idx = path.join(filePath, 'home-2.html');
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
      console.log(`Contrast test server running on http://localhost:${port}`);
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

  const tempProfile = path.join(__dirname, 'chrome-temp-contrast-' + Date.now());
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
      const text = await res.text();
      try {
        versionData = JSON.parse(text);
        break;
      } catch (e) {}
    } catch (e) {}
    await new Promise(r => setTimeout(r, 500));
  }

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
  await new Promise((resolve) => { ws.onopen = resolve; });

  await sendCdp(ws, 'Page.enable');
  await sendCdp(ws, 'DOM.enable');
  await sendCdp(ws, 'Runtime.enable');

  const viewports = [
    { width: 1280, height: 800, label: 'desktop_1280' },
    { width: 768, height: 1024, label: 'tablet_768' },
    { width: 390, height: 844, label: 'mobile_390' },
    { width: 360, height: 640, label: 'mobile_360' }
  ];

  for (const vp of viewports) {
    await sendCdp(ws, 'Emulation.setDeviceMetricsOverride', {
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: 2,
      mobile: vp.width < 992
    });

    await sendCdp(ws, 'Page.navigate', { url: `http://localhost:${port}/home-2.html` });
    await new Promise(r => setTimeout(r, 1000));

    // Evaluate contrast in Light Mode
    const evalRes = await sendCdp(ws, 'Runtime.evaluate', {
      expression: `(() => {
        localStorage.setItem('winecraft_age_verified', 'true');
        localStorage.setItem('winecraft_theme', 'light');
        document.documentElement.setAttribute('data-theme', 'light');
        if (window.setTheme) window.setTheme('light');

        const ageModal = document.getElementById('ageVerificationModal');
        if (ageModal) {
          ageModal.classList.remove('active');
          ageModal.style.display = 'none';
        }
        const backdrop = document.querySelector('.modal-overlay.active');
        if (backdrop) backdrop.style.display = 'none';

        function parseColor(str) {
          if (!str) return null;
          str = str.trim();
          const rgb = str.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)(?:,\\s*([\\d.]+))?\\)/);
          if (rgb) {
            return {
              r: parseInt(rgb[1]),
              g: parseInt(rgb[2]),
              b: parseInt(rgb[3]),
              a: rgb[4] !== undefined ? parseFloat(rgb[4]) : 1
            };
          }
          if (str.startsWith('#')) {
            let hex = str.slice(1);
            if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
            if (hex.length === 6) {
              return {
                r: parseInt(hex.slice(0, 2), 16),
                g: parseInt(hex.slice(2, 4), 16),
                b: parseInt(hex.slice(4, 6), 16),
                a: 1
              };
            }
          }
          return null;
        }

        function getLuminance(r, g, b) {
          const a = [r, g, b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
          });
          return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
        }

        function getContrast(rgb1, rgb2) {
          const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
          const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
          const brightest = Math.max(lum1, lum2);
          const darkest = Math.min(lum1, lum2);
          return (brightest + 0.05) / (darkest + 0.05);
        }

        function getEffectiveBg(el) {
          let curr = el;
          while (curr && curr !== document.documentElement) {
            const cs = window.getComputedStyle(curr);
            const bg = parseColor(cs.backgroundColor);
            if (bg && bg.a > 0.1) {
              return bg;
            }
            curr = curr.parentElement;
          }
          return { r: 250, g: 247, b: 242, a: 1 }; // default light theme bg
        }

        const elementsToCheck = [
          { name: 'Header brand text / logo', sel: '.brand-text, .brand-logo' },
          { name: 'Nav link active', sel: '.nav-link.active' },
          { name: 'Nav link normal', sel: '.nav-link:not(.active)' },
          { name: 'Nav Book Tasting CTA', sel: '.nav-cta-btn' },
          { name: 'Nav action buttons', sel: '.nav-action-btn' },
          { name: 'Hero badge tag (ENTERPRISE)', sel: '.saas-badge-tag' },
          { name: 'Hero badge text', sel: '.saas-badge-text' },
          { name: 'Hero title (h1)', sel: '.saas-hero-title' },
          { name: 'Hero desc (p)', sel: '.saas-hero-desc' },
          { name: 'Hero CTA Book Demo (btn-gold)', sel: '.open-demo-btn' },
          { name: 'Hero CTA Explore Agency (btn-outline)', sel: '.saas-hero-actions .btn-outline' },
          { name: 'Stat chip 1 number (420+)', sel: '.saas-stats-grid .saas-stat-chip:nth-child(1) .saas-stat-number' },
          { name: 'Stat chip 1 label pill', sel: '.saas-stats-grid .saas-stat-chip:nth-child(1) .saas-stat-label' },
          { name: 'Stat chip 1 icon', sel: '.saas-stats-grid .saas-stat-chip:nth-child(1) .saas-stat-icon' },
          { name: 'Stat chip 2 number ($85M+)', sel: '.saas-stats-grid .saas-stat-chip:nth-child(2) .saas-stat-number' },
          { name: 'Stat chip 2 label pill', sel: '.saas-stats-grid .saas-stat-chip:nth-child(2) .saas-stat-label' }
        ];

        const report = [];

        elementsToCheck.forEach(item => {
          const el = document.querySelector(item.sel);
          if (!el) {
            report.push({ name: item.name, status: 'NOT_FOUND' });
            return;
          }

          const cs = window.getComputedStyle(el);
          const colorStr = cs.color;
          const bgStr = cs.backgroundColor;
          const fontSize = parseFloat(cs.fontSize);
          const fontWeight = cs.fontWeight;
          const isLarge = fontSize >= 24 || (fontSize >= 18.66 && (parseInt(fontWeight) >= 700 || fontWeight === 'bold'));
          const minRatio = isLarge ? 3.0 : 4.5;

          const textColor = parseColor(colorStr);
          let bgColor = parseColor(bgStr);
          if (!bgColor || bgColor.a < 0.2) {
            bgColor = getEffectiveBg(el);
          }

          let ratio = null;
          let pass = false;
          if (textColor && bgColor) {
            ratio = Math.round(getContrast(textColor, bgColor) * 100) / 100;
            pass = ratio >= minRatio;
          }

          // Check text fill color or background clip
          const textFillColor = cs.webkitTextFillColor;
          const bgClip = cs.webkitBackgroundClip;
          const bgImg = cs.backgroundImage;

          report.push({
            name: item.name,
            selector: item.sel,
            fontSize: cs.fontSize,
            fontWeight,
            color: colorStr,
            bgColor: bgStr,
            effectiveBg: bgColor ? 'rgb(' + bgColor.r + ',' + bgColor.g + ',' + bgColor.b + ')' : null,
            textFillColor,
            bgClip,
            bgImg: bgImg !== 'none' ? bgImg.slice(0, 60) + '...' : 'none',
            contrastRatio: ratio,
            requiredRatio: minRatio,
            pass
          });
        });

        // Also check .saas-hero computed background overlay
        const heroEl = document.querySelector('.saas-hero');
        const heroCs = window.getComputedStyle(heroEl);

        return {
          report,
          heroBgImage: heroCs.backgroundImage,
          heroColor: heroCs.color
        };
      })()`,
      returnByValue: true
    });

    console.log(`=== Viewport: ${vp.label} ===`);
    const val = evalRes.result.value;
    console.log(JSON.stringify(val.report, null, 2));

    const ssRes = await sendCdp(ws, 'Page.captureScreenshot', { format: 'png' });
    const imgPath = path.join(__dirname, `contrast_${vp.label}.png`);
    fs.writeFileSync(imgPath, Buffer.from(ssRes.data, 'base64'));
  }

  ws.close();
  chromeProcess.kill();
  server.close();
  try {
    fs.rmSync(tempProfile, { recursive: true, force: true });
  } catch (e) {}
}

run().catch(console.error);
