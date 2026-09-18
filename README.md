# VO!D — Band Website

Official site for VO!D. Three static HTML pages sharing one stylesheet, hosted free on GitHub Pages. No build step.

- `index.html` — fan-facing homepage
- `shows.html` — upcoming + past shows (with video where available)
- `epk.html`   — electronic press kit for bookers / promoters, with PDF Version (dark/light) buttons

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
  youtubeId: "",              // past shows only, once the video is up
  photos: 0                   // past shows only, see "Add show photos"
},
```

That's it. The homepage shows the next 3 upcoming, `shows.html` shows everything, `epk.html` lists past shows as history. Upcoming vs Past is decided automatically from the date.

### Attach a live video to a past show
Set `youtubeId` on that show in `data/shows.js`. It's the part of the YouTube URL after `v=`. The player embeds under the show's row on `shows.html`.

### Add show photos
Make a folder named after the show date under `assets/shows/`, put the photos in it numbered `01.jpg`, `02.jpg`, … and set `photos:` on that show to how many there are:

```
assets/shows/2026-06-05/01.jpg
assets/shows/2026-06-05/02.jpg
```
```js
photos: 2,
```

They show as a thumbnail strip under the show on `shows.html`; clicking one opens it full-size with arrow keys to move through. Keep them web-sized (~1600px long edge). To add one later, drop in the next number and bump the count.

### Remove a show
Delete its `{ ... },` block from `data/shows.js`.

### Update the press kit
Open `epk.html`. Anything still needed is in a `<div class="todo">` box — search for `TODO`. Delete each box once the real content is in.

### Export the PDF version
Open `epk.html` in a browser → **PDF Version (Dark)** or **PDF Version (Light)** → Save as PDF in the print dialog. Dark is the site's own look (send this one); Light is black-on-white for anyone who'll actually put it on paper. Plain Ctrl+P gives Dark. Both strip the nav and swap embeds for their URLs.

### Add a new release
In the Music section, duplicate the `release-block` div.
Update the year, format, title, description, and Spotify embed.
To get a new Spotify embed: open the release in Spotify → three dots → Share → Embed → copy the iframe code.

### Update social links
Find the Social Links block in the Contact section.
Each `<a>` tag has a `href=` — replace the URL inside the quotes.

### Swap a photo
Images in `assets/images/` are named by their slot on the page, not by what's in them — see **Image reference** below for the full list. To change the wide About photo, save your new file as `assets/images/about-wide.jpg` over the old one. No HTML edit needed. Keep these web-sized (~1600–2000px on the long edge) — the site gets slow with camera-sized files.

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
├── epk.html                ← press kit / PDF version
├── CNAME                   ← custom domain (add your domain name here)
├── README.md               ← this file
├── data/
│   └── shows.js            ← THE show list. Edit this to add shows.
└── assets/
    ├── css/
    │   └── site.css        ← all styles, shared by every page
    ├── js/
    │   └── shows.js        ← reads data/shows.js and draws the rows (don't edit)
    ├── images/                 ← homepage images, named by WHERE they sit (see table below)
    └── press/                  ← full-res originals for the EPK download links (see table below)
```

## Image reference

### `assets/images/` — homepage slots

Web-sized. To swap one, save the new file over the old one with the same name.

| Filename | Where it shows |
|---|---|
| `hero-bg.png` | Faint logo behind the big VO!D on the opening screen |
| `logo.png` | Nav bar (top-left) and footer (bottom-left), all three pages |
| `divider-1.jpg` | Optional — full-width photo strip between the hero and About. No file = no strip. |
| `about-wide.jpg` | About grid — top photo, spans both columns |
| `about-1.jpg` | About grid — bottom-left square |
| `about-2.jpg` | About grid — bottom-right square |
| `divider-2.jpg` | Optional — full-width photo strip between About and Music. No file = no strip. |
| `epk-logo.png` | Logo at the top of the EPK page, in place of a text title |
| `og-image.jpg` | Link-preview thumbnail when the URL is pasted in Discord / iMessage / Facebook — never visible on the page |
| `bg-about.jpg` | Optional — behind the About section |
| `bg-music.jpg` | Optional — behind the Music section |
| `bg-live.jpg` | Optional — behind the Live section |
| `bg-merch.jpg` | Optional — behind the Merch section |
| `bg-contact.jpg` | Optional — behind the Contact section |

The five `bg-*` files don't exist until you add them; the section stays black until then.

### `assets/press/` — EPK downloads

Full resolution. Named by content because a promoter sees the filename when they save it.

| Filename | What it is |
|---|---|
| `press-photo-1.jpg` | drums |
| `press-photo-2.jpg` | guitar |
| `press-photo-3.jpg` | vocalist |
| `press-photo-4.jpg` | silhouette |
| `logo-1.png` | logo (PNG) — add `logo-3.png` etc. and a matching block in `epk.html` for more |
| `logo-2.png` | logo (PNG) |
| `cover-residual.jpg` | RESIDUAL album art |
| `qr-site.svg` / `.png` | QR code to the site URL with the logo in the centre. Shown in the EPK Booking section. If the site URL ever changes, ask for it to be regenerated. |

Press-photo captions (size + photographer) are read automatically from each JPEG by `assets/js/credits.js`. Set the photographer in Windows: right-click the file → Properties → Details → **Authors**. Works for `assets/press/` and show photos (lightbox). JPEG only — PNG can't carry it. Don't click "Remove Properties and Personal Information" on that tab; it strips the credit.

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
