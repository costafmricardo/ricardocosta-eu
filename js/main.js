/* ==========================================================================
   RICARDO COSTA — ricardocosta.eu
   Main JavaScript — All interactions from Figma specs
   ========================================================================== */

(function () {
  'use strict';

  // ---------- DOM REFERENCES ----------
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const progressBar = $('.progress-bar');
  const nav = $('.nav');
  const hamburger = $('.nav__hamburger');
  const mobileMenu = $('#mobile-menu');
  const mobileOverlay = $('.mobile-menu__overlay');
  const mobileClose = $('.mobile-menu__close');
  const mobileLinks = $$('.mobile-menu__link');
  const backToTop = $('.back-to-top');
  const scrollDots = $$('.scroll-dot');
  const stickyLabel = $('.sticky-label');
  const stickyLabelText = $('.sticky-label__text');
  const form = $('#newsletter-form');
  const emailInput = $('#email-input');
  const statusEl = $('#email-status');
  const submitBtn = $('.newsletter__submit');
  const cardsContainer = $('.latest__cards');
  const carouselDots = $$('.latest__dot');
  const navLinks = $$('.nav__link[data-section]');

  // Sections for scroll spy
  const sections = $$('section[id]');
  const sectionMap = {};
  sections.forEach(s => { sectionMap[s.id] = s; });

  // ---------- SCROLL PROGRESS BAR ----------
  let progressTarget = 0;
  let progressCurrent = 0;

  function updateProgressTarget() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    progressTarget = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  }

  function animateProgress() {
    progressCurrent += (progressTarget - progressCurrent) * 0.12;
    if (Math.abs(progressCurrent - progressTarget) < 0.1) {
      progressCurrent = progressTarget;
    }
    progressBar.style.width = progressCurrent + '%';
    progressBar.setAttribute('aria-valuenow', Math.round(progressCurrent));
    requestAnimationFrame(animateProgress);
  }
  requestAnimationFrame(animateProgress);

  // ---------- SCROLL SPY — Nav + Dots + Sticky Label ----------
  const sectionIds = ['hero', 'about', 'latest', 'newsletter', 'contact', 'footer-section'];

  function getActiveSection() {
    const scrollY = window.scrollY + window.innerHeight * 0.35;
    let active = sectionIds[0];
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) {
        active = id;
      }
    }
    return active;
  }

  function updateScrollSpy() {
    const active = getActiveSection();

    // Nav links
    navLinks.forEach(link => {
      const section = link.dataset.section;
      link.classList.toggle('active', section === active);
    });

    // Mobile menu links
    mobileLinks.forEach(link => {
      if (link.dataset.section) {
        link.classList.toggle('active', link.dataset.section === active);
      }
    });

    // Scroll dots
    scrollDots.forEach(dot => {
      const isActive = dot.dataset.target === active;
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', isActive);
    });

    // Sticky label
    if (stickyLabel) {
      const isHero = active === 'hero';
      stickyLabel.classList.toggle('is-visible', !isHero);
      if (stickyLabelText) {
        const labelMap = {
          'hero': 'Início',
          'about': 'Sobre',
          'beliefs': 'No que acredito',
          'find-me': 'Onde me encontras',
          'newsletter': 'Newsletter',
          'contact': 'Contacto',
          'footer-section': 'Rodapé'
        };
        stickyLabelText.textContent = labelMap[active] || '';
      }
    }
  }

  // ---------- BACK TO TOP ----------
  function updateBackToTop() {
    const show = window.scrollY > window.innerHeight;
    backToTop.classList.toggle('is-visible', show);
    backToTop.hidden = !show;
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---------- SCROLL DOTS — Visibility ----------
  const scrollDotsContainer = $('.scroll-dots');
  function updateScrollDotsVisibility() {
    if (!scrollDotsContainer) return;
    const show = window.scrollY > 200;
    scrollDotsContainer.classList.toggle('is-visible', show);
  }

  // Dot click → scroll to section
  scrollDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const target = document.getElementById(dot.dataset.target);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---------- COMBINED SCROLL HANDLER ----------
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgressTarget();
        updateScrollSpy();
        updateBackToTop();
        updateScrollDotsVisibility();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- MOBILE MENU — M2 ----------
  let focusTrapElements = [];
  let lastFocusedElement = null;

  function openMenu() {
    lastFocusedElement = document.activeElement;
    mobileMenu.hidden = false;

    // Trigger reflow for animation
    void mobileMenu.offsetWidth;
    mobileMenu.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    // Focus trap
    focusTrapElements = $$('a, button', mobileMenu).filter(
      el => !el.closest('[hidden]') && el.offsetParent !== null
    );
    if (focusTrapElements.length) {
      focusTrapElements[0].focus();
    }
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';

    // Wait for animation
    setTimeout(() => {
      mobileMenu.hidden = true;
    }, 300);

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  mobileClose.addEventListener('click', closeMenu);
  mobileOverlay.addEventListener('click', closeMenu);

  // Close on link click
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (!link.classList.contains('mobile-menu__link--external')) {
        closeMenu();
      }
    });
  });

  // Esc to close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.hidden) {
      closeMenu();
    }
  });

  // Focus trap
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' && !mobileMenu.hidden) {
      const first = focusTrapElements[0];
      const last = focusTrapElements[focusTrapElements.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  // ---------- NEWSLETTER FORM — Substack hidden iframe subscribe ----------
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const SUBSTACK_URL = 'https://ricardocostaeu.substack.com';

  function setFormState(state) {
    emailInput.classList.remove('is-error', 'is-valid');
    statusEl.classList.remove('is-error', 'is-success');
    statusEl.textContent = '';

    if (state === 'valid') {
      emailInput.classList.add('is-valid');
    } else if (state === 'error-format') {
      emailInput.classList.add('is-error');
      statusEl.classList.add('is-error');
      statusEl.textContent = "Isso não parece um endereço de email";
    } else if (state === 'success') {
      emailInput.classList.add('is-valid');
      statusEl.classList.add('is-success');
      statusEl.textContent = 'Verifica a tua caixa para confirmar a subscrição';
      emailInput.disabled = true;
      submitBtn.disabled = true;
    } else if (state === 'idle') {
      // reset
    }
  }

  // Inline validation onBlur
  emailInput.addEventListener('blur', () => {
    const val = emailInput.value.trim();
    if (val === '') { setFormState('idle'); return; }
    setFormState(EMAIL_REGEX.test(val) ? 'valid' : 'error-format');
  });

  emailInput.addEventListener('input', () => {
    if (emailInput.classList.contains('is-error')) setFormState('idle');
  });

  // Form submit — subscribe via hidden iframe
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = emailInput.value.trim();

    if (!EMAIL_REGEX.test(val)) {
      setFormState('error-format');
      emailInput.focus();
      return;
    }

    // Save for returning visitors
    try { localStorage.setItem('rc_email', val); } catch (_) {}

    // Create hidden iframe and form to submit to Substack
    const iframe = document.createElement('iframe');
    iframe.name = 'substack-frame';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const hiddenForm = document.createElement('form');
    hiddenForm.method = 'POST';
    hiddenForm.action = SUBSTACK_URL + '/api/v1/free';
    hiddenForm.target = 'substack-frame';

    const field = document.createElement('input');
    field.type = 'hidden';
    field.name = 'email';
    field.value = val;
    hiddenForm.appendChild(field);

    const srcField = document.createElement('input');
    srcField.type = 'hidden';
    srcField.name = 'first_url';
    srcField.value = window.location.href;
    hiddenForm.appendChild(srcField);

    document.body.appendChild(hiddenForm);
    hiddenForm.submit();

    setFormState('success');

    // Clean up after a few seconds
    setTimeout(() => {
      hiddenForm.remove();
      iframe.remove();
    }, 5000);
  });

  // Returning visitor — pre-fill
  try {
    const saved = localStorage.getItem('rc_email');
    if (saved && emailInput) emailInput.value = saved;
  } catch (_) {}

  // ---------- FIX 10 — Email obfuscation ----------
  const emailParts = ['info', 'ricardocosta.eu'];
  const emailAddr = emailParts.join('@');
  $$('.js-email').forEach(el => {
    el.href = 'mailto:' + emailAddr;
    el.textContent = emailAddr;
  });

  // ---------- CAROUSEL — Mobile, M9 ----------
  let carouselObserver = null;

  function initCarousel() {
    if (window.innerWidth >= 768) return;

    // Track active card via Intersection Observer
    const cards = $$('.card', cardsContainer);
    if (carouselObserver) carouselObserver.disconnect();

    carouselObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = cards.indexOf(entry.target);
          carouselDots.forEach((dot, i) => {
            dot.classList.toggle('active', i === idx);
            dot.setAttribute('aria-selected', i === idx);
          });
        }
      });
    }, {
      root: cardsContainer,
      threshold: 0.6,
    });

    cards.forEach(card => carouselObserver.observe(card));

    // Dot click → scroll to card
    carouselDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        if (cards[i]) {
          cards[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        }
      });
    });

    // First-visit swipe hint — M9
    if (!localStorage.getItem('rc_carousel_hint')) {
      setTimeout(() => {
        cardsContainer.scrollBy({ left: 30, behavior: 'smooth' });
        setTimeout(() => {
          cardsContainer.scrollBy({ left: -30, behavior: 'smooth' });
          localStorage.setItem('rc_carousel_hint', '1');
        }, 400);
      }, 1500);
    }
  }

  // ---------- FADE-UP ON SCROLL ----------
  function initFadeUp() {
    const targets = $$('.about, .latest, .newsletter, .contact, .footer');
    targets.forEach(el => el.classList.add('fade-up'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -60px 0px',
    });

    targets.forEach(el => {
      // If already scrolled past (e.g. page reload mid-scroll), show immediately
      const rect = el.getBoundingClientRect();
      if (rect.bottom < window.innerHeight) {
        el.classList.add('is-visible');
      } else {
        observer.observe(el);
      }
    });
  }

  // ---------- KEYBOARD NAVIGATION — M8 ----------
  // Arrow keys for carousel when focused
  cardsContainer.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const cards = $$('.card', cardsContainer);
      const activeCard = document.activeElement.closest('.card');
      const currentIdx = activeCard ? cards.indexOf(activeCard) : -1;
      const nextIdx = e.key === 'ArrowRight'
        ? Math.min(currentIdx + 1, cards.length - 1)
        : Math.max(currentIdx - 1, 0);

      const link = $('a', cards[nextIdx]);
      if (link) link.focus();

      if (window.innerWidth < 768) {
        cards[nextIdx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      }
    }
  });

  // ---------- SMOOTH SCROLL FOR ANCHOR LINKS ----------
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---------- INIT ----------
  function init() {
    updateScrollSpy();
    updateBackToTop();
    updateScrollDotsVisibility();
    initCarousel();
    initFadeUp();

    // Re-init carousel on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(initCarousel, 250);
    });
  }

  // Wait for DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
