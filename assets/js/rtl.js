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
  }

  function updateRtlButtons(dir) {
    const toggleBtns = document.querySelectorAll('.rtl-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.setAttribute('title', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
      const textSpan = btn.querySelector('.dir-label');
      if (textSpan) {
        textSpan.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      }
    });
  }

  const initialDir = getStoredDir();
  setDir(initialDir);

  document.addEventListener('DOMContentLoaded', () => {
    updateRtlButtons(document.documentElement.getAttribute('dir') || 'ltr');
    const toggleBtns = document.querySelectorAll('.rtl-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('dir') || 'ltr';
        const next = current === 'rtl' ? 'ltr' : 'rtl';
        setDir(next);
      });
    });
  });

  window.setDir = setDir;
})();
