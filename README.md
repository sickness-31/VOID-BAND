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

### Add a show (no code)
Open **`tools/shows.html`** in a browser. Pick a show or click **+ NEW SHOW**, fill the form, **APPLY**, then **DOWNLOAD shows.js** and save it over `data/shows.js`. Commit and push. The same page has **Photo Prep**: drop the camera files for a show, type the photographer, and it hands you a zip of resized, credited, numbered files to unzip into `assets/shows/` (then `python tools/credits.py`).

### Add a show (by hand)
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

### Add videos to a show's gallery
Two kinds, both optional, both listed on the show in `data/shows.js`:

```js
clips:  ["clip-01.mp4"],          // video FILES in assets/shows/<date>/ — short fan clips
videos: ["_7-afHWL_mc"],          // YouTube ids or pasted URLs — full sets, longer footage
```

They appear in the strip after the photos with a play badge and open in the same lightbox. There's also `instagram: ["https://www.instagram.com/p/…"]` for post links — those show as small "Instagram ↗" chips under the lineup rather than embedding anything. Clips: H.264 1080p, aim for under 20 seconds / 20 MB each (HandBrake does this); GitHub refuses files over 100 MB and the repo gets slow long before that — anything longer belongs on YouTube. YouTube tiles need the live site or a local server to play (same as the embeds).

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

### Shrink photos for the web
Camera files are 5–15 MB each and make the site slow. After dropping photos into `assets/images/` or a show folder, run:

```bash
powershell -ExecutionPolicy Bypass -File tools\shrink.ps1 assets\shows\2026-03-06
```

Resizes in place to 2000px on the long side, keeps the photographer metadata, and tells you which files have no Authors set. It refuses to touch `assets\press\` (the full-res originals). Then `python tools\credits.py`.

### Section backgrounds
Every homepage section (About, Music, Live, Merch, Contact) can have a faint photo behind it. Drop a file named `bg-about.jpg`, `bg-music.jpg`, `bg-live.jpg`, `bg-merch.jpg`, or `bg-contact.jpg` into `assets/images/` and it appears on refresh. Delete the file and it's gone. If a file isn't there, the section is just black — nothing to switch off.

Opacity and desaturation are set once in `assets/css/site.css` under `SECTION BACKGROUNDS` (`.section-bg`). Same rules as photos: web-sized JPGs.

## Merch and orders

### How an order works
1. Someone adds items to the cart on the site and hits **Review order**.
2. They get an order reference (like `VOID-8F3K`), fill in their name and whether they want pickup or shipping, and send it to you — by email button or by copying the text.
3. **You check the item is still there**, then reply with your e-Transfer details (and a shipping cost, if they're shipping).
4. They send the e-Transfer with the reference in the message.
5. You mark it paid, send the item, and **lower the stock** in `tools/merch.html`.

Nothing is charged automatically and no card details are involved. The cart lives only in the buyer's browser — no server, no database, nothing stored about them anywhere.

**Turn on Interac auto-deposit** for the email in `data/site.js`, or every order comes with a security question to sort out.

### Add or change merch
Open **`tools/merch.html`** in a browser. Add an item, set the price, add sizes with their own stock, then **DOWNLOAD merch.js** and save it over `data/merch.js`. Commit and push.

Items with no sizes (CDs, stickers, posters) just get a single **Stock** number. Items with sizes get one row per size, each with its own count — a size at 0 shows struck through on the site, and an item with nothing left shows **SOLD OUT** but stays visible.

### Product photos
Same page, bottom section: drop the photos for an item, and you get a zip named after the item's ID. Unzip it into `assets/merch/` so the files land in `assets/merch/<id>/01.jpg`. The photo count is set for you.

The first photo is the one shown on the card; the rest become thumbnails underneath it.

### After a sale
Stock is **not** automatic. Once you've sent something, open the merch editor, lower the number, download and commit. If you forget, the site will happily take an order for something you don't have.

### Who to send orders to
`data/site.js` holds the email orders go to, the order-reference prefix, and the currency symbol:

```js
window.SITE = {
  name: "VO!D",
  email: "void.empr@gmail.com",
  orderPrefix: "VOID",
  currency: "$"
};
```

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
│   ├── site.js             ← band email, order prefix, currency
│   ├── shows.js            ← THE show list. Edit this to add shows.
│   ├── merch.js            ← THE store. Edit this to add merch.
│   └── credits.js          ← photo credits, GENERATED by tools/credits.py (don't hand-edit)
├── tools/
│   ├── credits.py          ← run after adding photos: python tools/credits.py
│   ├── shows.html          ← show editor + photo prep (open in a browser; not part of the site)
│   ├── merch.html          ← merch editor + photo prep
│   ├── shrink.ps1          ← resize a folder of photos to web size, keeps credits
│   └── post-maker.html     ← Instagram/Facebook image maker (open in a browser; not part of the site)
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
| `bg-epk-top.jpg` … `bg-epk-contact.jpg` | Optional — behind each EPK section: `top`, `bio`, `media`, `photos`, `logos`, `history`, `contact` |

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
| `qr-site.svg` / `.png` | QR code to the site URL with the logo in the centre. Shown in the EPK header. If the site URL ever changes, ask for it to be regenerated. |

Press-photo captions (size + photographer) and the "Photos: …" line come from each JPEG's metadata. Set the photographer in Windows: right-click the file → Properties → Details → **Authors**. JPEG only — PNG can't carry it. Don't click "Remove Properties and Personal Information" on that tab; it strips the credit.

**After adding or changing photos, bake the credits:**

```bash
python tools/credits.py
```

That rewrites `data/credits.js`, which the pages read (so credits work even when you open the HTML straight from disk or print the PDF). Commit it with the photos.

---

## Setting up GitHub Pages

1. Push this repo to GitHub (must be **public**)
2. Go to the repo → Settings → Pages
3. Source: Deploy from branch → `main` → `/root` → Save
4. Site goes live at `https://sickness-31.github.io/VOID-BAND/` — note the capitals: GitHub Pages uses the repo name exactly as cased on GitHub, and lowercase 404s.

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
