/**
 * Wine & Craft - Multi-Step Checkout Handler
 */
(function () {
  'use strict';

  function initCheckout() {
    const orderItemsContainer = document.getElementById('checkoutOrderItems');
    if (!orderItemsContainer) return;

    const cart = window.getCart ? window.getCart() : [];
    if (cart.length === 0) {
      orderItemsContainer.innerHTML = '<p style="color: var(--text-muted);">No items in cart to checkout.</p>';
      return;
    }

    let html = '';
    cart.forEach(item => {
      html += `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.85rem; font-size: 0.9rem;">
          <div>
            <strong>${item.name}</strong> ${item.vintage ? `(${item.vintage})` : ''}
            <div style="color: var(--text-light); font-size: 0.8rem;">Qty: ${item.qty}</div>
          </div>
          <span style="font-weight: 600;">$${(item.price * item.qty).toFixed(2)}</span>
        </div>
      `;
    });
    orderItemsContainer.innerHTML = html;

    const totals = window.getCartTotals ? window.getCartTotals() : { subtotal: 0, tax: 0, shipping: 0, total: 0 };
    document.getElementById('checkoutSubtotal').textContent = '$' + totals.subtotal.toFixed(2);
    document.getElementById('checkoutShipping').textContent = totals.shipping === 0 ? 'Complimentary' : '$' + totals.shipping.toFixed(2);
    document.getElementById('checkoutTax').textContent = '$' + totals.tax.toFixed(2);
    document.getElementById('checkoutTotal').textContent = '$' + totals.total.toFixed(2);

    // Form submit
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // 21+ Check
        const ageCheck = document.getElementById('ageComplianceCheckbox');
        if (ageCheck && !ageCheck.checked) {
          alert('You must confirm you are 21 years of age or older to receive alcoholic beverages.');
          return;
        }

        const orderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000);
        const newOrder = {
          id: orderId,
          date: new Date().toISOString().split('T')[0],
          total: totals.total,
          status: 'Cellared & Preparing',
          items: cart,
          tracking: 'DHL-CLIMATE-' + Math.floor(1000000 + Math.random() * 9000000)
        };

        // Save order
        const rawOrders = localStorage.getItem('winecraft_user_orders') || '[]';
        let userOrders = [];
        try { userOrders = JSON.parse(rawOrders); } catch (err) {}
        userOrders.unshift(newOrder);
        localStorage.setItem('winecraft_user_orders', JSON.stringify(userOrders));

        // Clear cart
        localStorage.removeItem('winecraft_cart');

        // Show confirmation modal
        const confirmModal = document.getElementById('orderConfirmationModal');
        if (confirmModal) {
          document.getElementById('modalOrderId').textContent = orderId;
          document.getElementById('modalOrderTotal').textContent = '$' + totals.total.toFixed(2);
          confirmModal.classList.add('active');
        } else {
          alert('Order #' + orderId + ' placed successfully! Thank you for cellaring with Wine & Craft.');
          window.location.href = '../user/orders.html';
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', initCheckout);
})();
