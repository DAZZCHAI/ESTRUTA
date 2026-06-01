/* ════════ ESTRUTA CONSTRUCTORA · PENROSE / ORBEX — script.js ════════ */
(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    navScroll();
    mobileMenu();
    projectTabs();
    contactForm();
    testimCarousel();
    if (window.gsap) {
      animations();
      // Recalculate trigger positions once web-fonts settle and layout reflows,
      // otherwise late font loading shifts the page and reveals never fire,
      // leaving sections stuck at opacity:0 (appearing empty).
      window.addEventListener('load', refreshTriggers);
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(refreshTriggers);
      }
      setTimeout(refreshTriggers, 600);
    } else {
      fallbackReveal();
    }
  }

  function refreshTriggers() {
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  /* ---------- NAV: solid background on scroll ---------- */
  function navScroll() {
    var nav = document.getElementById('nav');
    function onScroll() {
      if (window.scrollY > 80) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- MOBILE MENU ---------- */
  function mobileMenu() {
    var burger = document.getElementById('navBurger');
    var menu = document.getElementById('mobileMenu');
    if (!burger || !menu) return;

    function toggle(open) {
      menu.classList.toggle('is-open', open);
      burger.classList.toggle('is-active', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      menu.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.body.style.overflow = open ? 'hidden' : '';
    }
    burger.addEventListener('click', function () {
      toggle(!menu.classList.contains('is-open'));
    });
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { toggle(false); });
    });
  }

  /* ---------- PROJECT TABS (vanilla filter) ---------- */
  function projectTabs() {
    var tabs = document.querySelectorAll('#projectTabs .tab');
    var cards = document.querySelectorAll('#projectsGrid .project-card');
    if (!tabs.length) return;

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        tabs.forEach(function (t) { t.classList.remove('is-active'); });
        tab.classList.add('is-active');
        var filter = tab.getAttribute('data-filter');
        cards.forEach(function (card) {
          var match = filter === 'all' || card.getAttribute('data-cat') === filter;
          card.classList.toggle('is-hidden', !match);
        });
      });
    });
  }

  /* ---------- CONTACT FORM (HTML5 native, no backend) ---------- */
  function contactForm() {
    var form = document.getElementById('contactForm');
    var note = document.getElementById('formNote');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) { form.reportValidity(); return; }
      if (note) note.hidden = false;
      form.reset();
      if (window.gsap) gsap.fromTo(note, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .4 });
    });
  }

  /* ---------- COUNTERS (vanilla countUp, triggered) ---------- */
  function runCounters() {
    document.querySelectorAll('.counter__num, .stats-band__num').forEach(function (el) {
      if (el.dataset.done) return;
      el.dataset.done = '1';
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      var dur = 1600, start = null;
      function step(ts) {
        if (!start) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* ---------- GSAP ANIMATIONS ---------- */
  function animations() {
    gsap.registerPlugin(ScrollTrigger);

    /* Hero headline stagger line by line */
    gsap.from('.hero__badge', { y: -24, opacity: 0, duration: .7, ease: 'power2.out' });
    gsap.from('.hero__title .line', { y: 60, opacity: 0, duration: .9, stagger: .18, delay: .2, ease: 'power3.out' });
    gsap.from('.hero__sub', { y: 30, opacity: 0, duration: .8, delay: .55, ease: 'power2.out' });
    gsap.from('.hero__cta', { y: 30, opacity: 0, duration: .8, delay: .7, ease: 'power2.out' });
    gsap.from('.hero__stats li', { y: 24, opacity: 0, duration: .6, stagger: .08, delay: .85, ease: 'power2.out' });

    /* Section headings */
    gsap.utils.toArray('.section-head').forEach(function (h) {
      gsap.from(h.children, {
        scrollTrigger: { trigger: h, start: 'top bottom', once: true },
        y: 40, opacity: 0, duration: .7, stagger: .12, ease: 'power2.out'
      });
    });

    /* Nosotros split entry */
    gsap.utils.toArray('[data-anim="left"]').forEach(function (el) {
      gsap.from(el, { scrollTrigger: { trigger: el, start: 'top bottom', once: true }, x: -100, opacity: 0, duration: .9, ease: 'power3.out' });
    });
    gsap.utils.toArray('[data-anim="right"]').forEach(function (el) {
      gsap.from(el, { scrollTrigger: { trigger: el, start: 'top bottom', once: true }, x: 100, opacity: 0, duration: .9, ease: 'power3.out' });
    });

    /* Generic fade-up stagger by container */
    [
      ['.services__grid', '.service-card'],
      ['.projects__grid', '.project-card'],
      ['.process__timeline', '.process__step'],
      ['.testimonials__grid', '.testimonial'],
      ['.why__list', 'li']
    ].forEach(function (pair) {
      var container = document.querySelector(pair[0]);
      if (!container) return;
      gsap.from(container.querySelectorAll(pair[1]), {
        scrollTrigger: { trigger: container, start: 'top bottom', once: true },
        y: 40, opacity: 0, duration: .65, stagger: .08, ease: 'power2.out'
      });
    });

    /* Counters trigger */
    ScrollTrigger.create({
      trigger: '#counters', start: 'top 80%', once: true, onEnter: runCounters
    });
    ScrollTrigger.create({
      trigger: '.stats-band', start: 'top bottom', once: true, onEnter: runCounters
    });

    /* CTA final scale */
    gsap.from('.cta-final__inner', {
      scrollTrigger: { trigger: '.cta-final', start: 'top 85%' },
      scale: .95, opacity: 0, duration: .8, ease: 'power2.out'
    });

    /* WhatsApp float bounce every 4s */
    var wa = document.getElementById('waFloat');
    if (wa) {
      setInterval(function () {
        gsap.fromTo(wa, { y: 0 }, { y: -14, duration: .35, yoyo: true, repeat: 3, ease: 'power1.inOut' });
      }, 4000);
    }
  }

  /* ---------- TESTIMONIOS CARRUSEL DOTS (mobile) ---------- */
  function testimCarousel() {
    var grid = document.querySelector('.testimonials__grid');
    var dotsWrap = document.getElementById('testimDots');
    if (!grid || !dotsWrap) return;

    var cards = Array.from(grid.querySelectorAll('.testimonial'));
    var dotBtns = [];

    cards.forEach(function(_, i) {
      var btn = document.createElement('button');
      btn.setAttribute('aria-label', 'Testimonio ' + (i + 1));
      if (i === 0) btn.classList.add('is-active');
      btn.addEventListener('click', function() {
        var max = grid.scrollWidth - grid.clientWidth;
        var target = (cards.length > 1) ? (i / (cards.length - 1)) * max : 0;
        grid.scrollTo({ left: target, behavior: 'smooth' });
      });
      dotsWrap.appendChild(btn);
      dotBtns.push(btn);
    });

    grid.addEventListener('scroll', function() {
      var max = grid.scrollWidth - grid.clientWidth;
      if (max <= 0) return;
      var frac = grid.scrollLeft / max;
      var idx = Math.round(frac * (cards.length - 1));
      dotBtns.forEach(function(b, i) { b.classList.toggle('is-active', i === idx); });
    }, { passive: true });
  }

  /* ---------- Fallback if GSAP fails to load ---------- */
  function fallbackReveal() {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.style.opacity = 1; io.unobserve(e.target); }
      });
    }, { threshold: .15 });
    document.querySelectorAll('[data-anim]').forEach(function (el) { io.observe(el); });
    var c = document.getElementById('counters');
    if (c) new IntersectionObserver(function (en, ob) {
      en.forEach(function (e) { if (e.isIntersecting) { runCounters(); ob.disconnect(); } });
    }, { threshold: .4 }).observe(c);
  }
})();
