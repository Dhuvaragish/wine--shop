/**
 * Wine & Craft - Authentication & Verification
 */
(function () {
  'use strict';

  // Reliable email & Gmail validator with fallback
  function validateEmail(email) {
    if (typeof window.validateEmailAddress === 'function') {
      return window.validateEmailAddress(email);
    }
    if (!email || typeof email !== 'string') {
      return { valid: false, message: 'Please enter your email address.' };
    }
    const trimmed = email.trim();
    if (trimmed.length === 0) {
      return { valid: false, message: 'Please enter your email address.' };
    }
    if (/\s/.test(trimmed)) {
      return { valid: false, message: 'Incorrect email: Address cannot contain spaces.' };
    }
    const atParts = trimmed.split('@');
    if (atParts.length !== 2) {
      return { valid: false, message: "Incorrect email: Please include a single '@' in your address." };
    }
    const [user, domain] = atParts;
    if (!user || user.length === 0) {
      return { valid: false, message: "Incorrect email: Missing username before '@'." };
    }
    if (!domain || !domain.includes('.')) {
      return { valid: false, message: "Incorrect domain: Missing domain extension (e.g. .com)." };
    }
    const tld = domain.split('.').pop().toLowerCase();
    if (tld.length < 2 || !/^[a-zA-Z]+$/.test(tld)) {
      return { valid: false, message: `Incorrect domain: '.${tld}' is not a valid domain extension.` };
    }
    if (domain.toLowerCase() === 'gmai.com' || domain.toLowerCase() === 'gamil.com') {
      return { valid: false, message: 'Incorrect domain: Did you mean @gmail.com?' };
    }
    if (domain.toLowerCase() === 'gmail.com' && user.length < 6) {
      return { valid: false, message: 'Incorrect Gmail address: Gmail usernames must be at least 6 characters.' };
    }
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!regex.test(trimmed)) {
      return { valid: false, message: 'Incorrect email format: Please enter a valid address (e.g. name@gmail.com).' };
    }
    return { valid: true, email: trimmed };
  }

  const ACCOUNTS_STORAGE_KEY = 'winecraft_registered_accounts';
  const DEFAULT_ACCOUNTS = [
    { email: 'connoisseur@winecraft.com', password: 'VaultSecret2026!', firstName: 'Connoisseur', lastName: 'Member' },
    { email: 'admin@winecraft.com', password: 'AdminVault2026!', firstName: 'Cellar', lastName: 'Master' }
  ];

  function getRegisteredAccounts() {
    try {
      const stored = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      const list = stored ? JSON.parse(stored) : [];
      DEFAULT_ACCOUNTS.forEach(def => {
        if (!list.some(a => a.email.toLowerCase() === def.email.toLowerCase())) {
          list.push(def);
        }
      });
      return list;
    } catch (e) {
      return [...DEFAULT_ACCOUNTS];
    }
  }

  function saveRegisteredAccount(newAcc) {
    try {
      const stored = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
      const list = stored ? JSON.parse(stored) : [];
      const idx = list.findIndex(a => a.email.toLowerCase() === newAcc.email.toLowerCase());
      if (idx >= 0) {
        list[idx] = Object.assign({}, list[idx], newAcc);
      } else {
        list.push(newAcc);
      }
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {}
  }

  function initAuth() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // --- 1. Login Form Handling ---
    if (loginForm) {
      const loginEmail = document.getElementById('loginEmail');
      const loginPass = document.getElementById('loginPassword');
      const loginError = document.getElementById('loginEmailError');
      const loginPassError = document.getElementById('loginPasswordError');

      // Check if arriving from registration
      const urlParams = new URLSearchParams(window.location.search);
      const justRegistered = urlParams.get('registered') === '1' || urlParams.get('registered') === 'true';
      const regEmail = urlParams.get('email') || localStorage.getItem('winecraft_just_registered_email');

      if (justRegistered || regEmail) {
        if (loginEmail && regEmail) {
          loginEmail.value = regEmail;
          loginEmail.classList.add('is-valid');
        }
        if (loginPass) {
          loginPass.value = '';
          setTimeout(() => loginPass.focus(), 350);
        }
        try {
          localStorage.removeItem('winecraft_just_registered_email');
        } catch (err) {}
        if (window.showToast) {
          setTimeout(() => {
            window.showToast('Registration successful! Please enter your password to sign in.', 'gold');
          }, 400);
        }
      }

      function clearLoginErrors() {
        if (loginEmail) {
          loginEmail.classList.remove('is-invalid');
          loginEmail.classList.remove('shake-error');
        }
        if (loginPass) {
          loginPass.classList.remove('is-invalid');
          loginPass.classList.remove('shake-error');
        }
        if (loginError) {
          loginError.style.display = 'none';
          loginError.innerHTML = '';
        }
        if (loginPassError) {
          loginPassError.style.display = 'none';
          loginPassError.innerHTML = '';
        }
      }

      function showLoginEmailError(msg) {
        if (loginEmail) {
          loginEmail.classList.add('is-invalid');
          loginEmail.classList.remove('is-valid');
          loginEmail.classList.add('shake-error');
          setTimeout(() => loginEmail.classList.remove('shake-error'), 450);
          loginEmail.focus();
        }
        if (loginError) {
          loginError.style.display = 'flex';
          loginError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> <span>${msg}</span>`;
        }
        if (window.showToast) {
          window.showToast(msg, 'error');
        }
      }

      function showLoginPasswordError(msg) {
        if (loginPass) {
          loginPass.classList.add('is-invalid');
          loginPass.classList.remove('is-valid');
          loginPass.classList.add('shake-error');
          setTimeout(() => loginPass.classList.remove('shake-error'), 450);
          loginPass.focus();
        }
        if (loginPassError) {
          loginPassError.style.display = 'flex';
          loginPassError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> <span>${msg}</span>`;
        } else if (loginError) {
          loginError.style.display = 'flex';
          loginError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> <span>${msg}</span>`;
        }
        if (window.showToast) {
          window.showToast(msg, 'error');
        }
      }

      // Live correction on typing
      if (loginEmail) {
        loginEmail.addEventListener('input', () => {
          if (loginEmail.classList.contains('is-invalid')) {
            const check = validateEmail(loginEmail.value);
            if (check.valid) {
              loginEmail.classList.remove('is-invalid');
              loginEmail.classList.add('is-valid');
              if (loginError) loginError.style.display = 'none';
            }
          }
        });
      }

      if (loginPass) {
        loginPass.addEventListener('input', () => {
          if (loginPass.classList.contains('is-invalid')) {
            if (loginPass.value.length > 0) {
              loginPass.classList.remove('is-invalid');
              if (loginPassError) loginPassError.style.display = 'none';
            }
          }
        });
      }

      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const rawEmail = loginEmail ? loginEmail.value : '';
        const rawPass = loginPass ? loginPass.value : '';

        // 1. STRICT EMAIL VALIDATION - Blocks login on invalid / incorrect email
        const emailValidation = validateEmail(rawEmail);
        if (!emailValidation.valid) {
          showLoginEmailError(emailValidation.message);
          return;
        }

        // 2. Validate Password presence
        if (!rawPass || rawPass.trim().length === 0) {
          showLoginPasswordError('Please enter your password.');
          return;
        }

        clearLoginErrors();
        if (loginEmail) loginEmail.classList.add('is-valid');

        const cleanEmail = emailValidation.email.toLowerCase();

        // 3. Authenticate against registered accounts and defaults
        const accounts = getRegisteredAccounts();
        const matchedAccount = accounts.find(a => a.email.toLowerCase() === cleanEmail);

        if (matchedAccount) {
          // Check Password
          if (matchedAccount.password !== rawPass) {
            showLoginPasswordError('Incorrect password for this account. Please try again.');
            return;
          }
        } else if (cleanEmail.includes('admin')) {
          // Admin quick access
          if (rawPass.length < 4) {
            showLoginPasswordError('Please enter a valid administrator password.');
            return;
          }
        } else {
          // Unregistered email
          showLoginEmailError('No allocation account found with this email. Please register for membership.');
          return;
        }

        // 4. Successful Authentication!
        try {
          localStorage.setItem('winecraft_user_logged_in', 'true');
          localStorage.setItem('winecraft_user_email', cleanEmail);
          const userName = matchedAccount ? (matchedAccount.firstName || matchedAccount.name || 'Connoisseur') : 'Connoisseur';
          localStorage.setItem('winecraft_user_name', userName);
        } catch (err) {}

        if (cleanEmail.includes('admin')) {
          if (window.showToast) window.showToast('Welcome, Cellar Master', 'gold');
          setTimeout(() => {
            window.location.href = '../admin/dashboard.html';
          }, 400);
        } else {
          const displayName = matchedAccount && matchedAccount.firstName ? matchedAccount.firstName : 'Connoisseur';
          if (window.showToast) window.showToast(`Welcome to your Cellar, ${displayName}`, 'gold');
          setTimeout(() => {
            window.location.href = '../user/dashboard.html';
          }, 400);
        }
      });
    }

    // --- 2. Register Form Handling ---
    if (registerForm) {
      const registerEmail = document.getElementById('registerEmail');
      const registerError = document.getElementById('registerEmailError');
      const registerPass = document.getElementById('registerPassword');
      const confirmPass = document.getElementById('registerConfirmPassword');
      const confirmError = document.getElementById('registerConfirmPasswordError');
      const ageCheck = document.getElementById('registerAgeCheck');

      function clearRegisterError() {
        if (registerEmail) {
          registerEmail.classList.remove('is-invalid');
          registerEmail.classList.remove('shake-error');
        }
        if (registerError) {
          registerError.style.display = 'none';
          registerError.innerHTML = '';
        }
      }

      function clearConfirmError() {
        if (confirmPass) {
          confirmPass.classList.remove('is-invalid');
          confirmPass.classList.remove('shake-error');
        }
        if (registerPass) {
          registerPass.classList.remove('is-invalid');
          registerPass.classList.remove('shake-error');
        }
        if (confirmError) {
          confirmError.style.display = 'none';
          confirmError.innerHTML = '';
        }
      }

      function showConfirmError(msg, targetInput) {
        const el = targetInput || confirmPass;
        if (el) {
          el.classList.add('is-invalid');
          el.classList.remove('is-valid');
          el.classList.add('shake-error');
          setTimeout(() => el.classList.remove('shake-error'), 450);
          el.focus();
        }
        if (confirmError) {
          confirmError.style.display = 'flex';
          confirmError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> <span>${msg}</span>`;
        }
        if (window.showToast) {
          window.showToast(msg, 'error');
        }
      }

      function showRegisterError(msg) {
        if (registerEmail) {
          registerEmail.classList.add('is-invalid');
          registerEmail.classList.remove('is-valid');
          registerEmail.classList.add('shake-error');
          setTimeout(() => registerEmail.classList.remove('shake-error'), 450);
          registerEmail.focus();
        }
        if (registerError) {
          registerError.style.display = 'flex';
          registerError.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> <span>${msg}</span>`;
        }
        if (window.showToast) {
          window.showToast(msg, 'error');
        }
      }

      // Live correction on typing
      if (registerEmail) {
        registerEmail.addEventListener('input', () => {
          if (registerEmail.classList.contains('is-invalid')) {
            const check = validateEmail(registerEmail.value);
            if (check.valid) {
              clearRegisterError();
              registerEmail.classList.add('is-valid');
            }
          }
        });
      }

      if (confirmPass) {
        confirmPass.addEventListener('input', () => {
          if (confirmPass.classList.contains('is-invalid')) {
            const p = registerPass ? registerPass.value : '';
            if (confirmPass.value === p && p.length >= 8) {
              clearConfirmError();
              confirmPass.classList.add('is-valid');
              if (registerPass) registerPass.classList.add('is-valid');
            }
          }
        });
      }

      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (ageCheck && !ageCheck.checked) {
          if (window.showToast) {
            window.showToast('You must confirm that you are at least 21 years of age.', 'error');
          } else {
            alert('You must confirm that you are at least 21 years of age.');
          }
          return;
        }

        const rawEmail = registerEmail ? registerEmail.value : '';
        const emailValidation = validateEmail(rawEmail);
        if (!emailValidation.valid) {
          showRegisterError(emailValidation.message);
          return; // STOP! Incorrect email will NEVER register!
        }

        clearRegisterError();
        if (registerEmail) registerEmail.classList.add('is-valid');

        const rawPass = registerPass ? registerPass.value : '';
        const rawConfirm = confirmPass ? confirmPass.value : '';

        // Validate Password length
        if (!rawPass || rawPass.length < 8) {
          showConfirmError('Password must be at least 8 characters long.', registerPass);
          return;
        }

        // Validate Password Match
        if (confirmPass && rawPass !== rawConfirm) {
          showConfirmError('Passwords do not match. Please ensure both passwords match.', confirmPass);
          return;
        }

        clearConfirmError();
        if (confirmPass) confirmPass.classList.add('is-valid');
        if (registerPass) registerPass.classList.add('is-valid');

        const cleanEmail = emailValidation.email.toLowerCase();
        const firstNameEl = document.getElementById('registerFirstName');
        const lastNameEl = document.getElementById('registerLastName');
        const palateEl = document.getElementById('registerPalate');

        const firstName = firstNameEl && firstNameEl.value.trim() ? firstNameEl.value.trim() : 'Connoisseur';
        const lastName = lastNameEl && lastNameEl.value.trim() ? lastNameEl.value.trim() : 'Member';
        const palate = palateEl ? palateEl.value : 'comprehensive';

        // Save new registered account so it can immediately be used on the login page!
        saveRegisteredAccount({
          email: cleanEmail,
          password: rawPass,
          firstName: firstName,
          lastName: lastName,
          palate: palate,
          registeredAt: new Date().toISOString()
        });

        // Store temporary flag for login page
        try {
          localStorage.setItem('winecraft_just_registered_email', cleanEmail);
          localStorage.setItem('winecraft_just_registered_name', firstName);
        } catch (err) {}

        if (window.showToast) {
          window.showToast('Account created! Redirecting to sign in...', 'gold');
        }
        setTimeout(() => {
          window.location.href = 'login.html?registered=1&email=' + encodeURIComponent(cleanEmail);
        }, 800);
      });
    }

    // --- 3. Toggle Password Visibility ---
    const passToggles = document.querySelectorAll('.password-toggle');
    passToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const input = toggle.previousElementSibling;
        if (input && input.type === 'password') {
          input.type = 'text';
          toggle.innerHTML = '<i class="fa-solid fa-eye-slash"></i>';
        } else if (input) {
          input.type = 'password';
          toggle.innerHTML = '<i class="fa-solid fa-eye"></i>';
        }
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initAuth);
})();
