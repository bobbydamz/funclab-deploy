// assets/js/chrome.js — injects the shared header/footer partials so nav/badge/login-state
// fixes only need to be made once instead of copy-pasted across every page.
(function () {
  function normalize(pathname) {
    var p = pathname.replace(/\.html$/, '').replace(/\/$/, '');
    return p === '' ? '/index' : p;
  }

  function setActiveNav() {
    var here = normalize(location.pathname);
    document.querySelectorAll('.main-nav > a, .main-nav .nav-dropdown a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href && normalize(href) === here) a.classList.add('active-page');
    });
  }

  function inject(url, mountId, after) {
    var mount = document.getElementById(mountId);
    if (!mount) { if (after) after(); return; }
    fetch(url)
      .then(function (r) { return r.text(); })
      .then(function (html) { mount.outerHTML = html; if (after) after(); })
      .catch(function () { if (after) after(); });
  }

  // Announcement bar: shows one message at a time, advancing every 10s.
  // The outgoing slide pushes off in the direction of travel while the
  // incoming one enters from the opposite side. The prev/next buttons jump
  // directly (reversing the travel direction) and restart the 10s timer.
  function initAnnBar() {
    var slides = document.querySelectorAll('#annSlides .ann-slide');
    if (!slides.length) return;
    var idx = 0;
    var timer;
    var animating = false;
    slides.forEach(function (s, j) { s.classList.toggle('active', j === idx); });

    function show(newIdxRaw, dir) {
      var newIdx = ((newIdxRaw % slides.length) + slides.length) % slides.length;
      if (newIdx === idx || animating || !dir) return;
      var oldSlide = slides[idx];
      var newSlide = slides[newIdx];
      animating = true;
      newSlide.style.transition = 'none';
      newSlide.style.transform = 'translateX(' + (dir > 0 ? '100%' : '-100%') + ')';
      void newSlide.offsetHeight; // flush layout with the jump above before re-enabling the transition
      newSlide.style.transition = '';
      oldSlide.style.transform = 'translateX(' + (dir > 0 ? '-100%' : '100%') + ')';
      newSlide.style.transform = 'translateX(0)';
      oldSlide.classList.remove('active');
      newSlide.classList.add('active');
      idx = newIdx;
      setTimeout(function () { animating = false; }, 500);
    }
    function restart() {
      clearInterval(timer);
      timer = setInterval(function () { show(idx + 1, 1); }, 10000);
    }
    window.annGoto = function (dir) { show(idx + dir, dir); restart(); };
    restart();
  }

  inject('/assets/partials/header.html', 'site-header-mount', function () {
    setActiveNav();
    initAnnBar();
    if (window.funcAuth) window.funcAuth.updateUI();
    if (window.funcCart) window.funcCart.renderBadge();
  });
  inject('/assets/partials/footer.html', 'site-footer-mount');
})();
