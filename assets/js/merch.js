/*
  ====================================================================
  MERCH + CART
  assets/js/merch.js

  Reads window.SITE_MERCH (data/merch.js) and window.SITE (data/site.js)
  and renders products into any element with a data-merch attribute.

  YOU SHOULD NOT NEED TO EDIT THIS FILE TO CHANGE MERCH.
  Edit data/merch.js instead, or use tools/merch.html.

  HOW ORDERING WORKS
  The cart lives in the visitor's browser only. On Review they get an
  order summary, a reference like VOID-8F3K, and two buttons: open it
  in their email app, or copy it to paste anywhere. Nothing is sent to
  a server and nothing is stored outside their own browser.

  The band replies with e-Transfer details once stock is confirmed.
  ====================================================================
*/

(function () {
  'use strict';

  var CFG = window.SITE || {};
  var CUR = CFG.currency || '$';
  var KEY = 'merch-cart';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function money(n) { return CUR + Number(n || 0).toFixed(2).replace(/\.00$/, ''); }
  function items() {
    return (window.SITE_MERCH || []).filter(function (p) { return p && p.active !== false && p.id; });
  }
  function find(id) {
    var all = items(), i;
    for (i = 0; i < all.length; i++) if (all[i].id === id) return all[i];
    return null;
  }
  // stock for one product/variant; variants win when present
  function stockOf(p, label) {
    if (p.variants && p.variants.length) {
      for (var i = 0; i < p.variants.length; i++) {
        if (p.variants[i].label === label) return Math.max(0, parseInt(p.variants[i].stock, 10) || 0);
      }
      return 0;
    }
    return Math.max(0, parseInt(p.stock, 10) || 0);
  }
  function totalStock(p) {
    if (p.variants && p.variants.length) {
      return p.variants.reduce(function (n, v) { return n + Math.max(0, parseInt(v.stock, 10) || 0); }, 0);
    }
    return Math.max(0, parseInt(p.stock, 10) || 0);
  }

  /* ---------------- cart state ---------------- */
  var cart = load();
  function load() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY) || '{}');
      if (!raw || !Array.isArray(raw.lines)) return { ref: '', lines: [], sent: false };
      raw.sent = !!raw.sent;
      return raw;
    } catch (e) { return { ref: '', lines: [], sent: false }; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {}
  }
  function makeRef() {
    var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', out = '';
    for (var i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)];
    return (CFG.orderPrefix || 'ORDER') + '-' + out;
  }
  function count() { return cart.lines.reduce(function (n, l) { return n + l.qty; }, 0); }
  function total() {
    return cart.lines.reduce(function (n, l) {
      var p = find(l.id);
      return n + (p ? p.price * l.qty : 0);
    }, 0);
  }
  function lineOf(id, label) {
    for (var i = 0; i < cart.lines.length; i++) {
      if (cart.lines[i].id === id && cart.lines[i].label === label) return cart.lines[i];
    }
    return null;
  }
  function add(id, label) {
    var p = find(id); if (!p) return;
    // the last order was already sent, so this is a new one
    if (cart.sent) { cart = { ref: '', lines: [], sent: false }; }
    var have = lineOf(id, label), inCart = have ? have.qty : 0;
    if (inCart >= stockOf(p, label)) return false;    // never oversell
    if (!cart.ref) cart.ref = makeRef();
    if (have) have.qty++; else cart.lines.push({ id: id, label: label, qty: 1 });
    save(); paintBar(); paintReview();
    return true;
  }
  function remove(i) {
    cart.lines.splice(i, 1);
    if (!cart.lines.length) { cart.ref = ''; cart.sent = false; }
    save(); paintBar(); paintReview();
  }

  /* ---------------- product list ---------------- */
  function photoSrc(p, n) { return 'assets/merch/' + p.id + '/' + (n < 10 ? '0' + n : n) + '.jpg'; }

  function card(p) {
    var left = totalStock(p), out = left === 0;
    var h = '<div class="merch-card' + (out ? ' is-out' : '') + '" data-item="' + esc(p.id) + '">';

    if (p.photos > 0) {
      h += '<div class="merch-photo"><img src="' + esc(photoSrc(p, 1)) + '" alt="' + esc(p.name) + '" loading="lazy"></div>';
      if (p.photos > 1) {
        h += '<div class="merch-thumbs">';
        for (var n = 1; n <= p.photos; n++) {
          h += '<button type="button" class="merch-thumb' + (n === 1 ? ' on' : '') + '" data-src="' + esc(photoSrc(p, n)) + '">' +
               '<img src="' + esc(photoSrc(p, n)) + '" alt="" loading="lazy"></button>';
        }
        h += '</div>';
      }
    } else {
      h += '<div class="merch-img">' + esc(p.name.slice(0, 18)) + '</div>';
    }

    h += '<p class="merch-title">' + esc(p.name) + '</p>';
    if (p.description) h += '<p class="merch-desc">' + esc(p.description) + '</p>';
    h += '<span class="merch-price">' + money(p.price) + (out ? ' &middot; SOLD OUT' : '') + '</span>';

    if (!out) {
      if (p.variants && p.variants.length) {
        h += '<div class="merch-variants">';
        p.variants.forEach(function (v, i) {
          var s = Math.max(0, parseInt(v.stock, 10) || 0);
          h += '<button type="button" class="merch-variant' + (s ? '' : ' is-out') + '"' +
               (s ? '' : ' disabled') + ' data-label="' + esc(v.label) + '"' +
               (s && i === firstAvailable(p) ? ' aria-pressed="true"' : ' aria-pressed="false"') + '>' +
               esc(v.label) + '</button>';
        });
        h += '</div>';
      }
      var only = lastOne(p);
      if (only) h += '<p class="merch-left">Last one</p>';
      h += '<button type="button" class="merch-add">ADD</button>';
    }
    h += '</div>';
    return h;
  }
  function firstAvailable(p) {
    if (!p.variants) return -1;
    for (var i = 0; i < p.variants.length; i++) {
      if ((parseInt(p.variants[i].stock, 10) || 0) > 0) return i;
    }
    return -1;
  }
  function lastOne(p) {
    if (p.variants && p.variants.length) return false;
    return totalStock(p) === 1;
  }

  function paintList() {
    var targets = document.querySelectorAll('[data-merch]');
    if (!targets.length) return;
    var list = items(), html;
    if (!list.length) {
      html = '<p class="no-shows">Nothing in the store right now. Check back soon.</p>';
    } else {
      html = '<div class="merch-grid">' + list.map(card).join('') + '</div>';
    }
    for (var i = 0; i < targets.length; i++) targets[i].innerHTML = html;
  }

  /* ---------------- cart bar + review ---------------- */
  function paintBar() {
    var bar = document.getElementById('cart-bar');
    if (!bar) return;
    var n = count();
    bar.hidden = n === 0;
    if (n) {
      bar.querySelector('.cart-summary').textContent =
        n + (n === 1 ? ' item' : ' items') + ' · ' + money(total());
    }
  }
  function paint() { paintList(); paintBar(); paintReview(); }

  function paintReview() {
    var box = document.getElementById('cart-lines');
    if (!box) return;
    var h = '';
    cart.lines.forEach(function (l, i) {
      var p = find(l.id); if (!p) return;
      h += '<div class="cart-line">' +
        '<span class="cart-qty">' + l.qty + ' &times;</span>' +
        '<span class="cart-name">' + esc(p.name) + (l.label ? ' <em>(' + esc(l.label) + ')</em>' : '') + '</span>' +
        '<span class="cart-price">' + money(p.price * l.qty) + '</span>' +
        '<button type="button" class="cart-remove" data-i="' + i + '" aria-label="Remove">&times;</button>' +
        '</div>';
    });
    box.innerHTML = h;
    var t = document.getElementById('cart-total');
    if (t) t.textContent = money(total());
    var r = document.getElementById('cart-ref');
    if (r) r.textContent = cart.ref || '';
    var e = document.getElementById('cart-email');
    if (e) { e.textContent = CFG.email || ''; e.href = 'mailto:' + (CFG.email || ''); }
  }

  // The message the buyer sends. Same text for the email and the clipboard.
  function orderText() {
    var ship = document.querySelector('input[name="fulfil"]:checked');
    var mode = ship ? ship.value : 'pickup';
    var name = (document.getElementById('cart-name') || {}).value || '';
    var addr = (document.getElementById('cart-address') || {}).value || '';
    var note = (document.getElementById('cart-note') || {}).value || '';
    var out = ['Order ' + cart.ref, ''];
    cart.lines.forEach(function (l) {
      var p = find(l.id); if (!p) return;
      out.push(l.qty + ' x ' + p.name + (l.label ? ' (' + l.label + ')' : '') + ' - ' + money(p.price * l.qty));
    });
    out.push('', 'Total: ' + money(total()), '');
    out.push('Name: ' + name.trim());
    out.push('Fulfilment: ' + (mode === 'ship' ? 'Shipping' : 'Pickup at next show'));
    if (mode === 'ship') out.push('Address: ' + addr.trim());
    if (note.trim()) out.push('Notes: ' + note.trim());
    out.push('', 'Please confirm availability and send e-Transfer details.');
    return out.join('\n');
  }

  // called once the buyer has actually sent the order
  function markSent() {
    cart.sent = true;
    save();
    var msg = document.getElementById('cart-sent');
    if (msg) msg.hidden = false;
  }

  function openOverlay(on) {
    var ov = document.getElementById('cart-overlay');
    if (!ov) return;
    ov.hidden = !on;
    document.body.style.overflow = on ? 'hidden' : '';
    if (on) {
      paintReview();
      var msg = document.getElementById('cart-sent');
      if (msg) msg.hidden = !cart.sent;
    }
  }

  /* ---------------- events ---------------- */
  document.addEventListener('click', function (e) {
    var t = e.target;

    var thumb = t.closest && t.closest('.merch-thumb');
    if (thumb) {
      var card0 = thumb.closest('.merch-card');
      card0.querySelector('.merch-photo img').src = thumb.getAttribute('data-src');
      card0.querySelectorAll('.merch-thumb').forEach(function (b) { b.classList.remove('on'); });
      thumb.classList.add('on');
      return;
    }

    var vb = t.closest && t.closest('.merch-variant');
    if (vb && !vb.disabled) {
      vb.closest('.merch-card').querySelectorAll('.merch-variant').forEach(function (b) {
        b.setAttribute('aria-pressed', 'false');
      });
      vb.setAttribute('aria-pressed', 'true');
      return;
    }

    var addBtn = t.closest && t.closest('.merch-add');
    if (addBtn) {
      var c = addBtn.closest('.merch-card');
      var sel = c.querySelector('.merch-variant[aria-pressed="true"]');
      var ok = add(c.getAttribute('data-item'), sel ? sel.getAttribute('data-label') : '');
      flash(addBtn, ok ? 'ADDED' : 'THAT’S ALL WE HAVE');
      return;
    }

    var rm = t.closest && t.closest('.cart-remove');
    if (rm) { remove(parseInt(rm.getAttribute('data-i'), 10)); return; }

    if (t.closest && t.closest('#cart-open')) { openOverlay(true); return; }
    if (t.closest && t.closest('#cart-close')) { openOverlay(false); return; }
    if (t.id === 'cart-overlay') { openOverlay(false); return; }

    if (t.closest && t.closest('#cart-mail')) {
      var subject = (CFG.name ? CFG.name + ' ' : '') + 'merch order ' + cart.ref;
      markSent();
      window.location.href = 'mailto:' + encodeURIComponent(CFG.email || '') +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(orderText());
      return;
    }

    if (t.closest && t.closest('#cart-copy')) {
      var txt = orderText(), msg = document.getElementById('cart-copied');
      var done = function () {
        if (msg) msg.textContent = 'Copied. Paste it into an email to ' + (CFG.email || '') + '.';
        markSent();
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(done, function () { fallbackCopy(txt, done); });
      } else { fallbackCopy(txt, done); }
      return;
    }
  });

  // brief label change so a click is visibly acknowledged
  function flash(btn, text) {
    if (btn.dataset.busy) return;
    var original = btn.textContent;
    btn.dataset.busy = '1';
    btn.textContent = text;
    setTimeout(function () { btn.textContent = original; delete btn.dataset.busy; }, 1200);
  }

  function fallbackCopy(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.setAttribute('readonly', '');
    ta.style.position = 'fixed'; ta.style.left = '-9999px';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch (e) {}
    document.body.removeChild(ta);
  }

  // shipping address only matters when shipping is picked
  document.addEventListener('change', function (e) {
    if (e.target.name !== 'fulfil') return;
    var wrap = document.getElementById('cart-address-wrap');
    if (wrap) wrap.hidden = e.target.value !== 'ship';
  });

  document.addEventListener('keydown', function (e) {
    var ov = document.getElementById('cart-overlay');
    if (e.key === 'Escape' && ov && !ov.hidden) openOverlay(false);
  });

  function init() {
    // drop anything whose product or stock disappeared since last visit
    cart.lines = cart.lines.filter(function (l) {
      var p = find(l.id);
      if (!p) return false;
      var s = stockOf(p, l.label);
      if (s <= 0) return false;
      if (l.qty > s) l.qty = s;
      return true;
    });
    if (!cart.lines.length) cart.ref = '';
    save();
    paint();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
