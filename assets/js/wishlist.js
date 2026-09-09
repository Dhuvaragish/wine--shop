/**
 * Wine & Craft - Wishlist & Cellar Reserve Engine
 */
(function () {
  'use strict';
  const STORAGE_KEY = 'winecraft_wishlist';

  function getWishlist() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return ['prod-002', 'prod-008']; // Default curated saves
    try { return JSON.parse(raw); } catch (e) { return []; }
  }

  function saveWishlist(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    if (window.updateBadges) window.updateBadges();
  }

  function isInWishlist(id) {
    return getWishlist().includes(id);
  }

  function toggleWishlist(id) {
    let list = getWishlist();
    if (list.includes(id)) {
      list = list.filter(itemId => itemId !== id);
      saveWishlist(list);
      if (window.showToast) window.showToast('Removed from Cellar Wishlist', 'gold');
    } else {
      list.push(id);
      saveWishlist(list);
      if (window.showToast) window.showToast('Added to Cellar Wishlist', 'gold');
    }
    updateHeartButtons();
    if (window.renderWishlistPage) window.renderWishlistPage();
  }

  function updateHeartButtons() {
    const list = getWishlist();
    const btns = document.querySelectorAll('[data-wishlist-id]');
    btns.forEach(btn => {
      const id = btn.getAttribute('data-wishlist-id');
      const icon = btn.querySelector('i');
      if (list.includes(id)) {
        btn.classList.add('active');
        if (icon) {
          icon.className = 'fa-solid fa-heart';
          icon.style.color = 'var(--primary)';
        }
      } else {
        btn.classList.remove('active');
        if (icon) {
          icon.className = 'fa-regular fa-heart';
          icon.style.color = '';
        }
      }
    });
  }

  window.getWishlist = getWishlist;
  window.isInWishlist = isInWishlist;
  window.toggleWishlist = toggleWishlist;
  window.updateHeartButtons = updateHeartButtons;

  document.addEventListener('DOMContentLoaded', () => {
    updateHeartButtons();
  });
})();
