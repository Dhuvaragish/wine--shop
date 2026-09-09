/**
 * Wine & Craft - Tasting Events & Masterclasses Engine
 */
(function () {
  'use strict';

  function initEventsBooking() {
    const bookButtons = document.querySelectorAll('.btn-book-event');
    const modal = document.getElementById('eventBookingModal');
    const closeBtn = document.getElementById('closeEventModal');

    if (!modal) return;

    bookButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const eventTitle = btn.getAttribute('data-event-title') || 'Masterclass Tasting Experience';
        const eventPrice = parseFloat(btn.getAttribute('data-event-price') || '250.00');

        document.getElementById('modalEventTitle').textContent = eventTitle;
        document.getElementById('modalTicketPrice').textContent = '$' + eventPrice.toFixed(2);
        updateEventTotal(eventPrice);

        modal.classList.add('active');
      });
    });

    function updateEventTotal(price) {
      const qtyInput = document.getElementById('ticketQty');
      const totalEl = document.getElementById('modalTotalBooking');
      if (qtyInput && totalEl) {
        const qty = parseInt(qtyInput.value) || 1;
        totalEl.textContent = '$' + (price * qty).toFixed(2);
      }
    }

    const qtyInput = document.getElementById('ticketQty');
    if (qtyInput) {
      qtyInput.addEventListener('change', () => {
        const price = parseFloat(document.getElementById('modalTicketPrice').textContent.replace('$', '')) || 250;
        updateEventTotal(price);
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }

    const form = document.getElementById('eventBookingForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        modal.classList.remove('active');
        if (window.showToast) {
          window.showToast('Reservation confirmed! Digital tasting pass generated.', 'gold');
        }
        setTimeout(() => {
          const pathPrefix = window.location.pathname.includes('/pages/') ? '../' : '';
          window.location.href = pathPrefix + 'user/events.html';
        }, 1200);
      });
    }
  }

  document.addEventListener('DOMContentLoaded', initEventsBooking);
})();
