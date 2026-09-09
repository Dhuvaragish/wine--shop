/**
 * Wine & Craft - Cellar Admin Dashboard & Analytics
 */
(function () {
  'use strict';

  function initAdmin() {
    // Mobile sidebar toggle
    const toggleBtn = document.getElementById('adminSidebarToggle');
    const sidebar = document.querySelector('.admin-sidebar');
    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('active');
      });
      document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target) && sidebar.classList.contains('active')) {
          sidebar.classList.remove('active');
        }
      });
    }

    // Simple Canvas Charts if Chart.js is not loaded, or Chart.js if loaded
    renderRevenueChart();
    renderCategoryDoughnut();

    // Live table search
    const searchInput = document.getElementById('adminTableSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('.admin-table tbody tr');
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(query) ? '' : 'none';
        });
      });
    }
  }

  function renderRevenueChart() {
    const canvas = document.getElementById('revenueChart');
    if (!canvas) return;

    if (window.Chart) {
      new Chart(canvas, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          datasets: [{
            label: 'Fine Wine & Spirits Revenue ($)',
            data: [42000, 58000, 62000, 78000, 94000, 89000, 115000, 134000, 142000, 168000],
            borderColor: '#C5A059',
            backgroundColor: 'rgba(197, 160, 89, 0.1)',
            fill: true,
            tension: 0.35,
            borderWidth: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } }
        }
      });
    } else {
      // Elegant Canvas drawing fallback
      const ctx = canvas.getContext('2d');
      const w = canvas.width = canvas.parentElement.clientWidth;
      const h = canvas.height = canvas.parentElement.clientHeight;

      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = '#C5A059';
      ctx.lineWidth = 3;
      ctx.beginPath();
      const points = [0.2, 0.4, 0.35, 0.6, 0.7, 0.65, 0.85, 0.9];
      points.forEach((p, idx) => {
        const x = (idx / (points.length - 1)) * (w - 40) + 20;
        const y = h - (p * (h - 40) + 20);
        if (idx === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }
  }

  function renderCategoryDoughnut() {
    const canvas = document.getElementById('categoryChart');
    if (!canvas) return;

    if (window.Chart) {
      new Chart(canvas, {
        type: 'doughnut',
        data: {
          labels: ['Bordeaux & Burgundy', 'Rare Whiskies', 'Craft Spirits', 'Tasting Events'],
          datasets: [{
            data: [45, 30, 15, 10],
            backgroundColor: ['#722F37', '#C5A059', '#9E5638', '#2E332E'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', initAdmin);
})();
