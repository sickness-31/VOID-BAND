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
  data-video   "true"                  embed YouTube for shows that have one
  data-condensed "true"                date / venue / city only (EPK view)
  data-empty   text                    message shown when the list is empty

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
    var html = '<div class="show-row">';
    html += '<span class="show-date">' + esc(show.date) + '</span>';
    html += '<div class="show-info">';
    html += '<span class="show-venue">' + esc(show.venue) + '</span>';
    html += '<span class="show-location">' + esc(show.city) + '</span>';
    if (!opts.condensed && bill.length) {
      html += '<span class="show-bill">w/ ' + bill.map(esc).join(', ') + '</span>';
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
    html += '</div>';

    if (opts.video && opts.mode === 'past' && show.youtubeId) {
      html += '<div class="show-video">' +
        '<iframe src="https://www.youtube.com/embed/' + esc(show.youtubeId) + '" ' +
        'title="VO!D live at ' + esc(show.venue) + ', ' + esc(show.date) + '" ' +
        'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" ' +
        'referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe>' +
        '</div>';
    }
    return html;
  }

  function renderInto(el) {
    var mode = el.getAttribute('data-shows') === 'past' ? 'past' : 'upcoming';
    var opts = {
      mode: mode,
      video: el.getAttribute('data-video') === 'true',
      condensed: el.getAttribute('data-condensed') === 'true'
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

  function init() {
    var targets = document.querySelectorAll('[data-shows]');
    for (var i = 0; i < targets.length; i++) renderInto(targets[i]);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
