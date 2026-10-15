# Olm Lab website

The website of the Olm Lab, Department of Integrative Physiology, University of Colorado Boulder.
It is a plain static site: HTML, CSS, a little JavaScript and images, with no build step, no
server code, no forms and no logins. GitHub Pages serves the files exactly as they are here.

## What's where

| Path | What it is |
|---|---|
| `index.html` | Home |
| `research.html`, `publications.html`, `code.html`, `funding.html`, `join.html` | The other main pages |
| `people/index.html` | People |
| `people/<name>.html` | One page per person |
| `assets/img/` | Images: `banners/` (seasonal page banners), `photos/` (Home slideshow), `people/` (portraits), `funders/`, `logo/`, `brand/` (CU logos) |
| `assets/css/site.css` | The Figtree font and a few shared rules. Each page's own styles are in a `<style>` block in its `<head>` |
| `assets/fonts/` | Figtree, served from this site rather than Google Fonts (SIL Open Font License, see `OFL.txt`) |
| `assets/js/dc-lite.js` | Small runtime that drives the logo animation, the pause buttons, the Home slideshow and the seasonal banners |
| `assets/js/pages/` | The behavior of each page, read by `dc-lite.js` |

## Editing

- **Text and links:** open the page's `.html` file on GitHub, click the pencil icon, edit, and commit.
  The live site updates within a minute or two.
- **Images:** upload a replacement with the same file name into the same folder under `assets/img/`.
  Strip location data from phone photos before uploading.
- The pages were exported from the lab's design canvas. If the canvas is updated and the site is
  exported again, the export replaces these files, so let whoever runs the export know about any
  edits made directly here.

## Security notes

- Every page has a Content-Security-Policy tag that only allows files from this site. A script,
  font, image or embed loaded from another website will be blocked; add the file to this repository
  instead.
- While the site is in staging, every page has `<meta name="robots" content="noindex">` so search
  engines don't list it. Remove that line from every page at launch.
- Write access to this repository is limited to the site maintainers, and every account with write
  access should have two-factor authentication turned on.
