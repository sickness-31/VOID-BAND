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
    event      "Some Fest"    optional. Festival or tour name. Shows as a
                              red label above the venue. Leave "" for a
                              regular show.
    bill       [ ... ]        optional. Full lineup in bill order, in
                              quotes, separated by commas. Include VO!D.
                              Use [] if unknown.
    ticketUrl  "https://..."  optional. Leave "" and the row shows CONTACT US.
    youtubeId  "abc123XYZ"    optional. For PAST shows with a published
                              multitrack video. This is the part of the
                              YouTube URL after "v=" — for
                              https://www.youtube.com/watch?v=_7-afHWL_mc
                              the id is "_7-afHWL_mc". Pasting the whole
                              URL also works. Leave "" until the video
                              is up.
    photos     12             optional. Number of photos for a PAST show.
                              Files go in assets/shows/<date>/ named
                              01.jpg, 02.jpg, ... up to that number, e.g.
                              assets/shows/2026-06-05/01.jpg
                              Adding one: drop in 13.jpg, change 12 to 13.
                              Removing one from the middle: renumber.
                              0 = no gallery.
                              You can also give a list of filenames instead:
                              photos: ["01.jpg", "crowd.jpg"]
    clips      [ ... ]        optional. Short video FILES in the same show
                              folder, by name: clips: ["clip-01.mp4"]
                              Keep them small (H.264 1080p, under ~20 s /
                              20 MB). Anything longer goes on YouTube.
    videos     [ ... ]        optional. YouTube videos for the gallery, ids
                              or pasted URLs: videos: ["_7-afHWL_mc"]
                              (youtubeId above is the featured one shown
                              big beside the show; these go in the strip.)

  Lines starting with // are comments — they're ignored by the browser.
  ====================================================================
*/

window.VOID_SHOWS = [
  {
    date: "2026-09-11",
    venue: "The Dive Bar",
    city: "Edmonton, AB",
    event: "",
    bill: ["Axohxin","Flaccid Wrath","VO!D","Desicrate"],
    ticketUrl: "",
    youtubeId: "",
    photos: 0
  },
  {
    date: "2026-08-01",
    venue: "The Vat",
    city: "Red Deer, AB",
    event: "Consumer Culture EP Release Show",
    bill: ["A Nobodies Achievement","Folded Hand","VO!D"],
    ticketUrl: "",
    youtubeId: "",
    photos: 0
  },
  {
    date: "2026-07-05",
    venue: "Blox Art Centre",
    city: "Calgary, AB",
    event: "THE GREAT WESTERN ROT",
    bill: ["Without Mercy","Butcher","Decrepitation","VO!D"],
    ticketUrl: "",
    youtubeId: "",
    photos: 0
  },
  {
    date: "2026-07-04",
    venue: "D2 Bar & Stage",
    city: "Red Deer, AB",
    event: "THE GREAT WESTERN ROT",
    bill: ["Without Mercy","Butcher","Decrepitation","VO!D"],
    ticketUrl: "",
    youtubeId: "",
    photos: 0
  },
  {
    date: "2026-07-03",
    venue: "Rendevous Pub",
    city: "Edmonton, AB",
    event: "THE GREAT WESTERN ROT",
    bill: ["Without Mercy","Butcher","Decrepitation","VO!D"],
    ticketUrl: "",
    youtubeId: "",
    photos: 0
  },
  {
    date: "2026-06-05",
    venue: "The Rec Room",
    city: "Calgary, AB",
    event: "DECIMATE FEST FUNDRAISER",
    bill: ["Hombre", "Axohxin","Disorderly Conduct","Another Time Around","VO!D"],
    ticketUrl: "",
    youtubeId: "_7-afHWL_mc",
    photos: 0
  },
  {
    date: "2026-03-06",
    venue: "Vin L Den",
    city: "Red Deer, AB",
    event: "RESIDUAL EP RELEASE SHOW",
    bill: ["VO!D","The 21st Agenda","Feel and Flow"],
    ticketUrl: "",
    youtubeId: "",
    photos: 7
  },
  {
    date: "2025-09-11",
    venue: "The Kings Head",
    city: "Calgary, AB",
    event: "",
    bill: ["Jane Decay","GodFall","VO!D"],
    ticketUrl: "",
    youtubeId: "",
    photos: 0
  },
  {
    date: "2025-07-06",
    venue: "Blox Art Centre",
    city: "Calgary, AB",
    event: "",
    bill: ["Nameless King","Balrogath","Cultist","VO!D"],
    ticketUrl: "",
    youtubeId: "",
    photos: 10
  },

  // ---- paste new shows above this line ----
];
