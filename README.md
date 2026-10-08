# Andres Bodington — Personal Portfolio

A single-page portfolio for Andres Bodington: backend and AI engineer, Computer
Science senior at Lewis University, NCAA Division II swimmer.

**Author:** Andres Bodington

---

## Running it

No build step, no dependencies, no server-side code. Two options:

**Open the file.** Double-click `index.html`. Everything works except the resume
availability check, which needs HTTP.

**Serve it locally** (recommended — matches production):

```
cd 2026-09-20-andres-bodington-portfolio
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploying it

Upload the contents of this folder to any static host — Hostinger `public_html`,
GitHub Pages, Netlify, Cloudflare Pages. Nothing needs to be compiled.

The included `.htaccess` sets cache headers and MIME types for Apache and
LiteSpeed hosts (Hostinger's default). It is ignored by Nginx and by GitHub
Pages, harmlessly.

After any edit, bump the `?v=` query string on `styles.css` and `main.js` in
`index.html` so browsers fetch the new files instead of a cached copy.

## Files

```
index.html          the portfolio — all content lives here
coursework.html     SWE assignment index (not linked from the portfolio)
styles.css          all styling, sectioned by concern
main.js             behavior for both pages, IIFE, no dependencies
lib/manifest.js     portfolio content data + contact links (window.__BRAND__)
lib/coursework.js   assignment entries (window.__COURSEWORK__)
assets/img/         og-card.png (social share preview)
assets/docs/        andres-bodington-resume.pdf
.htaccess           Apache/LiteSpeed cache + MIME headers
```

## What to fill in

One placeholder remains. It is marked `data-todo` in the HTML.

1. **AquaAnalytics repo link** — replace `Repo link — to add.` in the `#work`
   section with an anchor to the repository (and a live demo if there is one).

Two things to confirm rather than fill:

- **GPA.** The page shows 3.97. Your resume states 4.0/4.0 at Lewis and 3.96 at
  Mars Hill. If 3.97 is the combined figure, label it that way in the stats bar;
  if the Lewis figure is what you want shown, change it.
- **Location.** The page says open to relocation anywhere in the US. Your resume
  says Chicago-area, open to Chicago or New York. Pick one and make both match.

To add a technology to the stack bar, add an `<li>` to `.stack-list` in
`index.html` (and, for consistency, to `stack` in `lib/manifest.js`).

## The coursework page

`coursework.html` is a separate page for Software Engineering assignments whose
live builds are hosted on Azure. It is linked from the portfolio's top navigation
and from the footer (the nav is hidden below 960px, so the footer link is what
phone visitors use).

It still carries `<meta name="robots" content="noindex, nofollow">`, so search
engines skip it even though it is linked. Remove that tag if you want it
indexed.

To add an assignment, open `lib/coursework.js` and copy one block into `items`,
newest first:

```js
{
	label:   'Sprint 3',
	title:   'Inventory service REST endpoints',
	date:    'October 2026',
	summary: 'One or two sentences on what it does.',
	live:    'https://your-app.azurewebsites.net',
	repo:    'https://github.com/aebodi/your-repo',
	stack:   ['Java', 'Spring Boot']
},
```

Every field except `title` is optional. Leave `live` or `repo` as an empty
string and that button simply does not render — the page never shows a dead
link. With no entries at all, the page shows a labeled empty state.

Note: assignment entries render from the data file via JavaScript, so this one
page needs JS to list them. The portfolio page does not.

## Technical notes

- Vanilla HTML, CSS and JavaScript. No framework, no bundler, no `node_modules`.
- `main.js` is a classic script wrapped in an IIFE; every initializer runs inside
  a `safe()` try/catch, so one failure cannot blank the page.
- All content is hardcoded in `index.html`. JavaScript only enriches it — with
  JavaScript disabled, every section, link and contact detail still renders.
- Scroll reveals use an `IntersectionObserver` at a 0.01 threshold plus a
  six-second safety net, so nothing can stay invisible.
- Micro-interactions are not gated behind `prefers-reduced-motion`; only the
  looping background drift and the pulsing availability dot are, since Windows
  ships reduced-motion enabled in many configurations.
- Fonts load from Google Fonts: Instrument Serif, Inter, JetBrains Mono.

## Credits

- **Content** — Andres Bodington. Every fact, project and milestone on the page
  was supplied by him. Nothing was invented.
- **Fonts** — Instrument Serif, Inter and JetBrains Mono, served by Google Fonts
  under the SIL Open Font License.
- No third-party JavaScript libraries, images or templates are used.

## License

MIT. See `LICENSE`.
