# Kai-Shiang (Tomy) Fan — Personal Website

Source for [tomy-ksfan.github.io](https://tomy-ksfan.github.io/), a responsive academic portfolio hosted with GitHub Pages.

## Structure

- `index.html` — page content and metadata
- `styles.css` — minimal responsive layout
- `files/` — optimized portrait and social sharing image
- `notes/linear-regression/` — introductory note and its example figures

## Local preview

Run a static web server from the repository root and open the provided local URL in a browser.

```sh
python3 -m http.server 4173
```

The site is intentionally framework- and JavaScript-free and deploys directly from the `main` branch.

## Adding a note

Use `notes/linear-regression/index.html` as a starting point. Each note has a stable directory URL, its own title and description, and shares `styles.css`. Add a short entry to the homepage Notes section and the article URL to `sitemap.xml`.

Equations use native MathML with the original LaTeX expressions kept in `annotation` elements. This keeps formulas selectable and avoids a client-side rendering dependency. LaTeX notes can serve as source material; edit them into a short introduction and worked example before publishing. The linear regression article adapts the basic-model and least-squares sections of STAT 7410 notes; the full course notes are not part of this repository.

The regression figure uses the five illustrative observations in the article. Its fitted line is `score = 45.1 + 6.3 * hours`, with residual sum of squares `9.1`. The two SVG sizes keep axis labels readable on narrow screens.

## Design notes

The layout uses the original white, charcoal, and teal palette with text columns capped at 48ch. Copy and spacing refinements were guided by [unslop](https://github.com/heydamir/unslop), created by Damir Sokolovsky ([@heydamir](https://x.com/heydamir)), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
