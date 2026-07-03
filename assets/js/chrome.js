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

  inject('/assets/partials/header.html', 'site-header-mount', function () {
    setActiveNav();
    if (window.funcAuth) window.funcAuth.updateUI();
    if (window.funcCart) window.funcCart.renderBadge();
  });
  inject('/assets/partials/footer.html', 'site-footer-mount');
})();
