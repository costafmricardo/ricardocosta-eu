/* ==========================================================================
   RICARDO COSTA — about.html
   Shared interactions: progress bar, mobile menu, back-to-top, fade-up,
   email obfuscation
   ========================================================================== */

(function () {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  const progressBar = $('.progress-bar');
  const hamburger = $('.nav__hamburger');
  const mobileMenu = $('#mobile-menu');
  const mobileOverlay = $('.mobile-menu__overlay');
  const mobileClose = $('.mobile-menu__close');
  const mobileLinks = $$('.mobile-menu__link');
  const backToTop = $('.back-to-top');

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

  // ---------- BACK TO TOP ----------
  function updateBackToTop() {
    const show = window.scrollY > window.innerHeight;
    backToTop.classList.toggle('is-visible', show);
    backToTop.hidden = !show;
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---------- SCROLL HANDLER ----------
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateProgressTarget();
        updateBackToTop();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- MOBILE MENU ----------
  let focusTrapElements = [];
  let lastFocusedElement = null;

  function openMenu() {
    lastFocusedElement = document.activeElement;
    mobileMenu.hidden = false;
    void mobileMenu.offsetWidth;
    mobileMenu.classList.add('is-open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';

    focusTrapElements = $$('a, button', mobileMenu).filter(
      el => !el.closest('[hidden]') && el.offsetParent !== null
    );
    if (focusTrapElements.length) focusTrapElements[0].focus();
  }

  function closeMenu() {
    mobileMenu.classList.remove('is-open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    setTimeout(() => { mobileMenu.hidden = true; }, 300);
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMenu() : openMenu();
  });

  mobileClose.addEventListener('click', closeMenu);
  mobileOverlay.addEventListener('click', closeMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (!link.classList.contains('mobile-menu__link--external')) closeMenu();
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mobileMenu.hidden) closeMenu();
  });

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

  // ---------- FADE-UP ON SCROLL ----------
  function initFadeUp() {
    const targets = $$('.story, .beliefs, .find-me, .contact, .footer');
    targets.forEach(el => el.classList.add('fade-up'));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    targets.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.bottom < window.innerHeight) {
        el.classList.add('is-visible');
      } else {
        observer.observe(el);
      }
    });
  }

  // ---------- EMAIL OBFUSCATION ----------
  const emailParts = ['info', 'ricardocosta.eu'];
  const emailAddr = emailParts.join('@');
  $$('.js-email').forEach(el => {
    el.href = 'mailto:' + emailAddr;
    el.textContent = emailAddr;
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
    updateBackToTop();
    initFadeUp();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
