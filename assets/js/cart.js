/**
 * Wine & Craft - Shopping Cart Engine
 */
(function () {
  'use strict';
  const STORAGE_KEY = 'winecraft_cart';
  const COUPON_KEY = 'winecraft_coupon';

  // Sample default items for initial delightful demonstration
  function getDefaultCart() {
    return [
      {
        id: 'prod-001',
        name: 'Château Margaux Premier Grand Cru Classé',
        price: 890.00,
        vintage: 2015,
        image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=800&q=80',
        qty: 1
      },
      {
        id: 'prod-007',
        name: 'Lagavulin 16 Year Islay Single Malt Scotch',
        price: 129.00,
        vintage: 2007,
        image: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=800&q=80',
        qty: 2
      }
    ];
  }

  function getCart() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getDefaultCart();
      saveCart(initial);
      return initial;
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    updateBadges();
  }

  function addToCart(item, qty = 1) {
    const cart = getCart();
    const existing = cart.find(i => i.id === item.id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price: item.sale_price || item.price,
        vintage: item.vintage || '',
        image: item.image,
        qty: qty
      });
    }
    saveCart(cart);
    if (window.showToast) {
      window.showToast(`Added "${item.name}" to Cellar Cart`, 'gold');
    }
    renderCartDrawer();
  }

  function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(i => i.id !== id);
    saveCart(cart);
    renderCartDrawer();
    if (window.renderCartPage) window.renderCartPage();
    if (window.showToast) window.showToast('Item removed from cart', 'gold');
  }

  function updateQuantity(id, delta) {
    const cart = getCart();
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      removeFromCart(id);
      return;
    }
    saveCart(cart);
    renderCartDrawer();
    if (window.renderCartPage) window.renderCartPage();
  }

  function getCartTotals() {
    const cart = getCart();
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const coupon = localStorage.getItem(COUPON_KEY);
    let discount = 0;
    if (coupon === 'VINTAGE10') discount = subtotal * 0.10;
    if (coupon === 'SOMMELIER20') discount = subtotal * 0.20;

    const shipping = subtotal > 500 || subtotal === 0 ? 0 : 35.00; // Free climate shipping over $500
    const tax = (subtotal - discount) * 0.08; // 8% Cellar luxury tax
    const total = subtotal - discount + shipping + tax;

    return { subtotal, discount, shipping, tax, total, coupon };
  }

  function renderCartDrawer() {
    const drawerBody = document.getElementById('cartDrawerItems');
    const subtotalEl = document.getElementById('cartDrawerSubtotal');
    if (!drawerBody) return;

    const cart = getCart();
    if (cart.length === 0) {
      drawerBody.innerHTML = `
        <div style="text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <i class="fa-solid fa-wine-bottle" style="font-size: 2.5rem; color: var(--accent-gold); margin-bottom: 1rem; display: block;"></i>
          <p style="font-size: 1.1rem; font-family: var(--font-serif); margin-bottom: 0.5rem;">Your Cellar Cart is Empty</p>
          <p style="font-size: 0.875rem;">Explore our curated vintages and craft spirits to begin your collection.</p>
        </div>
      `;
      if (subtotalEl) subtotalEl.textContent = '$0.00';
      return;
    }

    let html = '';
    const assetPrefix = window.location.pathname.includes('/pages/') ? '../' : '';
    cart.forEach(item => {
      const imgSrc = (item.image && (item.image.startsWith('http://') || item.image.startsWith('https://') || item.image.startsWith('data:')))
        ? item.image
        : (assetPrefix + (item.image || '').replace(/^(\.\.\/|\.\/|\/)/, ''));
      html += `
        <div class="cart-item-mini">
          <img src="${imgSrc}" alt="${item.name}" class="cart-item-thumb">
          <div class="cart-item-info">
            <h4 class="cart-item-title">${item.name}</h4>
            <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.5rem;">
              <span class="cart-item-price">$${item.price.toFixed(2)}</span>
              <div style="display: flex; align-items: center; gap: 0.5rem; border: 1px solid var(--border-color); border-radius: 4px; padding: 2px 6px;">
                <button onclick="window.updateQuantity('${item.id}', -1)" style="border:none;background:none;cursor:pointer;color:var(--text-muted);font-weight:bold;">-</button>
                <span style="font-size: 0.85rem; font-weight: 600;">${item.qty}</span>
                <button onclick="window.updateQuantity('${item.id}', 1)" style="border:none;background:none;cursor:pointer;color:var(--text-muted);font-weight:bold;">+</button>
              </div>
              <button onclick="window.removeFromCart('${item.id}')" style="border:none;background:none;cursor:pointer;color:var(--status-danger);font-size:0.85rem;" title="Remove">
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    });
    drawerBody.innerHTML = html;

    const totals = getCartTotals();
    if (subtotalEl) subtotalEl.textContent = '$' + totals.subtotal.toFixed(2);
  }

  function updateBadges() {
    const cart = getCart();
    const count = cart.reduce((acc, item) => acc + item.qty, 0);
    const badges = document.querySelectorAll('.cart-badge');
    badges.forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'flex' : 'none';
    });

    const wishlistRaw = localStorage.getItem('winecraft_wishlist');
    let wishCount = 0;
    try {
      wishCount = wishlistRaw ? JSON.parse(wishlistRaw).length : 0;
    } catch(e) {}
    const wishBadges = document.querySelectorAll('.wishlist-badge');
    wishBadges.forEach(b => {
      b.textContent = wishCount;
      b.style.display = wishCount > 0 ? 'flex' : 'none';
    });
  }

  window.getCart = getCart;
  window.addToCart = addToCart;
  window.removeFromCart = removeFromCart;
  window.updateQuantity = updateQuantity;
  window.getCartTotals = getCartTotals;
  window.renderCartDrawer = renderCartDrawer;
  window.updateBadges = updateBadges;

  document.addEventListener('DOMContentLoaded', () => {
    updateBadges();
    renderCartDrawer();
  });
})();
