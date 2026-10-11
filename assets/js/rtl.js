/**
 * Wine & Craft - RTL Layout Management
 */
(function () {
  'use strict';
  const STORAGE_KEY = 'winecraft_dir';

  function getStoredDir() {
    return localStorage.getItem(STORAGE_KEY) || 'ltr';
  }

  function setDir(dir) {
    document.documentElement.setAttribute('dir', dir);
    localStorage.setItem(STORAGE_KEY, dir);
    updateRtlButtons(dir);
    updateRtlLogos(dir);
  }

  function updateRtlButtons(dir) {
    const isRtl = dir === 'rtl';
    const toggleBtns = document.querySelectorAll('.rtl-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.setAttribute('title', isRtl ? 'Switch to LTR (Left-to-Right)' : 'Switch to RTL (Right-to-Left)');
      btn.setAttribute('aria-label', isRtl ? 'Switch to LTR' : 'Switch to RTL');
      btn.classList.toggle('active', isRtl);
      btn.innerHTML = '<i class="fa-solid fa-right-left"></i>';
    });
  }

  function updateRtlLogos(dir) {
    const theme = document.documentElement.getAttribute('data-theme') || 'light';
    const isDark = theme === 'dark';

    // Original brand logo text and identity are preserved in both LTR and RTL
    const targetName = isDark ? 'logo-dark.svg' : 'logo.svg';

    const logos = document.querySelectorAll('#siteLogo, .brand-logo img, .footer-brand img, .footer-brand-link img, .portal-brand img');
    logos.forEach(logo => {
      const currentSrc = logo.getAttribute('src');
      if (!currentSrc) return;
      const newSrc = currentSrc.replace(/logo(?:-rtl)?(?:-dark)?\.svg/, targetName);
      logo.setAttribute('src', newSrc);
    });
  }

  const initialDir = getStoredDir();
  setDir(initialDir);

  document.addEventListener('DOMContentLoaded', () => {
    const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
    updateRtlButtons(currentDir);
    updateRtlLogos(currentDir);

    const toggleBtns = document.querySelectorAll('.rtl-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const current = document.documentElement.getAttribute('dir') || 'ltr';
        const next = current === 'rtl' ? 'ltr' : 'rtl';
        setDir(next);
        if (window.showToast) {
          window.showToast(next === 'rtl' ? 'Layout switched to RTL (العربية / עברית)' : 'Layout switched to LTR (English)', 'gold');
        }
      });
    });
  });

  window.setDir = setDir;
  window.updateRtlLogos = updateRtlLogos;
})();
