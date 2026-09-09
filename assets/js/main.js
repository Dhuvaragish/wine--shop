/**
 * Wine & Craft - Core Global Interactions
 */
(function () {
  'use strict';

  // --- Toast Notifications ---
  function showToast(message, type = 'gold', duration = 3500) {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast toast-' + type;

    let iconClass = 'fa-solid fa-circle-check';
    if (type === 'error') iconClass = 'fa-solid fa-circle-exclamation';
    if (type === 'gold') iconClass = 'fa-solid fa-wine-glass';

    toast.innerHTML = `<i class="${iconClass}"></i><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
  window.showToast = showToast;

  // --- 21+ Age Gate Modal ---
  function initAgeGate() {
    const verified = localStorage.getItem('winecraft_age_verified');
    if (verified === 'true') return;

    // Check if modal exists
    let overlay = document.getElementById('ageGateModal');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'ageGateModal';
      overlay.className = 'modal-overlay active';
      overlay.innerHTML = `
        <div class="modal-dialog age-gate-modal">
          <div class="age-gate-icon">
            <i class="fa-solid fa-champagne-glasses"></i>
          </div>
          <h2 class="font-display" style="font-size: 1.8rem; margin-bottom: 0.75rem;">Welcome to Wine & Craft</h2>
          <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.75rem;">
            You must be of legal drinking age in your country of residence to enter our fine wine and craft spirits cellar.
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center;">
            <button id="btnAgeYes" class="btn btn-gold btn-lg" style="min-width: 160px;">I am 21 or Older</button>
            <button id="btnAgeNo" class="btn btn-outline btn-lg" style="min-width: 140px;">Under 21</button>
          </div>
          <p style="font-size: 0.75rem; color: var(--text-light); margin-top: 1.5rem; margin-bottom: 0;">
            By entering, you accept our Terms of Service & Privacy Policy. Enjoy responsibly.
          </p>
        </div>
      `;
      document.body.appendChild(overlay);

      document.getElementById('btnAgeYes').addEventListener('click', () => {
        localStorage.setItem('winecraft_age_verified', 'true');
        overlay.classList.remove('active');
        setTimeout(() => overlay.remove(), 300);
        showToast('Welcome to Wine & Craft Cellars', 'gold');
      });

      document.getElementById('btnAgeNo').addEventListener('click', () => {
        alert('You must be 21 or older to visit this site. Redirecting...');
        window.location.href = 'https://www.responsibility.org';
      });
    }
  }

  // --- Header Scroll Effect ---
  function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // --- Mobile Navigation Drawer ---
  function initMobileNav() {
    const hamburger = document.querySelector('.hamburger-btn');
    const navMenu = document.querySelector('.nav-menu');
    if (!hamburger || !navMenu) return;

    let backdrop = document.querySelector('.mobile-menu-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'mobile-menu-backdrop';
      document.body.appendChild(backdrop);
    }

    function toggleMenu(open) {
      const isActive = open !== undefined ? open : !navMenu.classList.contains('active');
      navMenu.classList.toggle('active', isActive);
      backdrop.classList.toggle('active', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
      const icon = hamburger.querySelector('i');
      if (icon) {
        icon.className = isActive ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    }

    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    backdrop.addEventListener('click', () => {
      toggleMenu(false);
    });

    // Close on nav-link click on mobile
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1024) toggleMenu(false);
      });
    });
  }

  // --- Mobile Catalog Filter Accordion ---
  function initMobileFilter() {
    const filterToggle = document.querySelector('.mobile-filter-toggle');
    const sidebar = document.querySelector('.catalog-sidebar');
    if (!filterToggle || !sidebar) return;

    filterToggle.addEventListener('click', () => {
      filterToggle.classList.toggle('active');
      sidebar.classList.toggle('active');
    });
  }

  // --- Cart Drawer Toggle ---
  function initCartDrawer() {
    const cartToggles = document.querySelectorAll('.cart-toggle-btn');
    const cartDrawer = document.getElementById('cartDrawer');
    const drawerClose = document.getElementById('cartDrawerClose');
    const drawerBackdrop = document.getElementById('cartDrawerBackdrop');

    if (!cartDrawer) return;

    cartToggles.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        cartDrawer.classList.add('active');
        if (drawerBackdrop) drawerBackdrop.classList.add('active');
        if (window.renderCartDrawer) window.renderCartDrawer();
      });
    });

    function closeDrawer() {
      cartDrawer.classList.remove('active');
      if (drawerBackdrop) drawerBackdrop.classList.remove('active');
    }

    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);
  }

  // --- Initialize All ---
  document.addEventListener('DOMContentLoaded', () => {
    initAgeGate();
    initHeaderScroll();
    initMobileNav();
    initMobileFilter();
    initCartDrawer();
    if (window.updateBadges) window.updateBadges();
  });
})();
