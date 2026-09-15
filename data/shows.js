/*
  ====================================================================
  VO!D — SHOW DATA
  data/shows.js

  THIS IS THE ONLY FILE YOU EDIT TO ADD, CHANGE, OR REMOVE A SHOW.
  Every page that lists shows (index.html, shows.html, epk.html)
  reads from this list. You never touch layout code for a show.

  HOW IT WORKS:
  - Each { ... } block is one show. Order in this file doesn't matter —
    the pages sort by date themselves.
  - Upcoming vs Past is decided automatically by comparing the date to
    today. A show moves to "Past" on its own the day after it happens.

  TO ADD A SHOW:
  Copy one block (from "{" to "},"), paste it anywhere in the list,
  fill in the fields. Every block must end with a comma.

  FIELDS:
    date       "YYYY-MM-DD"   required. Use the numbers, e.g. "2026-11-07".
    venue      "The Vat"      required.
    city       "Red Deer, AB" required.
    bill       [ ... ]        optional. Other bands on the bill, in quotes,
                              separated by commas. Use [] if unknown/none.
    ticketUrl  "https://..."  optional. Leave "" and the row shows CONTACT US.
    youtubeId  "abc123XYZ"    optional. For PAST shows with a published
                              multitrack video. This is the part of the
                              YouTube URL after "v=" — for
                              https://www.youtube.com/watch?v=_7-afHWL_mc
                              the id is "_7-afHWL_mc". Leave "" until the
                              video is up.

  Lines starting with // are comments — they're ignored by the browser.
  ====================================================================
*/

window.VOID_SHOWS = [

  // TODO: confirm spelling of "A Nobodies Achivement" — copied as-is
  //       from the previous Live section.
  {
    date: "2026-08-01",
    venue: "The Vat",
    city: "Red Deer, AB",
    bill: ["A Nobodies Achivement", "Folded Hand"],
    ticketUrl: "",
    youtubeId: ""
  },

  {
    date: "2026-09-11",
    venue: "Dive Bar",
    city: "Edmonton, AB",
    bill: ["Axohxin"],
    ticketUrl: "",
    youtubeId: ""
  },

  // ---- paste new shows above this line ----
];
