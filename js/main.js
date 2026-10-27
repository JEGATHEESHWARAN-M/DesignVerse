/* ============================================================
   DesignVerse — Main JavaScript
============================================================ */

(function () {
  'use strict';

  // ── 1. Sticky Nav (adds scrolled class) ─────────────────
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });


  // ── 2. Mobile Menu Toggle ───────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('.mobile-nav-item').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }


  // ── 3. Cases Slider ─────────────────────────────────────
  const slider = document.getElementById('casesSlider');
  const prevBtn = document.getElementById('casesPrev');
  const nextBtn = document.getElementById('casesNext');
  const dotsContainer = document.getElementById('casesDots');

  if (slider) {
    const slides = slider.querySelectorAll('.case-slide');
    let currentIndex = 0;

    // Create dots
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });

    function getSlideWidth() {
      if (slides.length === 0) return 0;
      return slides[0].offsetWidth + 20; // slide width + gap
    }

    function goToSlide(index) {
      const max = slides.length - getSlidesVisible();
      currentIndex = Math.max(0, Math.min(index, max));
      slider.scrollTo({ left: currentIndex * getSlideWidth(), behavior: 'smooth' });
      updateDots();
    }

    function getSlidesVisible() {
      const w = window.innerWidth;
      if (w < 600) return 1;
      if (w < 900) return 2;
      return 3;
    }

    function updateDots() {
      dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentIndex);
      });
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Update on scroll
    slider.addEventListener('scroll', () => {
      const w = getSlideWidth();
      if (w > 0) {
        currentIndex = Math.round(slider.scrollLeft / w);
        updateDots();
      }
    }, { passive: true });

    // Auto-advance every 4 seconds
    let autoPlay = setInterval(() => {
      const max = slides.length - getSlidesVisible();
      goToSlide(currentIndex >= max ? 0 : currentIndex + 1);
    }, 4000);

    // Pause on hover
    slider.addEventListener('mouseenter', () => clearInterval(autoPlay));
    slider.addEventListener('mouseleave', () => {
      autoPlay = setInterval(() => {
        const max = slides.length - getSlidesVisible();
        goToSlide(currentIndex >= max ? 0 : currentIndex + 1);
      }, 4000);
    });

    // Touch swipe support
    let touchStartX = 0;
    slider.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        goToSlide(diff > 0 ? currentIndex + 1 : currentIndex - 1);
      }
    }, { passive: true });
  }


  // ── 4. Ideas Gallery Tabs ──────────────────────────────
  const tabs = document.querySelectorAll('.ideas-tab');
  const ideaCards = document.querySelectorAll('.idea-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      ideaCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'none';
          card.offsetHeight; // trigger reflow
          card.style.animation = 'fadeInUp 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  // ── 5. Scroll-Reveal Animation ──────────────────────────
  const revealElements = document.querySelectorAll(
    '.section-title, .section-desc, .workflow-item, .idea-card, ' +
    '.stat-item, .testimonial-card, .tutorial-content, .cta-card, ' +
    '.review-badge-card, .trust-logo, .float-card'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 60);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));


  // ── 6. Animated Counters ────────────────────────────────
  const statNumbers = document.querySelectorAll('.stat-number');

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.dataset.count);
        const isDecimal = el.dataset.count.includes('.');
        const duration = 1800;
        const step = 16;
        const increment = target / (duration / step);
        let current = 0;

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
        }, step);

        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => countObserver.observe(el));


  // ── 7. Dropdown Close on Outside Click ─────────────────
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-dropdown')) {
      // Dropdowns close via CSS :hover, no JS needed
    }
  });


  // ── 8. Cookie Banner ───────────────────────────────────
  const cookieBanner = document.getElementById('cookieBanner');

  if (cookieBanner && !localStorage.getItem('dv_cookie_consent')) {
    setTimeout(() => {
      cookieBanner.classList.add('show');
    }, 2000);
  }

  window.acceptCookies = function () {
    localStorage.setItem('dv_cookie_consent', 'accepted');
    cookieBanner.classList.remove('show');
  };

  window.rejectCookies = function () {
    localStorage.setItem('dv_cookie_consent', 'rejected');
    cookieBanner.classList.remove('show');
  };


  // ── 9. Subscribe Form ──────────────────────────────────
  window.handleSubscribe = function (e) {
    e.preventDefault();
    const form = e.target;
    const input = form.querySelector('input[type="email"]');
    const btn = form.querySelector('button[type="submit"]');

    if (!input.value) return;

    btn.textContent = 'Subscribing...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = '✓ Subscribed!';
      btn.style.background = 'var(--color-green)';
      input.value = '';
      setTimeout(() => {
        btn.textContent = 'Subscribe';
        btn.disabled = false;
        btn.style.background = '';
      }, 3000);
    }, 1000);
  };


  // ── 10. Ideas Card Interaction ─────────────────────────
  ideaCards.forEach(card => {
    card.addEventListener('click', () => {
      // Ripple effect
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        width: 100px;
        height: 100px;
        background: rgba(58,102,255,0.2);
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        animation: rippleAnim 0.6s ease-out forwards;
        pointer-events: none;
      `;
      card.style.position = 'relative';
      card.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Add ripple animation to stylesheet dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleAnim {
      to { transform: translate(-50%, -50%) scale(4); opacity: 0; }
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);


  // ── 11. Smooth scroll for anchor links ─────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ── 12. Page Load Animation ────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.4s ease';
    requestAnimationFrame(() => {
      document.body.style.opacity = '1';
    });
  });

  // Banner text stagger
  const bannerText = document.querySelector('.banner-text');
  if (bannerText) {
    const children = bannerText.children;
    Array.from(children).forEach((child, i) => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(24px)';
      child.style.transition = `opacity 0.6s ease ${i * 0.12 + 0.1}s, transform 0.6s ease ${i * 0.12 + 0.1}s`;
      setTimeout(() => {
        child.style.opacity = '1';
        child.style.transform = 'translateY(0)';
      }, 50);
    });
  }

  console.log('%cDesignVerse 🏠', 'color: #3A66FF; font-size: 20px; font-weight: bold;');
  console.log('%cBuilt with ❤️ using Antigravity AI', 'color: #a855f7; font-size: 12px;');

})();
