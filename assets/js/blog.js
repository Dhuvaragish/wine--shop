/**
 * Wine & Craft - Cellar Journal & Blog Engine
 */
(function () {
  'use strict';

  // Fallback dataset for file:// protocol or offline execution
  const DEFAULT_BLOGS = [
    {
      "id": "blog-001",
      "title": "The 2015 Bordeaux Decade Retrospective: Terroir, Evolution & Provenance",
      "slug": "bordeaux-2015-decade-retrospective",
      "category": "Vintage Reports",
      "categorySlug": "vintage-reports",
      "author": {
        "name": "Jean-Luc Moreau",
        "role": "Master Sommelier & Chief Curator",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
      },
      "date": "October 14, 2026",
      "readTime": "6 min read",
      "image": "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=1200&q=85",
      "excerpt": "A decade after the historic 2015 harvest, we uncork First Growths from Margaux and Pauillac to evaluate aging curves, tannins, and current optimal drinking windows.",
      "tags": ["Bordeaux", "Grand Cru", "Cellar Aging", "Vintage 2015"],
      "sommelierTip": "Decant for 90 minutes at 16°C to release graphite, blackberry compote, and French oak cedar nuances.",
      "pairingSuggestion": "Roasted dry-aged squab with black truffle reduction or 36-month Comté cheese.",
      "content": [
        "Ten years have elapsed since the sun-drenched growing season of 2015 bathed the Left and Right Banks of Bordeaux in near-miraculous climatic stability. Across Margaux, Pauillac, Saint-Julien, and Pomerol, the vintage was immediately heralded as a triumph of classical balance and aristocratic depth.",
        "Today, our cellar master panel convened in the Mayfair tasting vault to systematically evaluate twelve marquee First Growths and Super Seconds. What becomes immediately apparent is the majestic composure of the Cabernet Sauvignon fruit. Where warm vintages occasionally sacrifice freshness for opulence, 2015 displays a vibrant mineral core anchored by graphite and gravelly grip.",
        "Château Margaux 2015, created during the estate's milestone bicentenary, is entering a breathtaking secondary phase. The explosive violet and cassis perfume has deepened into layered aromas of black tea, Spanish cedar, and crushed stones. On the palate, the ultra-fine tannins have softened from impenetrable velvet into seamless silk.",
        "For private collectors cellaring the 2015 vintage, patience remains amply rewarded. While Right Bank Merlots from Saint-Émilion are providing sumptuous pleasure right now, the Left Bank Grand Crus will continue to appreciate and evolve gracefully through 2050."
      ]
    },
    {
      "id": "blog-002",
      "title": "Whisky Alchemy: The Rare Maturation Magic of Mizunara Japanese Oak",
      "slug": "mizunara-japanese-oak-whisky-maturation",
      "category": "Spirits Masterclass",
      "categorySlug": "spirits-masterclass",
      "author": {
        "name": "Etsuko Tanaka",
        "role": "Distillation Historian & Single Cask Specialist",
        "avatar": "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80"
      },
      "date": "October 02, 2026",
      "readTime": "5 min read",
      "image": "https://images.unsplash.com/photo-1527281400683-1aae777175f8?auto=format&fit=crop&w=1200&q=85",
      "excerpt": "Quercus mongolica, or Japanese Mizunara oak, is notoriously temperamental to cooper. Yet it imparts sandalwood, temple incense, and oriental spice unmatched in world distilling.",
      "tags": ["Japanese Whisky", "Mizunara Oak", "Cask Craft", "Rare Spirits"],
      "sommelierTip": "Serve neat in a stemmed Glencairn at room temperature (18°C); add a single drop of soft spring water to unlock sandalwood aromatics.",
      "pairingSuggestion": "Charred wagyu beef nigiri or Valrhona dark chocolate tart with candied orange peel.",
      "content": [
        "In the dense, snow-capped forests of Hokkaido and Tohoku, Japanese water oak—known as Mizunara—takes upwards of two centuries to reach cooperage maturity. Twisted, porous, and prone to leakage, it was long considered an unruly wood for aging spirits compared to American white oak or European Quercus robur.",
        "World War II embargoes forced Japanese distillers to craft native casks out of necessity. What followed was one of distillation history's most magnificent discoveries: after twelve to fifteen years in Mizunara wood, the spirit undergoes an aromatic transmutation.",
        "High concentrations of lactones and vanillin yield exotic notes of kyara incense, sandalwood, ripe coconut, and dried apricots. Unlike the bold vanilla and caramelized sugar of bourbon casks, Mizunara finishes with an ethereal, meditative dryness that lingers for minutes.",
        "Our latest cellar acquisition features a single-cask release finished in first-fill Mizunara hogshead #3829. Only 214 numbered decanters exist worldwide, each sealed with artisanal washi paper."
      ]
    },
    {
      "id": "blog-003",
      "title": "Cellar Architecture: Designing & Maintaining Archival Storage at Home",
      "slug": "cellar-architecture-archival-storage-home",
      "category": "Collector's Guide",
      "categorySlug": "collectors-guide",
      "author": {
        "name": "Marcus Vance",
        "role": "Head Cellar Engineer & Provenance Auditor",
        "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
      },
      "date": "September 24, 2026",
      "readTime": "8 min read",
      "image": "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=85",
      "excerpt": "From vapor barrier engineering to split-system climate control and low-UV LED illumination, learn how top connoisseurs safeguard six-figure cellar investments.",
      "tags": ["Cellar Care", "Temperature Control", "Collector Tips", "Provenance"],
      "sommelierTip": "Maintain consistent 12°C to 14°C (53°F-57°F) and 65-75% relative humidity. Stability is far more critical than an exact absolute degree.",
      "pairingSuggestion": "Protecting investments like Romanée-Conti and Pétrus requires zero vibration and darkness.",
      "content": [
        "Wine is an organic, living matrix. Within each sealed bottle, micro-oxygenation continues uninterrupted across decades, transforming primary fruit pigments and harsh acids into complex tertiary esters and silky phenolics. Yet this delicate transformation can be instantly derailed by heat spikes, humidity loss, or high-frequency vibration.",
        "When building a dedicated private cellar, the envelope insulation is paramount. Closed-cell polyurethane spray foam combined with an unbroken 6-mil polyethylene vapor barrier on the warm side of the wall prevents moisture transfer and condensation behind racking.",
        "Temperature stability must remain within ±1.5°C over twenty-four hours. Rapid thermal cycling causes corks to expand and contract, which breaks the airtight seal and induces premature ullage and maderization.",
        "Equally critical is eliminating ambient vibration. Compressor units should always be remotely ducted rather than wall-mounted directly adjacent to racking, preserving the calm equilibrium essential for delicate sediment precipitation."
      ]
    },
    {
      "id": "blog-004",
      "title": "The Botanical Renaissance: Modern Micro-Batch Gin Distillation",
      "slug": "botanical-renaissance-micro-batch-gin",
      "category": "Craft Distilling",
      "categorySlug": "craft-distilling",
      "author": {
        "name": "Fiona Campbell",
        "role": "Master Distiller & Spirits Curator",
        "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
      },
      "date": "September 15, 2026",
      "readTime": "5 min read",
      "image": "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=1200&q=85",
      "excerpt": "Hyper-local foraging, vacuum rotary evaporation, and single-estate grain neutral spirits are elevating craft gin from casual cocktail mixer to artisanal collector elixir.",
      "tags": ["Craft Gin", "Botanicals", "Distillation", "Artisanal"],
      "sommelierTip": "Sip artisanal gins in a copita glass with tonic served separately so you can appreciate the essential botanical oils first.",
      "pairingSuggestion": "Smoked Scottish salmon blinis or oysters with cucumber-mignonette pearls.",
      "content": [
        "For centuries, London Dry gin was defined by the domineering pine needle punch of Macedonian juniper berries and angelica root. While respecting this noble lineage, contemporary master distillers are adopting sophisticated techniques borrowed from luxury perfumeries.",
        "Sub-ambient vacuum distillation allows delicate botanicals—such as fresh bergamot peel, elderflower, and foraged sea kelp—to vaporize at mere room temperatures without scorching delicate aromatic compounds.",
        "Furthermore, base spirit provenance has taken center stage. Artisans are rejecting generic neutral grain spirit in favor of single-farm heritage winter wheat, estate malted barley, and even upcycled grape skins from organic vineyards.",
        "The result is gin of startling complexity, capable of expressing distinct terroir through botanical aromatics that evolve in the glass from bright citrus zest to floral earthiness."
      ]
    },
    {
      "id": "blog-005",
      "title": "Sommelier Secrets: Decanting Masterclass from 1982 to 2020",
      "slug": "sommelier-decanting-masterclass-vintage-wine",
      "category": "Tasting Techniques",
      "categorySlug": "tasting-techniques",
      "author": {
        "name": "Jean-Luc Moreau",
        "role": "Master Sommelier & Chief Curator",
        "avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80"
      },
      "date": "September 02, 2026",
      "readTime": "6 min read",
      "image": "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=85",
      "excerpt": "When to aerate vigorously versus when to pour with surgical care over a candle: demystifying the decanter for young powerhouse Cabernets and fragile century-old Barolos.",
      "tags": ["Decanting", "Sommelier Tips", "Vintage Wine", "Cellar Service"],
      "sommelierTip": "Stand the bottle upright for 48 hours prior to decanting so fine sediment settles firmly at the base.",
      "pairingSuggestion": "A proper lead-free crystal carafe with a broad base for young wines, narrow neck for venerable vintages.",
      "content": [
        "No single cellar ritual produces more passionate disagreement among sommeliers than decanting. Should a 1982 Château Lafite Rothschild receive three hours in a crystal ship's decanter, or will sudden oxygen exposure collapse its delicate floral perfume within fifteen minutes?",
        "The key lies in understanding the difference between aeration for opening youthful wines and sedimentation separation for aged bottles.",
        "For youthful, high-extract wines (such as 2018 Napa Valley Cabernet or 2020 Brunello di Montalcino), broad-base decanting accelerates oxidation, softening astringent tannins and releasing locked esters. You can splash pour with confidence.",
        "Conversely, for bottles older than 25 years, decant solely to remove sediment. Use a steady stream illuminated by a candle or flashlight beneath the shoulder of the bottle, stopping the millisecond you observe particulate entering the neck. Serve immediately to capture the fleeting bouquet."
      ]
    },
    {
      "id": "blog-006",
      "title": "The Art of Pairing: Islay Peated Single Malts with Artisan Chocolates",
      "slug": "pairing-islay-single-malts-artisan-chocolates",
      "category": "Pairing Arts",
      "categorySlug": "pairing-arts",
      "author": {
        "name": "Fiona Campbell",
        "role": "Master Distiller & Spirits Curator",
        "avatar": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80"
      },
      "date": "August 20, 2026",
      "readTime": "4 min read",
      "image": "https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=85",
      "excerpt": "Maritime salinity, medicinal peat smoke, and intense cacao solids create a harmonic gastronomic synergy. Explore our curated flight of 5 single malts with single-origin beans.",
      "tags": ["Food Pairing", "Single Malt", "Chocolate", "Islay Scotch"],
      "sommelierTip": "Allow a small shard of 75% dark chocolate to melt halfway on the tongue before taking a sip of cask-strength Islay malt.",
      "pairingSuggestion": "Lagavulin 16Y with Madagascar 72% Sambirano single-origin dark chocolate.",
      "content": [
        "The medicinal peat smoke, iodine, and brine of Scotch from the southern shores of Islay might seem unyielding companions for sweets. Yet when paired with single-origin bean-to-bar dark chocolate, the chemical interaction produces astonishing balance.",
        "Cacao butter coats the palate, moderating the alcoholic heat of cask-strength spirits, while the natural bitterness of unadulterated criollo cacao cuts through oily malt textures.",
        "In our private tasting trials, Laphroaig 10 Cask Strength paired with smoked sea-salt infused Ecuadorian chocolate created an explosion of campfire caramel, toasted hazelnut, and sweet tobacco.",
        "Host your own flight by curating three distinct peat intensities alongside chocolates ranging from 68% to 85% cacao, noting how each sip reframes the bean's fruity and earthy characteristics."
      ]
    }
  ];

  let allBlogs = DEFAULT_BLOGS;

  // Attempt to load from data/blogs.json if available
  async function loadBlogsData() {
    try {
      const basePath = window.location.pathname.includes('/pages/') ? '../data/blogs.json' : 'data/blogs.json';
      const res = await fetch(basePath);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          allBlogs = data;
        }
      }
    } catch (e) {
      // Fallback to DEFAULT_BLOGS silently
    }
  }

  // --- Render Blog Card Helper ---
  function createBlogCardHTML(post, isHome = false) {
    const detailLink = isHome ? `pages/blog-details.html?id=${post.id}` : `blog-details.html?id=${post.id}`;
    return `
      <article class="blog-card" data-category="${post.categorySlug}">
        <div class="blog-card-img-wrap">
          <a href="${detailLink}">
            <img src="${post.image}" alt="${post.title}" loading="lazy">
          </a>
          <span class="badge badge-gold blog-card-badge">${post.category}</span>
        </div>
        <div class="blog-card-body">
          <div class="blog-card-meta">
            <span><i class="fa-regular fa-calendar"></i> ${post.date}</span>
            <span>•</span>
            <span><i class="fa-regular fa-clock"></i> ${post.readTime}</span>
          </div>
          <h3 class="blog-card-title">
            <a href="${detailLink}">${post.title}</a>
          </h3>
          <p class="blog-card-excerpt">${post.excerpt}</p>
          <div class="blog-card-footer">
            <div class="blog-author-mini">
              <img src="${post.author.avatar}" alt="${post.author.name}" class="blog-author-avatar">
              <span class="blog-author-name">${post.author.name}</span>
            </div>
            <a href="${detailLink}" class="blog-read-more-btn">
              Read Story <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </article>
    `;
  }

  // --- Home Page Blog Section ---
  function initHomeBlog() {
    const grid = document.getElementById('homeBlogGrid');
    if (!grid) return;
    const featured = allBlogs.slice(0, 3);
    grid.innerHTML = featured.map(post => createBlogCardHTML(post, true)).join('');
  }

  // --- Catalog Page (blog.html) ---
  function initBlogCatalog() {
    const grid = document.getElementById('blogGrid');
    if (!grid) return;

    const searchInput = document.getElementById('blogSearch');
    const filterPills = document.querySelectorAll('.blog-filter-pill');
    let currentCategory = 'all';
    let currentSearch = '';

    function filterAndRender() {
      const filtered = allBlogs.filter(post => {
        const matchesCategory = (currentCategory === 'all' || post.categorySlug === currentCategory);
        const searchTarget = (post.title + ' ' + post.excerpt + ' ' + post.tags.join(' ') + ' ' + post.author.name).toLowerCase();
        const matchesSearch = !currentSearch || searchTarget.includes(currentSearch);
        return matchesCategory && matchesSearch;
      });

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--bg-surface); border-radius: var(--radius-md); border: 1px dashed var(--border-color);">
            <i class="fa-solid fa-book-open" style="font-size: 2.5rem; color: var(--accent-gold); margin-bottom: 1rem;"></i>
            <h3 style="margin-bottom: 0.5rem; font-family: var(--font-serif);">No Cellar Dispatches Found</h3>
            <p style="color: var(--text-muted); margin-bottom: 1.5rem;">Try adjusting your search keywords or explore another category filter.</p>
            <button class="btn btn-outline-gold" id="btnResetFilters">Reset Filters</button>
          </div>
        `;
        const resetBtn = document.getElementById('btnResetFilters');
        if (resetBtn) {
          resetBtn.addEventListener('click', () => {
            currentCategory = 'all';
            currentSearch = '';
            if (searchInput) searchInput.value = '';
            filterPills.forEach(p => p.classList.toggle('active', p.dataset.category === 'all'));
            filterAndRender();
          });
        }
      } else {
        grid.innerHTML = filtered.map(post => createBlogCardHTML(post, false)).join('');
      }
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value.trim().toLowerCase();
        filterAndRender();
      });
    }

    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        currentCategory = pill.dataset.category || 'all';
        filterAndRender();
      });
    });

    // Check URL parameters (e.g. ?category=vintage-reports)
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('category');
    if (catParam) {
      currentCategory = catParam;
      filterPills.forEach(p => p.classList.toggle('active', p.dataset.category === catParam));
    }

    filterAndRender();
  }

  // --- Article Details Page (blog-details.html) ---
  function initBlogDetails() {
    const articleWrap = document.getElementById('blogArticleDetails');
    if (!articleWrap) return;

    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id') || 'blog-001';
    const post = allBlogs.find(b => b.id === postId) || allBlogs[0];

    // Document Title
    document.title = `${post.title} | Wine & Craft Cellar Journal`;

    // Populate header & meta
    const breadcrumbTitle = document.getElementById('articleBreadcrumbTitle');
    if (breadcrumbTitle) breadcrumbTitle.textContent = post.title;

    const categoryBadge = document.getElementById('articleCategoryBadge');
    if (categoryBadge) categoryBadge.textContent = post.category;

    const articleTitle = document.getElementById('articleTitle');
    if (articleTitle) articleTitle.textContent = post.title;

    const authorAvatar = document.getElementById('articleAuthorAvatar');
    if (authorAvatar) authorAvatar.src = post.author.avatar;

    const authorName = document.getElementById('articleAuthorName');
    if (authorName) authorName.textContent = post.author.name;

    const authorRole = document.getElementById('articleAuthorRole');
    if (authorRole) authorRole.textContent = post.author.role;

    const articleDate = document.getElementById('articleDate');
    if (articleDate) articleDate.textContent = post.date;

    const articleReadTime = document.getElementById('articleReadTime');
    if (articleReadTime) articleReadTime.textContent = post.readTime;

    const articleHeroImg = document.getElementById('articleHeroImg');
    if (articleHeroImg) {
      articleHeroImg.src = post.image;
      articleHeroImg.alt = post.title;
    }

    // Populate Content Body
    const contentBody = document.getElementById('articleContentBody');
    if (contentBody) {
      let bodyHtml = `<p class="lead">${post.content[0]}</p>`;
      
      if (post.content[1]) {
        bodyHtml += `<p>${post.content[1]}</p>`;
      }

      bodyHtml += `
        <div class="pull-quote">
          &ldquo;${post.excerpt}&rdquo;
        </div>
      `;

      if (post.content[2]) {
        bodyHtml += `<p>${post.content[2]}</p>`;
      }

      if (post.sommelierTip) {
        bodyHtml += `
          <div class="sommelier-callout">
            <div class="sommelier-callout-icon">
              <i class="fa-solid fa-wine-glass"></i>
            </div>
            <div>
              <h4 class="sommelier-callout-title">Sommelier Cellar Directive</h4>
              <p class="sommelier-callout-text">${post.sommelierTip}</p>
            </div>
          </div>
        `;
      }

      if (post.content[3]) {
        bodyHtml += `<p>${post.content[3]}</p>`;
      }

      if (post.pairingSuggestion) {
        bodyHtml += `
          <div class="sommelier-callout sommelier-callout-pairing">
            <div class="sommelier-callout-icon">
              <i class="fa-solid fa-utensils"></i>
            </div>
            <div>
              <h4 class="sommelier-callout-title">Gastronomic Pairing Harmony</h4>
              <p class="sommelier-callout-text">${post.pairingSuggestion}</p>
            </div>
          </div>
        `;
      }

      contentBody.innerHTML = bodyHtml;
    }

    // Tags
    const tagsContainer = document.getElementById('articleTags');
    if (tagsContainer) {
      tagsContainer.innerHTML = post.tags.map(tag => `
        <a href="blog.html" class="badge badge-outline" style="padding: 0.4rem 0.85rem; text-decoration: none;">#${tag}</a>
      `).join(' ');
    }

    // Author Bio Box
    const bioAvatar = document.getElementById('bioAvatar');
    if (bioAvatar) bioAvatar.src = post.author.avatar;

    const bioName = document.getElementById('bioName');
    if (bioName) bioName.textContent = post.author.name;

    const bioRole = document.getElementById('bioRole');
    if (bioRole) bioRole.textContent = post.author.role;

    // Previous / Next Navigation
    const currentIndex = allBlogs.findIndex(b => b.id === post.id);
    const prevPost = currentIndex > 0 ? allBlogs[currentIndex - 1] : allBlogs[allBlogs.length - 1];
    const nextPost = currentIndex < allBlogs.length - 1 ? allBlogs[currentIndex + 1] : allBlogs[0];

    const prevCard = document.getElementById('prevPostCard');
    if (prevCard) {
      prevCard.href = `blog-details.html?id=${prevPost.id}`;
      document.getElementById('prevPostTitle').textContent = prevPost.title;
    }

    const nextCard = document.getElementById('nextPostCard');
    if (nextCard) {
      nextCard.href = `blog-details.html?id=${nextPost.id}`;
      document.getElementById('nextPostTitle').textContent = nextPost.title;
    }

    // Related Posts Grid
    const relatedGrid = document.getElementById('relatedPostsGrid');
    if (relatedGrid) {
      const related = allBlogs.filter(b => b.id !== post.id).slice(0, 3);
      relatedGrid.innerHTML = related.map(p => createBlogCardHTML(p, false)).join('');
    }

    // Share Buttons
    const shareBtns = document.querySelectorAll('.share-btn');
    shareBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const action = btn.dataset.share;
        const currentUrl = window.location.href;
        if (action === 'copy') {
          navigator.clipboard.writeText(currentUrl).then(() => {
            if (window.showToast) window.showToast('Article link copied to clipboard.', 'gold');
          }).catch(() => {
            if (window.showToast) window.showToast('Link ready to share: ' + currentUrl, 'gold');
          });
        } else if (action === 'twitter') {
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(currentUrl)}`, '_blank');
        } else if (action === 'facebook') {
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
        } else if (action === 'linkedin') {
          window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`, '_blank');
        }
      });
    });

    // Comments handling
    initComments(post.id);
  }

  function initComments(postId) {
    const list = document.getElementById('commentsList');
    const form = document.getElementById('commentForm');
    const countEl = document.getElementById('commentCount');
    if (!list) return;

    const storageKey = `winecraft_comments_${postId}`;
    const defaultComments = [
      {
        name: "Lord Harrington",
        date: "October 16, 2026",
        text: "Exceptional analysis of the 2015 vintage. We uncorked a case of Château Margaux last autumn in Edinburgh, and the graphite backbone was unmistakable."
      },
      {
        name: "Lady Genevieve Thorne",
        date: "October 18, 2026",
        text: "The guidance on cellar temperature stability aligns exactly with what our sommelier in Bordeaux advised. Thank you for these detailed dispatches."
      }
    ];

    let saved = localStorage.getItem(storageKey);
    let comments = saved ? JSON.parse(saved) : defaultComments;

    function renderComments() {
      if (countEl) countEl.textContent = `(${comments.length})`;
      list.innerHTML = comments.map(c => `
        <div class="comment-item">
          <div class="comment-avatar">
            ${c.name.charAt(0).toUpperCase()}
          </div>
          <div style="flex: 1;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
              <h5 style="margin: 0; font-size: 1rem; color: var(--text-main); font-weight: 600;">${c.name}</h5>
              <span style="font-size: 0.75rem; color: var(--text-light);">${c.date}</span>
            </div>
            <p style="margin: 0; font-size: 0.95rem; color: var(--text-muted); line-height: 1.6;">${c.text}</p>
          </div>
        </div>
      `).join('');
    }

    renderComments();

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('commentName');
        const textInput = document.getElementById('commentText');
        if (!nameInput || !textInput) return;

        const name = nameInput.value.trim();
        const text = textInput.value.trim();
        if (!name || !text) return;

        const newComment = {
          name: name,
          date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
          text: text
        };

        comments.unshift(newComment);
        localStorage.setItem(storageKey, JSON.stringify(comments));
        renderComments();

        nameInput.value = '';
        textInput.value = '';
        if (window.showToast) {
          window.showToast('Your connoisseur comment has been posted.', 'gold');
        }
      });
    }
  }

  // Initialize on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', async () => {
    await loadBlogsData();
    initHomeBlog();
    initBlogCatalog();
    initBlogDetails();
  });

})();
