/*
  ====================================================================
  VO!D — SHOW RENDERER
  assets/js/shows.js

  Reads window.VOID_SHOWS (from data/shows.js) and writes show rows
  into any element that has a data-shows attribute.

  YOU SHOULD NOT NEED TO EDIT THIS FILE TO ADD SHOWS.
  Edit data/shows.js instead.

  USAGE (in HTML):
    <div class="show-list" data-shows="upcoming"></div>
    <div class="show-list" data-shows="past" data-video="true"></div>
    <div class="show-list" data-shows="upcoming" data-limit="3"></div>

  data-shows   "upcoming" | "past"     which shows to list
  data-limit   number                  max rows (optional)
  data-video   "true"                  embed YouTube (in the row, right side) for shows that have one
  data-condensed "true"                no buttons / video / photos (EPK view)
  data-empty   text                    message shown when the list is empty

  Per-show fields it reads: date, venue, city, event (optional label),
  bill (full lineup, printed as-is), ticketUrl, youtubeId, photos.

  data-photos  "true"                  show the photo strip for past shows
                                       that have photos (click opens a lightbox)

  Upcoming = today or later, soonest first.
  Past     = before today, most recent first.
  ====================================================================
*/

(function () {
  'use strict';

  var CONTACT_EMAIL = 'void.empr@gmail.com';

  // "2026-08-01" → a Date at local midnight.
  // (new Date("2026-08-01") would parse as UTC and shift a day in some zones.)
  function parseDate(iso) {
    var p = iso.split('-');
    return new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
  }

  function today() {
    var d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }

  // Stops a stray < or & in a venue name from breaking the page.
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // photos: 12  -> assets/shows/<date>/01.jpg ... 12.jpg
  // photos: ["a.jpg", "b.jpg"] -> assets/shows/<date>/a.jpg, ...
  function photoUrls(show) {
    var dir = 'assets/shows/' + show.date + '/';
    var p = show.photos;
    if (Array.isArray(p)) {
      return p.filter(Boolean).map(function (f) { return dir + f; });
    }
    var n = parseInt(p, 10);
    var out = [];
    for (var i = 1; i <= n; i++) {
      out.push(dir + (i < 10 ? '0' + i : String(i)) + '.jpg');
    }
    return out;
  }

  function getShows(mode) {
    var all = (window.VOID_SHOWS || []).filter(function (s) {
      return s && typeof s.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s.date);
    });
    var now = today();
    var list = all.filter(function (s) {
      var d = parseDate(s.date);
      return mode === 'past' ? d < now : d >= now;
    });
    list.sort(function (a, b) {
      var da = parseDate(a.date), db = parseDate(b.date);
      return mode === 'past' ? db - da : da - db;
    });
    return list;
  }

  function renderRow(show, opts) {
    var bill = Array.isArray(show.bill) ? show.bill.filter(Boolean) : [];
    var hasVideo = opts.video && opts.mode === 'past' && !!show.youtubeId;
    var photos = (opts.photos && opts.mode === 'past') ? photoUrls(show) : [];
    var html = '<div class="show-row' + (hasVideo ? ' has-video' : '') + '">';
    html += '<span class="show-date">' + esc(show.date) + '</span>';
    html += '<div class="show-info">';
    if (show.event) {
      html += '<span class="show-event">' + esc(show.event) + '</span>';
    }
    html += '<span class="show-venue">' + esc(show.venue) + '</span>';
    html += '<span class="show-location">' + esc(show.city) + '</span>';
    if (bill.length) {
      html += '<span class="show-bill">' + bill.map(esc).join(', ') + '</span>';
    }
    html += '</div>';

    if (!opts.condensed) {
      if (opts.mode === 'upcoming') {
        var href = show.ticketUrl ? show.ticketUrl : 'mailto:' + CONTACT_EMAIL;
        var label = show.ticketUrl ? 'TICKETS' : 'CONTACT US';
        var extra = show.ticketUrl ? ' target="_blank" rel="noopener"' : '';
        html += '<a href="' + esc(href) + '" class="show-ticket"' + extra + '>' + label + '</a>';
      } else if (show.youtubeId && !opts.video) {
        // Past show with a video, but this list isn't embedding — link out.
        html += '<a href="https://www.youtube.com/watch?v=' + esc(show.youtubeId) +
                '" class="show-ticket" target="_blank" rel="noopener">WATCH</a>';
      }
    }
    if (hasVideo) {
      // player sits in the row's third column (see .show-row.has-video in CSS)
      html += '<div class="show-video">' +
        '<iframe src="https://www.youtube.com/embed/' + esc(show.youtubeId) + '" ' +
        'title="VO!D live at ' + esc(show.venue) + ', ' + esc(show.date) + '" ' +
        'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
        'referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe>' +
        '</div>';
    }
    if (photos.length) {
      // thumbnail strip spans the full row width (see .show-photos in CSS)
      html += '<div class="show-photos">';
      for (var p = 0; p < photos.length; p++) {
        html += '<a href="' + esc(photos[p]) + '" class="show-photo" ' +
          'data-lightbox="' + esc(show.date) + '" data-index="' + p + '">' +
          '<img src="' + esc(photos[p]) + '" alt="VO!D at ' + esc(show.venue) + ', ' + esc(show.date) + '" loading="lazy">' +
          '</a>';
      }
      html += '</div>';
    }
    html += '</div>';
    return html;
  }

  function renderInto(el) {
    var mode = el.getAttribute('data-shows') === 'past' ? 'past' : 'upcoming';
    var opts = {
      mode: mode,
      video: el.getAttribute('data-video') === 'true',
      condensed: el.getAttribute('data-condensed') === 'true',
      photos: el.getAttribute('data-photos') === 'true'
    };
    var limit = parseInt(el.getAttribute('data-limit'), 10);
    var shows = getShows(mode);
    if (limit > 0) shows = shows.slice(0, limit);

    if (!shows.length) {
      var msg = el.getAttribute('data-empty') ||
        (mode === 'past' ? 'No past shows listed yet.' : 'No upcoming dates. Check back soon.');
      el.innerHTML = '<p class="no-shows">' + esc(msg) + '</p>';
      return;
    }
    el.innerHTML = shows.map(function (s) { return renderRow(s, opts); }).join('');
  }

  /*
    LIGHTBOX - one overlay for the whole page. Clicking a .show-photo
    opens it; left/right (keys or click) move within that show's
    photos; Esc or clicking the dark area closes it.
  */
  var lb = { el: null, img: null, urls: [], i: 0 };

  function lbShow(i) {
    lb.i = (i + lb.urls.length) % lb.urls.length;
    lb.img.src = lb.urls[lb.i];
    lb.el.querySelector('.lightbox-count').textContent = (lb.i + 1) + ' / ' + lb.urls.length;
    // photographer, from the JPEG's metadata (assets/js/credits.js), if loaded
    var credit = lb.el.querySelector('.lightbox-credit');
    credit.textContent = '';
    if (window.VOID_CREDITS) {
      var url = lb.urls[lb.i];
      window.VOID_CREDITS.get(url).then(function (name) {
        if (name && lb.urls[lb.i] === url) credit.textContent = 'Photo: ' + name;
      });
    }
  }
  function lbClose() {
    lb.el.hidden = true;
    lb.img.src = '';
    document.body.style.overflow = '';
  }
  function lbOpen(urls, i) {
    if (!lb.el) {
      lb.el = document.createElement('div');
      lb.el.className = 'lightbox';
      lb.el.innerHTML =
        '<button type="button" class="lightbox-prev" aria-label="Previous">&larr;</button>' +
        '<img alt="">' +
        '<button type="button" class="lightbox-next" aria-label="Next">&rarr;</button>' +
        '<button type="button" class="lightbox-close" aria-label="Close">&times;</button>' +
        '<span class="lightbox-count"></span>' +
        '<span class="lightbox-credit"></span>';
      document.body.appendChild(lb.el);
      lb.img = lb.el.querySelector('img');
      lb.el.addEventListener('click', function (e) {
        if (e.target.classList.contains('lightbox-prev')) lbShow(lb.i - 1);
        else if (e.target.classList.contains('lightbox-next') || e.target === lb.img) lbShow(lb.i + 1);
        else lbClose();
      });
      document.addEventListener('keydown', function (e) {
        if (lb.el.hidden) return;
        if (e.key === 'Escape') lbClose();
        else if (e.key === 'ArrowLeft') lbShow(lb.i - 1);
        else if (e.key === 'ArrowRight') lbShow(lb.i + 1);
      });
    }
    lb.urls = urls;
    lb.el.hidden = false;
    document.body.style.overflow = 'hidden';
    lbShow(i);
  }

  function onPhotoClick(e) {
    var a = e.target.closest ? e.target.closest('a.show-photo') : null;
    if (!a) return;
    e.preventDefault();
    var strip = a.parentElement;
    var links = strip.querySelectorAll('a.show-photo');
    var urls = [];
    for (var i = 0; i < links.length; i++) urls.push(links[i].getAttribute('href'));
    lbOpen(urls, parseInt(a.getAttribute('data-index'), 10) || 0);
  }

  function init() {
    var targets = document.querySelectorAll('[data-shows]');
    for (var i = 0; i < targets.length; i++) renderInto(targets[i]);
    document.addEventListener('click', onPhotoClick);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
