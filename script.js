/* =========================================================
   911 PLUMBING SERVICE 4 Less — interactions
   Vanilla JS. No external dependencies, no network calls.
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Footer year ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) { yearEl.textContent = String(new Date().getFullYear()); }

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.getElementById('navToggle');
  var nav = document.getElementById('nav');

  function closeNav() {
    if (!nav || !navToggle) { return; }
    nav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeNav(); }
    });

    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target) && !navToggle.contains(e.target)) { closeNav(); }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) { closeNav(); }
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.querySelector('.site-header');
  function onScroll() {
    if (!header) { return; }
    header.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  var revealTargets = document.querySelectorAll(
    '.card, .steps li, .quote, .why-copy, .why-media, .stat, .contact-list li, .quote-form'
  );

  if ('IntersectionObserver' in window) {
    revealTargets.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealTargets.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Smooth anchor scroll with sticky-header offset ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var id = anchor.getAttribute('href');
      if (!id || id === '#') { return; }
      var target = document.querySelector(id);
      if (!target) { return; }
      e.preventDefault();
      var offset = header ? header.offsetHeight + 10 : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
      if (history.replaceState) { history.replaceState(null, '', id); }
    });
  });

  /* ---------- Phone number formatting ---------- */
  var phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      var digits = phoneInput.value.replace(/\D/g, '').slice(0, 10);
      var out = digits;
      if (digits.length > 6) {
        out = '(' + digits.slice(0, 3) + ') ' + digits.slice(3, 6) + '-' + digits.slice(6);
      } else if (digits.length > 3) {
        out = '(' + digits.slice(0, 3) + ') ' + digits.slice(3);
      } else if (digits.length > 0) {
        out = '(' + digits;
      }
      phoneInput.value = out;
    });
  }

  /* ---------- Form validation ---------- */
  var form = document.getElementById('quoteForm');
  var success = document.getElementById('formSuccess');

  function setError(input, message) {
    var field = input.closest('.field');
    var errEl = document.getElementById('err-' + input.id);
    if (field) { field.classList.toggle('invalid', Boolean(message)); }
    if (errEl) { errEl.textContent = message || ''; }
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    return !message;
  }

  function validateField(input) {
    var value = (input.value || '').trim();

    if (input.id === 'name') {
      if (!value) { return setError(input, 'Please enter your name.'); }
      if (value.length < 2) { return setError(input, 'Please enter your full name.'); }
      return setError(input, '');
    }

    if (input.id === 'phone') {
      var digits = value.replace(/\D/g, '');
      if (!digits) { return setError(input, 'A phone number lets us reach you fast.'); }
      if (digits.length < 10) { return setError(input, 'Please enter a 10-digit phone number.'); }
      return setError(input, '');
    }

    if (input.id === 'email') {
      if (!value) { return setError(input, ''); }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        return setError(input, 'Please enter a valid email address.');
      }
      return setError(input, '');
    }

    if (input.id === 'service') {
      if (!value) { return setError(input, 'Please choose the service you need.'); }
      return setError(input, '');
    }

    if (input.id === 'message') {
      if (!value) { return setError(input, 'Tell us briefly what is happening.'); }
      if (value.length < 10) { return setError(input, 'A few more details help us quote accurately.'); }
      return setError(input, '');
    }

    return true;
  }

  if (form) {
    var validated = ['name', 'phone', 'email', 'service', 'message']
      .map(function (id) { return document.getElementById(id); })
      .filter(Boolean);

    validated.forEach(function (input) {
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        var field = input.closest('.field');
        if (field && field.classList.contains('invalid')) { validateField(input); }
      });
      input.addEventListener('change', function () { validateField(input); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var firstInvalid = null;
      validated.forEach(function (input) {
        var ok = validateField(input);
        if (!ok && !firstInvalid) { firstInvalid = input; }
      });

      if (firstInvalid) {
        if (success) { success.hidden = true; }
        firstInvalid.focus();
        return;
      }

      var name = document.getElementById('name').value.trim().split(' ')[0];
      var urgencyEl = document.getElementById('urgency');
      var urgent = urgencyEl && urgencyEl.value.indexOf('Emergency') === 0;

      if (success) {
        success.hidden = false;
        success.textContent = urgent
          ? 'Thanks, ' + name + ' — request received. For an active leak, please also call (555) 911-4537 now so we can dispatch a truck immediately.'
          : 'Thanks, ' + name + ' — your request is in. A dispatcher will follow up shortly with a flat-rate quote and a scheduling window.';
      }

      form.reset();
      validated.forEach(function (input) { setError(input, ''); });

      if (success && typeof success.scrollIntoView === 'function') {
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  }
})();
