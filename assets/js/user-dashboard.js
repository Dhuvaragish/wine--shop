/**
 * Wine & Craft - User Connoisseur Portal Interactions
 */
(function () {
  'use strict';

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
  }

  document.addEventListener('DOMContentLoaded', initUserPortal);
})();
