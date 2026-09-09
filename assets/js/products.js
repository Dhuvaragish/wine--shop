/**
 * Wine & Craft - Product Catalog Filtering & Rendering
 */
(function () {
  'use strict';

  let catalog = [];
  let filteredCatalog = [];
  let currentView = 'grid'; // 'grid' | 'list'

  async function loadCatalog() {
    try {
      // Relative path resolution for subpages vs root with cache-busting
      const pathPrefix = window.location.pathname.includes('/pages/') ? '../' : '';
      const res = await fetch(pathPrefix + 'data/products.json?t=' + Date.now(), { cache: 'no-store' });
      if (res.ok) {
        catalog = await res.json();

        // Home page exclusive allocation to fill the 4x4 desktop grid cleanly without altering the 15-item Cellar Vault catalog
        const isHomePage = !window.location.pathname.includes('/pages/');
        if (isHomePage) {
          const homeExclusiveCard = {
            id: 'prod-016',
            name: "Château d'Yquem Premier Cru Supérieur",
            category: 'wine',
            subcategory: 'sauternes',
            vintage: 2015,
            region: 'Sauternes, Bordeaux',
            country: 'France',
            abv: '14.0%',
            bottle_size: '750ml',
            price: 650,
            sale_price: null,
            rating: 5,
            review_count: 46,
            in_stock: true,
            stock_count: 6,
            badge: '100 Pts Parker',
            image: 'assets/images/products/wine/chateau-dyquem.jpg',
            flavor_profile: {
              boldness: 94,
              sweetness: 96,
              tannins: 15,
              acidity: 90,
              finish: 99
            },
            tasting_notes: {
              nose: 'Intoxicating layers of dried apricot, orange blossom, white peach, acacia honey, saffron, and candied ginger.',
              palate: 'Astonishing opulence balanced by electrifying botrytis acidity; notes of crème brûlée, marmalade, and toasted marzipan.',
              finish: 'Peerless aristocratic length carrying vibrant candied citrus peel and pure liquid honeycomb.'
            },
            pairing: 'Seared Hudson Valley foie gras, artisanal Roquefort, or glazed stone fruit tart.'
          };

          if (!catalog.some(item => item.id === 'prod-016')) {
            catalog.push(homeExclusiveCard);
          }
        }

        filteredCatalog = [...catalog];
        initCatalogUI();
      }
    } catch (e) {
      console.error('Failed to load products.json, using fallback data', e);
    }
  }

  function renderProductCard(p) {
    const isWishlisted = window.isInWishlist ? window.isInWishlist(p.id) : false;
    const priceFormatted = p.price ? p.price.toFixed(2) : '0.00';
    const saleFormatted = p.sale_price ? p.sale_price.toFixed(2) : null;
    const pathPrefix = window.location.pathname.includes('/pages/') ? '' : 'pages/';
    const assetPrefix = window.location.pathname.includes('/pages/') ? '../' : '';
    const imageSrc = (p.image && (p.image.startsWith('http://') || p.image.startsWith('https://') || p.image.startsWith('data:')))
      ? p.image
      : (assetPrefix + (p.image || '').replace(/^(\.\.\/|\.\/|\/)/, ''));

    return `
      <div class="product-card" data-category="${p.category}" data-subcategory="${p.subcategory}" data-price="${p.price}">
        <div class="product-image-wrap">
          <div class="product-badges">
            ${p.badge ? `<span class="badge badge-gold">${p.badge}</span>` : ''}
            ${p.vintage ? `<span class="badge badge-wine">${p.vintage}</span>` : ''}
          </div>
          <button class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" data-wishlist-id="${p.id}" onclick="window.toggleWishlist('${p.id}')" title="Save to Wishlist">
            <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>
          <a href="${pathPrefix}product-details.html?id=${p.id}">
            <img src="${imageSrc}" alt="${p.name}" class="product-image" loading="lazy">
          </a>
        </div>
        <div class="product-content">
          <div class="product-meta">
            <span class="product-region"><i class="fa-solid fa-location-dot" style="margin-right: 4px;"></i>${p.region}</span>
            <span>${p.abv} • ${p.bottle_size}</span>
          </div>
          <h3 class="product-title">
            <a href="${pathPrefix}product-details.html?id=${p.id}">${p.name}</a>
          </h3>
          <p class="product-tasting-notes">${p.tasting_notes.palate}</p>
          <div class="product-rating">
            <div class="rating-stars">
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
              <i class="fa-solid fa-star"></i>
            </div>
            <span style="font-weight: 700;">${p.rating}</span>
            <span style="color: var(--text-light);">(${p.review_count})</span>
          </div>
          <div class="product-footer">
            <div class="product-price">
              ${saleFormatted ? `
                <span class="current-price" style="color: var(--primary);">$${saleFormatted}</span>
                <span class="original-price">$${priceFormatted}</span>
              ` : `
                <span class="current-price">$${priceFormatted}</span>
              `}
            </div>
            <button class="btn btn-primary btn-sm" onclick="window.addToCartById('${p.id}')">
              <i class="fa-solid fa-cart-plus"></i> Add
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderGrid(items, containerId = 'productsGrid') {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (items.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; color: var(--text-muted);">
          <i class="fa-solid fa-filter-circle-xmark" style="font-size: 3rem; color: var(--accent-gold); margin-bottom: 1rem; display: block;"></i>
          <h3 style="font-family: var(--font-serif); margin-bottom: 0.5rem;">No Vintages Found</h3>
          <p>Try clearing your active filters or adjusting the price/vintage range.</p>
          <button class="btn btn-outline-gold" onclick="window.resetFilters()" style="margin-top: 1rem;">Reset All Filters</button>
        </div>
      `;
      return;
    }

    container.innerHTML = items.map(p => renderProductCard(p)).join('');
    if (window.updateHeartButtons) window.updateHeartButtons();
  }

  function applyFilters() {
    const searchInput = document.getElementById('productSearchInput');
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

    const categoryChips = document.querySelectorAll('.cat-chip.active');
    const selectedCats = Array.from(categoryChips).map(c => c.getAttribute('data-category'));

    const priceSlider = document.getElementById('priceRangeSlider');
    const maxPrice = priceSlider ? parseFloat(priceSlider.value) : 3000;

    const sortSelect = document.getElementById('productSortSelect');
    const sortVal = sortSelect ? sortSelect.value : 'featured';

    filteredCatalog = catalog.filter(p => {
      // Search
      if (query && !p.name.toLowerCase().includes(query) && !p.region.toLowerCase().includes(query)) {
        return false;
      }
      // Category
      if (selectedCats.length > 0 && !selectedCats.includes('all') && !selectedCats.includes(p.category)) {
        return false;
      }
      // Price
      const actualPrice = p.sale_price || p.price;
      if (actualPrice > maxPrice) return false;

      return true;
    });

    // Sorting
    if (sortVal === 'price-low') {
      filteredCatalog.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
    } else if (sortVal === 'price-high') {
      filteredCatalog.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
    } else if (sortVal === 'rating') {
      filteredCatalog.sort((a, b) => b.rating - a.rating);
    } else if (sortVal === 'vintage') {
      filteredCatalog.sort((a, b) => (b.vintage || 0) - (a.vintage || 0));
    }

    renderGrid(filteredCatalog);
    const countEl = document.getElementById('productCountBadge');
    if (countEl) countEl.textContent = `Showing ${filteredCatalog.length} curated selections`;
  }

  window.addToCartById = function (id) {
    const p = catalog.find(item => item.id === id);
    if (p && window.addToCart) {
      window.addToCart(p, 1);
    }
  };

  window.resetFilters = function () {
    const searchInput = document.getElementById('productSearchInput');
    if (searchInput) searchInput.value = '';
    const priceSlider = document.getElementById('priceRangeSlider');
    if (priceSlider) priceSlider.value = 3000;
    const priceVal = document.getElementById('priceRangeValue');
    if (priceVal) priceVal.textContent = '$3,000';

    document.querySelectorAll('.cat-chip').forEach(c => {
      c.classList.remove('active');
      if (c.getAttribute('data-category') === 'all') c.classList.add('active');
    });

    applyFilters();
  };

  function initCatalogUI() {
    renderGrid(catalog);

    // Search
    const searchInput = document.getElementById('productSearchInput');
    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
    }

    // Category Chips
    const catChips = document.querySelectorAll('.cat-chip');
    catChips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        e.preventDefault();
        catChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        applyFilters();
      });
    });

    // Price Slider
    const priceSlider = document.getElementById('priceRangeSlider');
    const priceVal = document.getElementById('priceRangeValue');
    if (priceSlider && priceVal) {
      priceSlider.addEventListener('input', () => {
        priceVal.textContent = '$' + parseInt(priceSlider.value).toLocaleString();
        applyFilters();
      });
    }

    // Sorting
    const sortSelect = document.getElementById('productSortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', applyFilters);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    loadCatalog();
  });
})();
