/**
 * Wine & Craft - Theme Management (Dark/Light Mode)
 */
(function () {
  'use strict';
  const STORAGE_KEY = 'winecraft_theme';

  function getPreferredTheme() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateThemeIcons(theme);
    updateThemeLogos(theme);
  }

  function updateThemeIcons(theme) {
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'fa-solid fa-sun';
          btn.setAttribute('title', 'Switch to Light Mode');
        } else {
          icon.className = 'fa-solid fa-moon';
          btn.setAttribute('title', 'Switch to Dark Mode');
        }
      }
    });
  }

  function updateThemeLogos(theme) {
    const dir = document.documentElement.getAttribute('dir') || 'ltr';
    const isRtl = dir === 'rtl';
    const isDark = theme === 'dark';

    let targetName = 'logo.svg';
    if (isRtl && isDark) {
      targetName = 'logo-rtl-dark.svg';
    } else if (isRtl) {
      targetName = 'logo-rtl.svg';
    } else if (isDark) {
      targetName = 'logo-dark.svg';
    }

    const logos = document.querySelectorAll('#siteLogo, .brand-logo img, .footer-brand img');
    logos.forEach(logo => {
      const currentSrc = logo.getAttribute('src');
      if (!currentSrc) return;
      const newSrc = currentSrc.replace(/logo(?:-rtl)?(?:-dark)?\.svg/, targetName);
      logo.setAttribute('src', newSrc);
    });
  }

  // Initialize immediately
  const initialTheme = getPreferredTheme();
  setTheme(initialTheme);

  document.addEventListener('DOMContentLoaded', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    updateThemeIcons(currentTheme);
    updateThemeLogos(currentTheme);
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const next = current === 'dark' ? 'light' : 'dark';
        setTheme(next);
      });
    });
  });

  window.setTheme = setTheme;
})();
