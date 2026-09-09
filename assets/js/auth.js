/**
 * Wine & Craft - Authentication & Verification
 */
(function () {
  'use strict';

  function initAuth() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const pass = document.getElementById('loginPassword').value;

        if (email.includes('admin')) {
          if (window.showToast) window.showToast('Welcome, Cellar Master', 'gold');
          window.location.href = '../admin/dashboard.html';
        } else {
          if (window.showToast) window.showToast('Welcome back, Connoisseur', 'gold');
          window.location.href = '../user/dashboard.html';
        }
      });
    }

    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const ageCheck = document.getElementById('registerAgeCheck');
        if (ageCheck && !ageCheck.checked) {
          alert('You must confirm that you are at least 21 years of age.');
          return;
        }
        if (window.showToast) window.showToast('Account created! Welcome to the Connoisseur Club', 'gold');
        setTimeout(() => {
          window.location.href = '../user/dashboard.html';
        }, 800);
      });
    }

    // Toggle password visibility
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
