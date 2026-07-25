document.addEventListener('DOMContentLoaded', () => {

  // ============ HEADER SCROLL ============
  const header = document.querySelector('.header');
  const backToTop = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (window.scrollY > 400) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ============ MOBILE MENU ============
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ============ ACTIVE NAV LINK ============
  const sections = document.querySelectorAll('section[id]');

  function setActiveNav() {
    const scrollPos = window.scrollY + 150;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-links a[href="#${id}"]`);
      if (link) {
        if (scrollPos >= top && scrollPos < top + height) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }

  window.addEventListener('scroll', setActiveNav);

  // ============ SCROLL ANIMATIONS ============
  const animateElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  animateElements.forEach(el => observer.observe(el));

  // ============ PRODUCTS TABS ============
  const tabBtns = document.querySelectorAll('.tab-btn');
  const productCards = document.querySelectorAll('.product-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      productCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // ============ CART FUNCTIONALITY ============
  let cart = [];
  const cartSidebar = document.querySelector('.cart-sidebar');
  const cartOverlay = document.querySelector('.cart-overlay');
  const cartItemsContainer = document.querySelector('.cart-items');
  const cartCount = document.querySelector('.cart-count');
  const cartTotalEl = document.querySelector('.cart-total-amount');

  function updateCart() {
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (cartCount) cartCount.textContent = totalItems;
    if (cartTotalEl) cartTotalEl.textContent = `$${totalPrice.toFixed(2)}`;

    if (cartItemsContainer) {
      if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
          <div class="cart-empty">
            <span>🛒</span>
            <p>Tu carrito esta vacio</p>
          </div>`;
      } else {
        cartItemsContainer.innerHTML = cart.map(item => `
          <div class="cart-item">
            <div class="cart-item-image">${item.icon}</div>
            <div class="cart-item-info">
              <h4>${item.name}</h4>
              <span class="cart-item-price">$${item.price.toFixed(2)}</span>
              <div class="cart-item-qty">
                <button onclick="changeQty(${item.id}, -1)">-</button>
                <span>${item.qty}</span>
                <button onclick="changeQty(${item.id}, 1)">+</button>
              </div>
            </div>
            <span class="cart-item-remove" onclick="removeFromCart(${item.id})">✕</span>
          </div>
        `).join('');
      }
    }

    const badge = document.querySelector('.nav-cart-badge');
    if (badge) {
      badge.textContent = totalItems;
      badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
  }

  window.addToCart = function(id, name, price, icon) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ id, name, price, icon, qty: 1 });
    }
    updateCart();
    showToast(`${name} agregado al carrito`);
  };

  window.changeQty = function(id, delta) {
    const item = cart.find(item => item.id === id);
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== id);
      }
    }
    updateCart();
  };

  window.removeFromCart = function(id) {
    cart = cart.filter(item => item.id !== id);
    updateCart();
  };

  function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.open-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCart();
    });
  });

  document.querySelector('.cart-close')?.addEventListener('click', closeCart);
  cartOverlay?.addEventListener('click', closeCart);

  // ============ SEARCH MODAL ============
  const searchModal = document.querySelector('.search-modal');
  const searchInput = document.querySelector('.search-input');

  document.querySelectorAll('.open-search').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      searchModal.classList.add('open');
      setTimeout(() => searchInput?.focus(), 300);
    });
  });

  searchModal?.addEventListener('click', (e) => {
    if (e.target === searchModal) {
      searchModal.classList.remove('open');
    }
  });

  document.querySelectorAll('.search-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = tag.textContent;
        searchInput.focus();
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      searchModal?.classList.remove('open');
      closeCart();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      searchModal?.classList.add('open');
      setTimeout(() => searchInput?.focus(), 300);
    }
  });

  // ============ CONTACT FORM ============
  const contactForm = document.querySelector('#contactForm');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get('name');

    showToast(`Gracias ${name || 'por tu mensaje'}! Te contactaremos pronto.`);
    contactForm.reset();
  });

  // ============ NEWSLETTER ============
  document.querySelectorAll('.newsletter-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Te suscribiste a nuestro newsletter!');
      form.reset();
    });
  });

  // ============ TOAST NOTIFICATION ============
  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<span class="toast-icon">✓</span> ${message}`;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  // ============ COUNTER ANIMATION ============
  const counters = document.querySelectorAll('.hero-stat h3');

  function animateCounter(el) {
    const text = el.textContent;
    const match = text.match(/(\d+)/);
    if (!match) return;

    const target = parseInt(match[1]);
    const suffix = text.replace(/\d+/, '');
    let current = 0;
    const increment = target / 60;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = Math.floor(current) + suffix;
    }, 25);
  }

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(c => animateCounter(c));
        heroObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) heroObserver.observe(heroStats);

  // ============ BACK TO TOP INIT ============
  if (backToTop) {
    backToTop.style.opacity = '0';
    backToTop.style.visibility = 'hidden';
  }

  // ============ GALLERY CAROUSEL ============
  const track = document.querySelector('.carousel-track');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const dotsContainer = document.querySelector('.carousel-dots');
  const slides = document.querySelectorAll('.carousel-slide');

  if (track && slides.length) {
    let current = 0;
    let autoPlayInterval;

    // Create dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.carousel-dot');

    function goToSlide(index) {
      current = index;
      track.style.transform = `translateX(-${current * 100}%)`;
      dots.forEach((d, i) => d.classList.toggle('active', i === current));
    }

    function nextSlide() {
      goToSlide((current + 1) % slides.length);
    }

    function prevSlide() {
      goToSlide((current - 1 + slides.length) % slides.length);
    }

    nextBtn.addEventListener('click', () => {
      nextSlide();
      resetAutoPlay();
    });

    prevBtn.addEventListener('click', () => {
      prevSlide();
      resetAutoPlay();
    });

    function startAutoPlay() {
      autoPlayInterval = setInterval(nextSlide, 4500);
    }

    function resetAutoPlay() {
      clearInterval(autoPlayInterval);
      startAutoPlay();
    }

    startAutoPlay();

    // Pause on hover
    track.parentElement.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    track.parentElement.addEventListener('mouseleave', startAutoPlay);

    // Touch / swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        nextSlide();
        resetAutoPlay();
      } else if (touchEndX - touchStartX > 50) {
        prevSlide();
        resetAutoPlay();
      }
    }, { passive: true });
  }
});
