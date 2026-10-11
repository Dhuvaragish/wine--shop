/**
 * Wine & Craft - User Connoisseur Portal Interactions
 */
(function () {
  'use strict';

  // --- Core Validation Functions (available locally and on window) ---
  function validateName(name) {
    if (name === undefined || name === null) {
      return { valid: false, message: 'Full Legal Name is required.' };
    }
    const trimmed = String(name).trim();
    if (trimmed.length === 0) {
      return { valid: false, message: 'Full Legal Name is required.' };
    }
    // Strict check: numbers and numeric digits are strictly forbidden
    if (/\d/.test(trimmed)) {
      return {
        valid: false,
        message: 'Full Legal Name cannot contain numbers or numeric digits.'
      };
    }
    // Minimum length check
    if (trimmed.length < 2) {
      return {
        valid: false,
        message: 'Full Legal Name must be at least 2 characters.'
      };
    }
    // Maximum length check
    if (trimmed.length > 70) {
      return {
        valid: false,
        message: 'Full Legal Name cannot exceed 70 characters.'
      };
    }
    // Allowed characters: letters, spaces, hyphens, apostrophes, and periods
    const validNameRegex = /^[\p{L}\s'\-\.]+$/u;
    if (!validNameRegex.test(trimmed)) {
      return {
        valid: false,
        message: 'Full Legal Name can only contain letters, spaces, hyphens, and apostrophes.'
      };
    }
    // Must contain at least 2 letters
    const letterCount = (trimmed.match(/[\p{L}]/gu) || []).length;
    if (letterCount < 2) {
      return {
        valid: false,
        message: 'Full Legal Name must contain at least 2 letters.'
      };
    }
    return { valid: true, value: trimmed };
  }

  function validatePhoneNumber(phone, isRequired = true) {
    if (phone === undefined || phone === null) {
      return isRequired
        ? { valid: false, message: 'Telephone number is required.' }
        : { valid: true, value: '' };
    }
    const trimmed = String(phone).trim();
    if (trimmed.length === 0) {
      return isRequired
        ? { valid: false, message: 'Telephone number is required.' }
        : { valid: true, value: '' };
    }
    // Strict check: letters are strictly forbidden
    if (/[a-zA-Z\p{L}]/u.test(trimmed)) {
      return {
        valid: false,
        message: 'Telephone number cannot contain letters.'
      };
    }
    // Allowed phone characters: digits, spaces, hyphens, parentheses, dots, and plus
    const allowedCharsRegex = /^[+\d\s\-\(\)\.]+$/;
    if (!allowedCharsRegex.test(trimmed)) {
      return {
        valid: false,
        message: 'Telephone number can only contain digits, spaces, hyphens, parentheses, and an optional leading +.'
      };
    }
    // Plus sign only allowed at position 0
    const plusIndex = trimmed.indexOf('+');
    if (plusIndex > 0 || (trimmed.match(/\+/g) || []).length > 1) {
      return {
        valid: false,
        message: 'The plus sign (+) can only be at the beginning of the telephone number.'
      };
    }
    // Digit count check: 7 to 15 digits (E.164 standard)
    const digitsOnly = trimmed.replace(/\D/g, '');
    if (digitsOnly.length < 7) {
      return {
        valid: false,
        message: 'Please enter a valid telephone number (at least 7 digits, e.g. +44 7911 123456).'
      };
    }
    if (digitsOnly.length > 15) {
      return {
        valid: false,
        message: 'Telephone number cannot exceed 15 digits.'
      };
    }
    // Balanced parentheses check
    const openParens = (trimmed.match(/\(/g) || []).length;
    const closeParens = (trimmed.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      return {
        valid: false,
        message: 'Telephone number contains unbalanced parentheses.'
      };
    }
    return { valid: true, value: trimmed };
  }

  function validateEmail(email) {
    if (typeof window.validateEmailAddress === 'function') {
      return window.validateEmailAddress(email);
    }
    if (!email || !String(email).trim()) {
      return { valid: false, message: 'Email address is required.' };
    }
    const trimmed = String(email).trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      return { valid: false, message: 'Please enter a valid email address (e.g. connoisseur@winecraft.com).' };
    }
    return { valid: true, email: trimmed };
  }

  // Expose validators to window if not already present
  if (!window.validateName) window.validateName = validateName;
  if (!window.validatePhoneNumber) window.validatePhoneNumber = validatePhoneNumber;

  // --- Profile Form Validation & Management ---
  function initProfileFormValidation() {
    const form = document.getElementById('profileForm');
    if (!form) return;

    const nameInput = document.getElementById('profileName');
    const nameError = document.getElementById('profileNameError');
    const phoneInput = document.getElementById('profilePhone');
    const phoneError = document.getElementById('profilePhoneError');
    const emailInput = document.getElementById('profileEmail');
    const emailError = document.getElementById('profileEmailError');
    const preferencesInput = document.getElementById('profilePreferences');
    const submitBtn = document.getElementById('profileSubmitBtn') || form.querySelector('button[type="submit"]');

    // Restore saved profile if in localStorage
    try {
      const saved = localStorage.getItem('winecraft_user_profile');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.name && nameInput) nameInput.value = data.name;
        if (data.email && emailInput) emailInput.value = data.email;
        if (data.phone && phoneInput) phoneInput.value = data.phone;
        if (data.preferences && preferencesInput) preferencesInput.value = data.preferences;
        const sidebarName = document.querySelector('.user-name');
        if (sidebarName && data.name) sidebarName.textContent = data.name;
      }
    } catch (e) {}

    function showFieldError(input, errorEl, message) {
      if (!input) return;
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
      input.setAttribute('aria-invalid', 'true');
      input.classList.add('shake-error');
      setTimeout(() => input.classList.remove('shake-error'), 450);

      if (errorEl) {
        errorEl.style.display = 'flex';
        errorEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> <span>${message}</span>`;
      }
    }

    function clearFieldError(input, errorEl) {
      if (!input) return;
      input.classList.remove('is-invalid');
      input.classList.remove('shake-error');
      input.removeAttribute('aria-invalid');
      if (errorEl) {
        errorEl.style.display = 'none';
        errorEl.innerHTML = '';
      }
    }

    function markFieldValid(input, errorEl) {
      clearFieldError(input, errorEl);
      if (input && input.value.trim().length > 0) {
        input.classList.add('is-valid');
        input.setAttribute('aria-invalid', 'false');
      }
    }

    // Live validation for Name
    if (nameInput) {
      nameInput.addEventListener('input', () => {
        if (nameInput.classList.contains('is-invalid')) {
          const res = (window.validateName || validateName)(nameInput.value);
          if (res.valid) {
            markFieldValid(nameInput, nameError);
          }
        }
      });

      nameInput.addEventListener('blur', () => {
        const val = nameInput.value.trim();
        if (val.length > 0) {
          const res = (window.validateName || validateName)(val);
          if (!res.valid) {
            showFieldError(nameInput, nameError, res.message);
          } else {
            markFieldValid(nameInput, nameError);
          }
        }
      });
    }

    // Live validation for Phone
    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        if (phoneInput.classList.contains('is-invalid')) {
          const res = (window.validatePhoneNumber || validatePhoneNumber)(phoneInput.value, true);
          if (res.valid) {
            markFieldValid(phoneInput, phoneError);
          }
        }
      });

      phoneInput.addEventListener('blur', () => {
        const val = phoneInput.value.trim();
        if (val.length > 0) {
          const res = (window.validatePhoneNumber || validatePhoneNumber)(val, true);
          if (!res.valid) {
            showFieldError(phoneInput, phoneError, res.message);
          } else {
            markFieldValid(phoneInput, phoneError);
          }
        }
      });
    }

    // Live validation for Email
    if (emailInput) {
      emailInput.addEventListener('input', () => {
        if (emailInput.classList.contains('is-invalid')) {
          const res = validateEmail(emailInput.value);
          if (res.valid) {
            markFieldValid(emailInput, emailError);
          }
        }
      });

      emailInput.addEventListener('blur', () => {
        const val = emailInput.value.trim();
        if (val.length > 0) {
          const res = validateEmail(val);
          if (!res.valid) {
            showFieldError(emailInput, emailError, res.message);
          } else {
            markFieldValid(emailInput, emailError);
          }
        }
      });
    }

    // Handle Form Submit
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let hasErrors = false;
      let firstInvalidInput = null;

      // Validate Name
      const nameValFn = window.validateName || validateName;
      const nameResult = nameValFn(nameInput ? nameInput.value : '');
      if (!nameResult.valid) {
        showFieldError(nameInput, nameError, nameResult.message);
        hasErrors = true;
        if (!firstInvalidInput) firstInvalidInput = nameInput;
      } else {
        markFieldValid(nameInput, nameError);
      }

      // Validate Email
      if (emailInput) {
        const emailResult = validateEmail(emailInput.value);
        if (!emailResult.valid) {
          showFieldError(emailInput, emailError, emailResult.message);
          hasErrors = true;
          if (!firstInvalidInput) firstInvalidInput = emailInput;
        } else {
          markFieldValid(emailInput, emailError);
        }
      }

      // Validate Telephone
      const phoneValFn = window.validatePhoneNumber || validatePhoneNumber;
      const phoneResult = phoneValFn(phoneInput ? phoneInput.value : '', true);
      if (!phoneResult.valid) {
        showFieldError(phoneInput, phoneError, phoneResult.message);
        hasErrors = true;
        if (!firstInvalidInput) firstInvalidInput = phoneInput;
      } else {
        markFieldValid(phoneInput, phoneError);
      }

      // If invalid, block submission and focus first invalid field
      if (hasErrors) {
        if (firstInvalidInput) {
          firstInvalidInput.focus();
        }
        if (typeof window.showToast === 'function') {
          window.showToast('Please correct the highlighted errors before saving.', 'error');
        }
        return false;
      }

      // Persist valid profile
      const validName = nameResult.value;
      const validPhone = phoneResult.value;
      const validEmail = emailInput ? emailInput.value.trim() : '';
      const preferences = preferencesInput ? preferencesInput.value.trim() : '';

      try {
        localStorage.setItem('winecraft_user_profile', JSON.stringify({
          name: validName,
          phone: validPhone,
          email: validEmail,
          preferences: preferences
        }));
      } catch (err) {}

      // Update sidebar name
      const sidebarName = document.querySelector('.user-name');
      if (sidebarName && validName) {
        sidebarName.textContent = validName;
      }

      // Show luxury gold toast
      if (typeof window.showToast === 'function') {
        window.showToast('Profile updated successfully', 'gold');
      }

      // Button feedback
      if (submitBtn) {
        const originalHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fa-solid fa-check" style="margin-right: 6px;"></i> Changes Saved';
        submitBtn.disabled = true;
        setTimeout(() => {
          submitBtn.innerHTML = originalHtml;
          submitBtn.disabled = false;
        }, 2200);
      }

      return true;
    });
  }

  // --- General User Portal Interactions ---
  function initUserPortal() {
    // Active navigation highlight
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.user-menu-link');
    links.forEach(l => {
      if (currentPath.includes(l.getAttribute('href'))) {
        l.classList.add('active');
      }
    });

    // Avatar fallback handler
    const avatars = document.querySelectorAll('.user-avatar');
    avatars.forEach(img => {
      img.addEventListener('error', function () {
        this.src = '../assets/images/users/default-avatar.svg';
      });
    });

    // Address modal
    const addAddressBtn = document.getElementById('btnAddAddress');
    const addressModal = document.getElementById('addressModal');
    const closeAddressModal = document.getElementById('closeAddressModal');

    if (addAddressBtn && addressModal) {
      addAddressBtn.addEventListener('click', () => addressModal.classList.add('active'));
    }
    if (closeAddressModal && addressModal) {
      closeAddressModal.addEventListener('click', () => addressModal.classList.remove('active'));
    }

    // Initialize profile form validation
    initProfileFormValidation();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUserPortal);
  } else {
    initUserPortal();
  }
})();
