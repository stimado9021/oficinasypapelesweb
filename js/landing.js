/* Landing Page JS */
document.addEventListener('DOMContentLoaded', () => {

  // Header scroll
  const header = document.querySelector('.header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  });

  // Hamburger mobile
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
      if (window.innerWidth <= 768) {
        nav.style.position = 'absolute';
        nav.style.top = '100%';
        nav.style.left = '0';
        nav.style.right = '0';
        nav.style.background = '#fff';
        nav.style.flexDirection = 'column';
        nav.style.padding = '24px';
        nav.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
        nav.style.gap = '16px';
      }
    });
  }

  // Scroll animations
  const fadeEls = document.querySelectorAll('.feature-card, .section-item, .process-step, .package-card, .problem-card, .contact-detail');
  fadeEls.forEach(el => el.classList.add('fade-up'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  fadeEls.forEach(el => observer.observe(el));

  // Contact form
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      btn.textContent = '✓ Mensaje Enviado';
      btn.style.background = '#27CA40';
      setTimeout(() => {
        btn.textContent = 'Enviar Mensaje →';
        btn.style.background = '';
        form.reset();
      }, 3000);
    });
  }

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

});
