/**
 * Wine & Craft - Product Catalog Filtering & Rendering
 */
(function () {
  'use strict';

  // Fallback dataset for file:// protocol or offline execution
  const DEFAULT_PRODUCTS = [
  {
    "id": "prod-001",
    "name": "Château Margaux Premier Grand Cru Classé",
    "category": "wine",
    "subcategory": "bordeaux",
    "vintage": 2015,
    "region": "Margaux, Bordeaux",
    "country": "France",
    "abv": "13.5%",
    "bottle_size": "750ml",
    "price": 890,
    "sale_price": null,
    "rating": 4.9,
    "review_count": 48,
    "in_stock": true,
    "stock_count": 12,
    "badge": "Collector Reserve",
    "image": "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&w=800&q=80",
    "flavor_profile": {
      "boldness": 88,
      "sweetness": 15,
      "tannins": 85,
      "acidity": 78,
      "finish": 95
    },
    "tasting_notes": {
      "nose": "Vibrant violet florals, crushed blackberries, graphite, and toasted French oak.",
      "palate": "Silky yet structured cassis, dark plum, cigar box, and black truffle complexity.",
      "finish": "Endless, aristocratic finish with lingering mineral and cedar undertones."
    },
    "pairing": "Prime dry-aged ribeye, roast venison, or aged Comté cheese."
  },
  {
    "id": "prod-002",
    "name": "Domaine de la Romanée-Conti Grand Cru",
    "category": "wine",
    "subcategory": "burgundy",
    "vintage": 2018,
    "region": "Côte de Nuits, Burgundy",
    "country": "France",
    "abv": "13.0%",
    "bottle_size": "750ml",
    "price": 2450,
    "sale_price": null,
    "rating": 5,
    "review_count": 32,
    "in_stock": true,
    "stock_count": 4,
    "badge": "Ultra Rare",
    "image": "https://images.unsplash.com/photo-1558001373-7b93ee48ffa0?auto=format&fit=crop&w=800&q=80",
    "flavor_profile": {
      "boldness": 72,
      "sweetness": 20,
      "tannins": 65,
      "acidity": 88,
      "finish": 98
    },
    "tasting_notes": {
      "nose": "Wild rose petals, spiced cherry, sous-bois (forest floor), and exotic tea leaves.",
      "palate": "Weightless intensity, wild strawberries, orange peel, and pure velvet tannins.",
      "finish": "Ethereal, hauntingly persistent with chalky limestone minerality."
    },
    "pairing": "Roast duck breast with cherry reduction, pheasant, or Périgord black truffles."
  },
  {
    "id": "prod-003",
    "name": "Opus One Proprietary Red Blend",
    "category": "wine",
    "subcategory": "napa",
    "vintage": 2019,
    "region": "Oakville, Napa Valley",
    "country": "United States",
    "abv": "14.5%",
    "bottle_size": "750ml",
    "price": 425,
    "sale_price": 395,
    "rating": 4.8,
    "review_count": 94,
    "in_stock": true,
    "stock_count": 28,
    "badge": "Sommelier Pick",
    "image": "assets/images/products/wine/opus-one.jpg",
    "flavor_profile": {
      "boldness": 92,
      "sweetness": 25,
      "tannins": 82,
      "acidity": 70,
      "finish": 90
    },
    "tasting_notes": {
      "nose": "Fresh black cherry, espresso crema, dark cocoa, and dried bay leaf.",
      "palate": "Rich, opulent layers of ripe blueberry, vanilla bean, and polished tannins.",
      "finish": "Long, warm harmonic finish with notes of mocha and dark spices."
    },
    "pairing": "Charcoal grilled tomahawk steak, rosemary lamb racks."
  },
  {
    "id": "prod-004",
    "name": "Biondi-Santi Brunello di Montalcino Riserva",
    "category": "wine",
    "subcategory": "tuscany",
    "vintage": 2016,
    "region": "Montalcino, Tuscany",
    "country": "Italy",
    "abv": "14.0%",
    "bottle_size": "750ml",
    "price": 580,
    "sale_price": null,
    "rating": 4.9,
    "review_count": 41,
    "in_stock": true,
    "stock_count": 15,
    "badge": "Heritage",
    "image": "https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?auto=format&fit=crop&w=800&q=80",
    "flavor_profile": {
      "boldness": 84,
      "sweetness": 12,
      "tannins": 90,
      "acidity": 86,
      "finish": 94
    },
    "tasting_notes": {
      "nose": "Sour cherry, blood orange, leather, dried oregano, and crushed stone.",
      "palate": "Laser-focused acidity carrying tart red fruit, dark earth, and firm tannins.",
      "finish": "Extremely dry, austere, noble, and endlessly evolving in the glass."
    },
    "pairing": "Wild boar ragù, Florentine T-bone steak, Parmigiano-Reggiano 36 months."
  },
  {
    "id": "prod-005",
    "name": "Dom Pérignon Vintage Champagne Brut",
    "category": "wine",
    "subcategory": "champagne",
    "vintage": 2013,
    "region": "Épernay, Champagne",
    "country": "France",
    "abv": "12.5%",
    "bottle_size": "750ml",
    "price": 280,
    "sale_price": 255,
    "rating": 4.9,
    "review_count": 120,
    "in_stock": true,
    "stock_count": 40,
    "badge": "Celebration",
    "image": "https://images.unsplash.com/photo-1569919659476-f0852f6834b7?auto=format&fit=crop&w=800&q=80",
    "flavor_profile": {
      "boldness": 55,
      "sweetness": 18,
      "tannins": 10,
      "acidity": 94,
      "finish": 92
    },
    "tasting_notes": {
      "nose": "Mirabelle plum, fresh brioche, roasted almonds, and white smoke.",
      "palate": "Chiseled effervescence, crystalline citrus, salinity, and creaminess.",
      "finish": "Taut, mineral-driven finish vibrating with clean vitality."
    },
    "pairing": "Beluga caviar, freshly shucked oysters, butter-poached lobster."
  },
  {
    "id": "prod-006",
    "name": "The Macallan 18 Year Double Cask Single Malt",
    "category": "whisky",
    "subcategory": "scotch",
    "vintage": 2005,
    "region": "Speyside",
    "country": "Scotland",
    "abv": "43.0%",
    "bottle_size": "700ml",
    "price": 385,
    "sale_price": null,
    "rating": 4.9,
    "review_count": 87,
    "in_stock": true,
    "stock_count": 22,
    "badge": "Top Rated",
    "image": "assets/images/products/whisky/macallan-18.jpg",
    "flavor_profile": {
      "boldness": 86,
      "sweetness": 60,
      "tannins": 45,
      "acidity": 25,
      "finish": 92
    },
    "tasting_notes": {
      "nose": "Dried fruit, ginger, toffee, rich orange oil, and seasoned oak spice.",
      "palate": "Rich sultanas, warm cinnamon, nutmeg, treacle, and caramelized citrus.",
      "finish": "Lingering oak spice balanced with warm wood smoke and sweet orange."
    },
    "pairing": "Dark single-origin chocolate (70%+), artisanal candied ginger."
  },
  {
    "id": "prod-007",
    "name": "Lagavulin 16 Year Islay Single Malt Scotch",
    "category": "whisky",
    "subcategory": "scotch",
    "vintage": 2007,
    "region": "Islay",
    "country": "Scotland",
    "abv": "43.0%",
    "bottle_size": "700ml",
    "price": 145,
    "sale_price": 129,
    "rating": 4.8,
    "review_count": 165,
    "in_stock": true,
    "stock_count": 35,
    "badge": "Peat Master",
    "image": "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=800&q=80",
    "flavor_profile": {
      "boldness": 96,
      "sweetness": 40,
      "tannins": 50,
      "acidity": 30,
      "finish": 96
    },
    "tasting_notes": {
      "nose": "Intense peat smoke, iodine, seaweed, lapsang souchong tea, and sweet dates.",
      "palate": "Dry peat smoke filling the mouth with gentle sweetness, sea salt, and malt.",
      "finish": "Tremendously long, warming peat finish with peppery smoke and fig sweetness."
    },
    "pairing": "Smoked oysters, blue Stilton cheese, charcuterie."
  },
  {
    "id": "prod-008",
    "name": "Yamazaki 18 Year Japanese Single Malt",
    "category": "whisky",
    "subcategory": "japanese",
    "vintage": 2004,
    "region": "Osaka",
    "country": "Japan",
    "abv": "43.0%",
    "bottle_size": "700ml",
    "price": 899,
    "sale_price": null,
    "rating": 5,
    "review_count": 52,
    "in_stock": true,
    "stock_count": 6,
    "badge": "Rare Allocation",
    "image": "assets/images/products/whisky/yamazaki-18.jpg",
    "flavor_profile": {
      "boldness": 82,
      "sweetness": 55,
      "tannins": 40,
      "acidity": 20,
      "finish": 98
    },
    "tasting_notes": {
      "nose": "Mizunara Japanese oak, raisin, apricot, cafe au lait, and sandalwood.",
      "palate": "Silky blackberry, strawberry jam, dark chocolate, and spicy incense.",
      "finish": "Enthralling long finish with cedar, pipe tobacco, and dried fruit."
    },
    "pairing": "Wagyu beef tataki, unagi kabayaki, dried persimmons."
  },
  {
    "id": "prod-009",
    "name": "Pappy Van Winkle Family Reserve 15 Year",
    "category": "whisky",
    "subcategory": "bourbon",
    "vintage": 2008,
    "region": "Frankfort, Kentucky",
    "country": "United States",
    "abv": "53.5%",
    "bottle_size": "750ml",
    "price": 1850,
    "sale_price": null,
    "rating": 5,
    "review_count": 29,
    "in_stock": true,
    "stock_count": 3,
    "badge": "Legendary",
    "image": "assets/images/products/whisky/pappy-van-winkle-15.jpg",
    "flavor_profile": {
      "boldness": 94,
      "sweetness": 75,
      "tannins": 60,
      "acidity": 22,
      "finish": 98
    },
    "tasting_notes": {
      "nose": "Caramelized brown sugar, charred oak, toasted pecans, and ripe cherries.",
      "palate": "Heavy wheated viscosity, vanilla extract, leather, and dark honey.",
      "finish": "Monumental warm spice fade with decadent butterscotch and aged wood."
    },
    "pairing": "Pecan pie with bourbon glaze, aged farmhouse cheddar."
  },
  {
    "id": "prod-010",
    "name": "Monkey 47 Schwarzwald Dry Botanical Gin",
    "category": "spirits",
    "subcategory": "gin",
    "vintage": 2021,
    "region": "Black Forest",
    "country": "Germany",
    "abv": "47.0%",
    "bottle_size": "500ml",
    "price": 72,
    "sale_price": 64,
    "rating": 4.9,
    "review_count": 118,
    "in_stock": true,
    "stock_count": 45,
    "badge": "Boutique Craft",
    "image": "https://images.unsplash.com/photo-1607622750671-6cd9a99eabd1?auto=format&fit=crop&w=800&q=80",
    "flavor_profile": {
      "boldness": 78,
      "sweetness": 25,
      "tannins": 15,
      "acidity": 80,
      "finish": 86
    },
    "tasting_notes": {
      "nose": "Crisp pine juniper, citrus verbena, lingonberries, and floral cardamom.",
      "palate": "Unprecedented botanical tapestry of 47 ingredients, herbal depth, and pepper.",
      "finish": "Harmonious lingering pine and complex citrus oils."
    },
    "pairing": "Artisanal Mediterranean tonic, fresh grapefruit peel, rosemary sprig."
  },
  {
    "id": "prod-011",
    "name": "Clase Azul Reposado Artisanal Tequila",
    "category": "spirits",
    "subcategory": "agave",
    "vintage": 2020,
    "region": "Jalisco",
    "country": "Mexico",
    "abv": "40.0%",
    "bottle_size": "750ml",
    "price": 195,
    "sale_price": null,
    "rating": 4.9,
    "review_count": 140,
    "in_stock": true,
    "stock_count": 20,
    "badge": "Artisan Ceramic",
    "image": "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?auto=format&fit=crop&w=800&q=80",
    "flavor_profile": {
      "boldness": 80,
      "sweetness": 65,
      "tannins": 30,
      "acidity": 20,
      "finish": 90
    },
    "tasting_notes": {
      "nose": "Cooked blue agave, hazelnut, vanilla bean, and candied orange peel.",
      "palate": "Silky smooth agave honey, toasted wood, banana, and subtle cinnamon.",
      "finish": "Sweet, velvety finish with toasted oak and warm agave."
    },
    "pairing": "Ceviche with mango, Mexican dark chocolate with chili."
  },
  {
    "id": "prod-012",
    "name": "Del Maguey Pechuga Ancestral Mezcal",
    "category": "spirits",
    "subcategory": "mezcal",
    "vintage": 2019,
    "region": "Santa Catarina Minas, Oaxaca",
    "country": "Mexico",
    "abv": "49.0%",
    "bottle_size": "750ml",
    "price": 240,
    "sale_price": null,
    "rating": 4.8,
    "review_count": 36,
    "in_stock": true,
    "stock_count": 10,
    "badge": "Ancestral Still",
    "image": "assets/images/products/spirits/del-maguey-pechuga.jpg",
    "flavor_profile": {
      "boldness": 90,
      "sweetness": 35,
      "tannins": 25,
      "acidity": 60,
      "finish": 94
    },
    "tasting_notes": {
      "nose": "Smoked agave, ripe plantain, roasted plums, anise, and savoury mountain air.",
      "palate": "Triple-distilled through chicken breast, wild mountain fruits, sea salt, and smoke.",
      "finish": "Complex, savoury, crystalline and gently warming."
    },
    "pairing": "Oaxacan black mole with turkey, grilled grasshoppers (chapulines)."
  },
  {
    "id": "prod-013",
    "name": "Tesseron Lot No. 29 Exception XO Cognac",
    "category": "spirits",
    "subcategory": "cognac",
    "vintage": 2015,
    "region": "Grande Champagne",
    "country": "France",
    "abv": "40.0%",
    "bottle_size": "700ml",
    "price": 620,
    "sale_price": null,
    "rating": 5,
    "review_count": 24,
    "in_stock": true,
    "stock_count": 8,
    "badge": "100 Pts Parker",
    "image": "assets/images/products/spirits/tesseron-lot-29.jpg",
    "flavor_profile": {
      "boldness": 88,
      "sweetness": 50,
      "tannins": 55,
      "acidity": 35,
      "finish": 98
    },
    "tasting_notes": {
      "nose": "Rancio charentais, fig jam, cigar humidor, cocoa, and white truffles.",
      "palate": "Aged for over three generations in Limousin oak; silky dried apricots and spices.",
      "finish": "Monumental, multi-layered, infinite warmth."
    },
    "pairing": "Cuban Cohiba Behike cigar, espresso ristretto."
  },
  {
    "id": "prod-014",
    "name": "Diplomático Ambassador Selection Rum",
    "category": "spirits",
    "subcategory": "rum",
    "vintage": 2014,
    "region": "Plan de Manzano",
    "country": "Venezuela",
    "abv": "47.0%",
    "bottle_size": "700ml",
    "price": 275,
    "sale_price": 249,
    "rating": 4.9,
    "review_count": 58,
    "in_stock": true,
    "stock_count": 18,
    "badge": "Cask Strength",
    "image": "assets/images/products/spirits/diplomatico-ambassador.jpg",
    "flavor_profile": {
      "boldness": 90,
      "sweetness": 70,
      "tannins": 40,
      "acidity": 18,
      "finish": 92
    },
    "tasting_notes": {
      "nose": "Port wine richness, dried prunes, dark molasses, cinnamon, and toasted wood.",
      "palate": "Finished in Pedro Ximenez sherry butts; unctuous caramel, raisins, and dark cocoa.",
      "finish": "Rich, warming, sweet smoke and dark espresso."
    },
    "pairing": "Crème brûlée, aged Manchego with quince paste."
  },
  {
    "id": "prod-015",
    "name": "Giacomo Conterno Barolo Monfortino Riserva",
    "category": "wine",
    "subcategory": "piedmont",
    "vintage": 2013,
    "region": "Serralunga d Alba, Piedmont",
    "country": "Italy",
    "abv": "14.5%",
    "bottle_size": "750ml",
    "price": 1650,
    "sale_price": null,
    "rating": 5,
    "review_count": 19,
    "in_stock": true,
    "stock_count": 5,
    "badge": "King of Wines",
    "image": "assets/images/products/wine/conterno-barolo-monfortino.jpg",
    "flavor_profile": {
      "boldness": 92,
      "sweetness": 10,
      "tannins": 98,
      "acidity": 92,
      "finish": 99
    },
    "tasting_notes": {
      "nose": "Tar and roses, macerated cherries, licorice, mint, and white Alba truffle.",
      "palate": "Colossal structure, tensile Nebbiolo tannins with profound depth of savory fruit.",
      "finish": "Immense architectural finish that lingers for minutes."
    },
    "pairing": "Tajarin pasta with shaved white Alba truffle, braised beef in Barolo."
  },
  {
    "id": "prod-016",
    "name": "Château d'Yquem Premier Cru Supérieur",
    "category": "wine",
    "subcategory": "sauternes",
    "vintage": 2015,
    "region": "Sauternes, Bordeaux",
    "country": "France",
    "abv": "14.0%",
    "bottle_size": "750ml",
    "price": 650,
    "sale_price": null,
    "rating": 5,
    "review_count": 46,
    "in_stock": true,
    "stock_count": 6,
    "badge": "100 Pts Parker",
    "image": "assets/images/products/wine/chateau-dyquem.jpg",
    "flavor_profile": {
      "boldness": 94,
      "sweetness": 96,
      "tannins": 15,
      "acidity": 90,
      "finish": 99
    },
    "tasting_notes": {
      "nose": "Intoxicating layers of dried apricot, orange blossom, white peach, acacia honey, saffron, and candied ginger.",
      "palate": "Astonishing opulence balanced by electrifying botrytis acidity; notes of crème brûlée, marmalade, and toasted marzipan.",
      "finish": "Peerless aristocratic length carrying vibrant candied citrus peel and pure liquid honeycomb."
    },
    "pairing": "Seared Hudson Valley foie gras, artisanal Roquefort, or glazed stone fruit tart."
  }
];

  let catalog = [...DEFAULT_PRODUCTS];
  let filteredCatalog = [];
  let currentView = 'grid'; // 'grid' | 'list'

  async function loadCatalog() {
    try {
      // Relative path resolution for subpages vs root with cache-busting
      const pathPrefix = window.location.pathname.includes('/pages/') ? '../' : '';
      const res = await fetch(pathPrefix + 'data/products.json?t=' + Date.now(), { cache: 'no-store' });
      if (res.ok) {
        catalog = await res.json();
      } else {
        catalog = [...DEFAULT_PRODUCTS];
      }
    } catch (e) {
      catalog = [...DEFAULT_PRODUCTS];
    }
    filteredCatalog = [...catalog];
    initCatalogUI();
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
            ${p.vintage ? `<span class="badge badge-wine badge-vintage">${p.vintage}</span>` : ''}
          </div>
          <button class="product-wishlist-btn ${isWishlisted ? 'active' : ''}" data-wishlist-id="${p.id}" onclick="window.toggleWishlist('${p.id}')" title="Save to Wishlist" aria-label="Save to Wishlist">
            <i class="${isWishlisted ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
          </button>
          <a href="${pathPrefix}product-details.html?id=${p.id}" aria-label="View ${p.name}">
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
          <p class="product-tasting-notes">${(p.tasting_notes && p.tasting_notes.palate) ? p.tasting_notes.palate : ''}</p>
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
