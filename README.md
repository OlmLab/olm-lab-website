# Olm Lab website

This repository holds the website of the Olm Lab in the Department of Integrative Physiology at the
University of Colorado Boulder. It's a static site made of HTML, CSS, JavaScript and images, which
GitHub Pages serves exactly as they are here. Nothing runs on a server, and the site has no forms
or logins.

## Where things are

The main pages sit at the top level. `index.html` is Home, and `research.html`, `publications.html`,
`code.html`, `funding.html` and `join.html` are the rest. The People page is `people/index.html`, and
each person's page sits next to it, for example `people/matthew-olm.html`.

Everything else is in `assets/`:

- `assets/img/` holds the images in six folders: `banners/` for the seasonal page banners, `photos/`
  for the Home slideshow, `people/` for portraits, `funders/`, `logo/`, and `brand/` for the CU logos.
- `assets/css/site.css` loads the Figtree font and has a few shared rules. Each page keeps its own
  styles in a `<style>` block in its `<head>`.
- `assets/fonts/` has the Figtree font files, which the site serves itself instead of loading them
  from Google Fonts. Figtree is under the SIL Open Font License (see `OFL.txt`).
- `assets/js/dc-lite.js` runs the logo animation, the pause buttons, the Home slideshow and the
  seasonal banners.
- `assets/js/pages/` has the script for each page that `dc-lite.js` runs. The six person pages share
  `person.js`.

## Editing

To change text or a link, open the page's `.html` file on GitHub, click the pencil icon, make the
edit and commit it. The live site updates within a minute or two.

To replace an image, upload the new one to the same folder under `assets/img/` with the same file
name. Remove the location data from phone photos before you upload them.

We built these pages in a design canvas and exported them to this repository. Each new export
overwrites the files here, so if you edit a page directly on GitHub, tell the person who runs the
export.

## Security notes

Every page has a Content-Security-Policy tag, so browsers load files only from this site and block
any script, font, image or embed hosted somewhere else. If a page needs one of those, add the file to
this repository.

While the site is in staging, every page has `<meta name="robots" content="noindex">` so search
engines leave it out of their results. Delete that line from every page at launch.

Only the site maintainers have write access to this repository, and each of them should have
two-factor authentication turned on.
