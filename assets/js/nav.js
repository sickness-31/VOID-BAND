/*
  ====================================================================
  VO!D — MOBILE NAV
  assets/js/nav.js

  On screens 900px and narrower the nav links are hidden behind a
  three-bar button (see .nav-toggle in assets/css/site.css). This
  toggles them open and closed. Nothing to edit here for content —
  the links live in each page's <nav>.
  ====================================================================
*/
(function () {
  'use strict';
  var nav = document.getElementById('nav');
  var btn = nav && nav.querySelector('.nav-toggle');
  if (!nav || !btn) return;

  function setOpen(open) {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }

  btn.addEventListener('click', function () {
    setOpen(!nav.classList.contains('open'));
  });
  // tapping a link closes the panel (matters for same-page #anchors)
  nav.querySelectorAll('.nav-links a').forEach(function (a) {
    a.addEventListener('click', function () { setOpen(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setOpen(false);
  });
})();
