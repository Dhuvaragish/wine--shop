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

    // Close on navigation link or dropdown item click on mobile
    navMenu.querySelectorAll('.nav-link, .dropdown-item').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 1120) toggleMenu(false);
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

  // --- Strict Email & Gmail Address Validator ---
  function validateEmailAddress(emailStr) {
    if (!emailStr || typeof emailStr !== 'string') {
      return { valid: false, message: 'Please enter your email address to join our community.' };
    }

    const email = emailStr.trim();
    if (email.length === 0) {
      return { valid: false, message: 'Please enter your email address to join our community.' };
    }

    // Check for whitespace
    if (/\s/.test(email)) {
      return { valid: false, message: 'Incorrect email: Address cannot contain spaces.' };
    }

    // Must have exactly one @ symbol
    const atParts = email.split('@');
    if (atParts.length !== 2) {
      if (atParts.length === 1) {
        return { valid: false, message: "Incorrect email: Missing '@' symbol." };
      } else {
        return { valid: false, message: "Incorrect email: Only one '@' symbol is allowed." };
      }
    }

    const [username, domain] = atParts;

    // Username validation
    if (!username || username.length === 0) {
      return { valid: false, message: "Incorrect email: Missing username before '@'." };
    }

    // Domain validation
    if (!domain || domain.length === 0) {
      return { valid: false, message: "Incorrect email: Missing domain after '@' (e.g. gmail.com)." };
    }

    // Domain must contain a period and cannot start or end with a period
    if (!domain.includes('.')) {
      return { valid: false, message: `Incorrect domain: '${domain}' is incomplete. Please include a full domain (e.g. @gmail.com).` };
    }

    if (domain.startsWith('.') || domain.endsWith('.')) {
      return { valid: false, message: 'Incorrect domain: Domain cannot start or end with a period.' };
    }

    if (domain.includes('..')) {
      return { valid: false, message: 'Incorrect domain: Consecutive periods (..) are not allowed.' };
    }

    // Validate Top-Level Domain (TLD)
    const domainParts = domain.split('.');
    const tld = domainParts[domainParts.length - 1].toLowerCase();
    if (tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) {
      return { valid: false, message: `Incorrect domain: '.${tld}' is not a valid domain extension (e.g. .com, .org, .co.uk).` };
    }

    // Standard RFC format check
    const generalEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!generalEmailRegex.test(email)) {
      return { valid: false, message: 'Incorrect email format: Please enter a valid address (e.g. name@gmail.com).' };
    }

    const domainLower = domain.toLowerCase();

    // Check for common typo domains (especially Gmail typos)
    const typoDomains = {
      'gmai.com': '@gmail.com',
      'gamil.com': '@gmail.com',
      'gmial.com': '@gmail.com',
      'gmaill.com': '@gmail.com',
      'gmail.co': '@gmail.com',
      'gmail.con': '@gmail.com',
      'gmail.c': '@gmail.com',
      'gma.com': '@gmail.com',
      'gmai.co': '@gmail.com',
      'gmaik.com': '@gmail.com',
      'gemail.com': '@gmail.com',
      'gmail.comm': '@gmail.com',
      'googlemail.co': '@googlemail.com',
      'googlemail.con': '@googlemail.com',
      'yahooo.com': '@yahoo.com',
      'yaho.com': '@yahoo.com',
      'hotmial.com': '@hotmail.com',
      'outlok.com': '@outlook.com',
    };

    if (typoDomains[domainLower]) {
      return {
        valid: false,
        message: `Incorrect domain: Did you mean ${typoDomains[domainLower]}?`
      };
    }

    // Specific Gmail / Googlemail strict validation rules
    if (domainLower === 'gmail.com' || domainLower === 'googlemail.com') {
      // 1. Length rule: Gmail usernames must be 6-30 characters
      if (username.length < 6) {
        return {
          valid: false,
          message: `Incorrect Gmail address: Gmail usernames must be at least 6 characters long (currently ${username.length}).`
        };
      }
      if (username.length > 30) {
        return {
          valid: false,
          message: 'Incorrect Gmail address: Gmail usernames cannot exceed 30 characters.'
        };
      }

      // 2. Allowed characters: only letters (a-z), numbers (0-9), and periods (.)
      const validGmailUserRegex = /^[a-zA-Z0-9.]+$/;
      if (!validGmailUserRegex.test(username)) {
        return {
          valid: false,
          message: 'Incorrect Gmail address: Gmail usernames only permit letters (a-z), numbers (0-9), and periods (.).'
        };
      }

      // 3. Consecutive periods
      if (username.includes('..')) {
        return {
          valid: false,
          message: 'Incorrect Gmail address: Consecutive periods (..) are not allowed.'
        };
      }

      // 4. Cannot start or end with a period
      if (username.startsWith('.') || username.endsWith('.')) {
        return {
          valid: false,
          message: 'Incorrect Gmail address: Username cannot start or end with a period.'
        };
      }
    }

    return { valid: true, email: email };
  }
  window.validateEmailAddress = validateEmailAddress;

  // --- Community / Newsletter Form Validation ---
  function initCommunityForms() {
    const formConfigs = [
      {
        form: document.getElementById('communityForm'),
        emailInput: document.getElementById('communityEmail'),
        errorDiv: document.getElementById('communityEmailError'),
        successDiv: document.getElementById('communitySuccessMsg')
      },
      {
        form: document.getElementById('blogCommunityForm'),
        emailInput: document.getElementById('blogCommunityEmail'),
        errorDiv: document.getElementById('blogCommunityError'),
        successDiv: document.getElementById('blogCommunitySuccess')
      }
    ];

    formConfigs.forEach(({ form, emailInput, errorDiv, successDiv }) => {
      if (!form || !emailInput) return;

      function clearError() {
        emailInput.classList.remove('is-invalid');
        emailInput.classList.remove('shake-error');
        if (errorDiv) {
          errorDiv.style.display = 'none';
          errorDiv.innerHTML = '';
        }
      }

      function showError(msg) {
        emailInput.classList.add('is-invalid');
        emailInput.classList.remove('is-valid');
        emailInput.classList.add('shake-error');
        setTimeout(() => emailInput.classList.remove('shake-error'), 450);

        if (errorDiv) {
          errorDiv.style.display = 'flex';
          errorDiv.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> <span>${msg}</span>`;
        }
        if (successDiv) {
          successDiv.style.display = 'none';
          successDiv.innerHTML = '';
        }
        if (window.showToast) {
          window.showToast(msg, 'error');
        }
        emailInput.focus();
      }

      function showSuccess(email) {
        emailInput.classList.remove('is-invalid');
        emailInput.classList.add('is-valid');
        if (errorDiv) {
          errorDiv.style.display = 'none';
          errorDiv.innerHTML = '';
        }
        if (successDiv) {
          successDiv.style.display = 'flex';
          successDiv.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>Welcome to our community! An exclusive allocation invitation has been sent to <strong>${email}</strong>.</span>`;
        }
        if (window.showToast) {
          window.showToast('Welcome to our community! Allocation invitation sent.', 'gold');
        }

        try {
          localStorage.setItem('winecraft_community_email', email);
        } catch (e) {}

        emailInput.value = '';
        setTimeout(() => {
          emailInput.classList.remove('is-valid');
        }, 3500);
      }

      // Live correction on input
      emailInput.addEventListener('input', () => {
        if (emailInput.classList.contains('is-invalid')) {
          const valResult = validateEmailAddress(emailInput.value);
          if (valResult.valid) {
            clearError();
            emailInput.classList.add('is-valid');
          }
        }
      });

      // Form submit validation
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const rawEmail = emailInput.value;
        const result = validateEmailAddress(rawEmail);

        if (!result.valid) {
          showError(result.message);
        } else {
          showSuccess(result.email);
        }
      });
    });
  }

  // --- Initialize All ---
  document.addEventListener('DOMContentLoaded', () => {
    initAgeGate();
    initHeaderScroll();
    initMobileNav();
    initMobileFilter();
    initCartDrawer();
    initCommunityForms();
    if (window.updateBadges) window.updateBadges();
  });
})();
