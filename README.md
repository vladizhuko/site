# vladizhuko.com — new portfolio site

A plain HTML/CSS/JS static site (no framework, no build step) replacing the
Squarespace site. Minimalist, black-and-white, video-first. Zero hosting cost
on GitHub Pages, replacing the ~$200+/yr Squarespace bill.

## What's here

```
site/
  index.html              Homepage: text-free wall of every video (27 tiles)
  profile.html            Bio, "View my resume" link, highlights, skills
  resume.pdf              Linked from the Profile page — replace anytime
  css/style.css
  js/main.js              Click-to-embed video player logic + nav indicator
  CNAME                   Custom domain config for GitHub Pages
```

Two pages total: Work (home) and Profile.

## 0. Keeping your resume current

`profile.html` links out to `resume.pdf` sitting right next to it in the
site folder — I built a starter version from the same experience/highlights/
skills content that used to be listed on the page. Whenever your resume
changes, just overwrite `resume.pdf` with your latest file (same filename)
and push — the link on the page never needs to change.

## 1. Pick a video host, then wire up the videos

Right now every one of the 27 video tiles on the homepage is a placeholder
(gray tile + play icon, no video attached) — nothing embeds until you fill
in one attribute per card. This was intentional since you hadn't picked a
replacement for Vimeo yet. Once you decide, open `index.html` and fill in
`data-video-id` on each `<div class="video-card">`:

**Option A — YouTube (free)**
Upload each video as *unlisted*, grab the ID from the URL
(`youtube.com/watch?v=`**`VIDEO_ID`**), then:
```html
<div class="video-card" data-provider="youtube" data-video-id="VIDEO_ID" ...>
```

**Option B — Cloudflare Stream (~$5/1000 min stored, clean player, no ads/suggestions)**
Upload via the Cloudflare dashboard or API, grab the video UID, then:
```html
<div class="video-card" data-provider="cloudflare" data-video-id="VIDEO_UID" ...>
```

**Option C — Self-hosted file**
Drop a compressed `.mp4` into `assets/video/` and point straight at it:
```html
<div class="video-card" data-provider="file" data-video-id="assets/video/clip.mp4" ...>
```

Each card already has a `data-title` for accessibility (screen readers /
hover tooltips) even though nothing shows on screen — that's how you'll
tell the 27 placeholders apart while wiring them up. Clicking a card swaps
the placeholder for a real embedded player — see `js/main.js` for the
(short, readable) logic if you want to tweak it.

## 2. Deploy to GitHub Pages (free, keeps your domain)

1. Create a new GitHub repo (e.g. `vladizhuko-site`), and push the **contents
   of this `site/` folder** to its root (not the folder itself — the repo
   root should contain `index.html` directly).
   ```
   cd site
   git init
   git add .
   git commit -m "Initial portfolio site"
   git branch -M main
   git remote add origin https://github.com/<you>/vladizhuko-site.git
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages** → Source: `Deploy from a branch` →
   Branch: `main` / root. Save.
3. **Settings → Pages → Custom domain**: enter `www.vladizhuko.com` (the
   `CNAME` file in this repo already has that value, which is what GitHub
   Pages needs). Check "Enforce HTTPS" once the cert is issued (can take
   up to ~24h).
4. At your domain registrar (wherever `vladizhuko.com` is registered —
   check there since you'll be moving DNS off Squarespace):
   - Add a `CNAME` record: `www` → `<you>.github.io`
   - For the bare `vladizhuko.com` (no www) to also work, add these four
     `A` records at the apex/root:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
5. Cancel the Squarespace subscription once DNS has propagated and the
   new site is confirmed live (give it 24–48h before canceling, in case
   DNS changes need to roll back).

## 3. Also cancel

- Vimeo subscription, once your videos are re-uploaded to whichever host
  you pick in step 1.

## Notes on the design

"Swiss neutral": pure white background, black text, hairline 1px grid
lines between every tile (a classic Swiss/International Typographic Style
grid), bold tight sans-serif type, uppercase nav with tracked letter-spacing.
No external font/JS dependencies except the (optional) video embeds
themselves — so it loads fast and won't break if a CDN goes down.

Homepage (`index.html`) is the text-free video wall — 4 columns down to 2
on mobile, click any tile to play it inline, no captions. Profile is a
lightweight on-page CV (experience, highlights, skills) without calling
itself a resume. Feel free to ask for a different theme, grid density, or
accent color — all of that lives in `css/style.css` under the `:root`
variables at the top.
