# VO!D — Band Website

Official site for VO!D. Three static HTML pages sharing one stylesheet, hosted free on GitHub Pages. No build step.

- `index.html` — fan-facing homepage
- `shows.html` — upcoming + past shows (with video where available)
- `epk.html`   — electronic press kit for bookers / promoters, with a one-sheet PDF button

---

## How to update the site

Every piece of content you'd want to change is marked with a `<!-- CHANGE: -->` comment in the HTML. Search for `CHANGE:` to jump between them.

**Shows are the exception** — they live in `data/shows.js`, not in any HTML file. See below.

Styles live in `assets/css/site.css` (shared by all three pages).

Save the file, commit, push — the site updates within about 60 seconds.

---

## Common updates

### Add a show
Open `data/shows.js`. Copy one `{ ... },` block, paste it anywhere in the list, fill in the fields:

```js
{
  date: "2026-11-07",          // YYYY-MM-DD
  venue: "Venue Name",
  city: "Calgary, AB",
  event: "",                   // festival / tour name, or ""
  bill: ["Band A", "VO!D"],    // full lineup in bill order, or []
  ticketUrl: "",              // leave "" to show CONTACT US
  youtubeId: ""               // past shows only, once the video is up
},
```

That's it. The homepage shows the next 3 upcoming, `shows.html` shows everything, `epk.html` lists past shows as history. Upcoming vs Past is decided automatically from the date.

### Attach a live video to a past show
Set `youtubeId` on that show in `data/shows.js`. It's the part of the YouTube URL after `v=`. The player embeds under the show's row on `shows.html`.

### Remove a show
Delete its `{ ... },` block from `data/shows.js`.

### Update the press kit
Open `epk.html`. Anything still needed is in a `<div class="todo">` box — search for `TODO`. Delete each box once the real content is in.

### Export the one-sheet PDF
Open `epk.html` in a browser → **Download One-Sheet (PDF)** (or Ctrl+P → Save as PDF). The print stylesheet strips the nav, flips to black-on-white, and swaps embeds for their URLs.

### Add a new release
In the Music section, duplicate the `release-block` div.
Update the year, format, title, description, and Spotify embed.
To get a new Spotify embed: open the release in Spotify → three dots → Share → Embed → copy the iframe code.

### Update social links
Find the Social Links block in the Contact section.
Each `<a>` tag has a `href=` — replace the URL inside the quotes.

### Swap a photo
Images in `assets/images/` are named by their slot on the page, not by what's in them. To change the wide About photo, save your new file as `assets/images/about-wide.jpg` over the old one. No HTML edit needed. Keep these web-sized (~1600–2000px on the long edge) — the site gets slow with camera-sized files.

Full-res originals for the EPK downloads live in `assets/press/`. Those are named by content because a promoter sees the filename when they save it.

### Section backgrounds
Every homepage section (About, Music, Live, Merch, Contact) can have a faint photo behind it. Drop a file named `bg-about.jpg`, `bg-music.jpg`, `bg-live.jpg`, `bg-merch.jpg`, or `bg-contact.jpg` into `assets/images/` and it appears on refresh. Delete the file and it's gone. If a file isn't there, the section is just black — nothing to switch off.

Opacity and desaturation are set once in `assets/css/site.css` under `SECTION BACKGROUNDS` (`.section-bg`). Same rules as photos: web-sized JPGs.

### Add a product to merch
Find the merch grid. Copy one `<div class="merch-card">` block, paste it, update the title, description, and price.

---

## File structure

```
void-band/
├── index.html              ← homepage
├── shows.html              ← upcoming + past shows
├── epk.html                ← press kit / one-sheet
├── CNAME                   ← custom domain (add your domain name here)
├── README.md               ← this file
├── data/
│   └── shows.js            ← THE show list. Edit this to add shows.
└── assets/
    ├── css/
    │   └── site.css        ← all styles, shared by every page
    ├── js/
    │   └── shows.js        ← reads data/shows.js and draws the rows (don't edit)
    ├── images/                 ← homepage images, named by WHERE they sit (web-sized)
    │   ├── hero-bg.png         ← faint logo behind the hero
    │   ├── logo.png            ← nav + footer logo
    │   ├── divider-1.jpg       ← photo strip after the hero
    │   ├── about-wide.jpg      ← About grid, top (wide)
    │   ├── about-1.jpg         ← About grid, bottom-left
    │   ├── about-2.jpg         ← About grid, bottom-right
    │   ├── divider-2.jpg       ← photo strip after About
    │   ├── og-image.jpg        ← link-preview image (Discord, iMessage, etc.)
    │   └── bg-*.jpg            ← optional section backgrounds (see below) — not present until you add them
    └── press/                  ← full-resolution originals for the EPK download links
        ├── press-photo-1.jpg … press-photo-4.jpg
        ├── logo-shrapnel.png
        ├── logo-block.png
        └── cover-residual.jpg
```

---

## Setting up GitHub Pages

1. Push this repo to GitHub (must be **public**)
2. Go to the repo → Settings → Pages
3. Source: Deploy from branch → `main` → `/root` → Save
4. Site goes live at `https://yourusername.github.io/void-band`

## Adding a custom domain

1. Buy a domain (namecheap.com is good, ~$15/year)
2. Open the `CNAME` file in this repo and type your domain name (e.g. `voidband.com`)
3. In your domain registrar's DNS settings, add these records:
   - A record → `185.199.108.153`
   - A record → `185.199.109.153`
   - A record → `185.199.110.153`
   - A record → `185.199.111.153`
4. Back on GitHub → Settings → Pages → Custom domain → enter your domain → Save
5. Check "Enforce HTTPS" once it activates (takes up to 24 hours)

---

## Changing colors

Open `assets/css/site.css`, find the `:root {` block near the top.
The color variables are all there with comments explaining each one. Changing them restyles all three pages.

---

*Site built and maintained by Sickness Studios*
