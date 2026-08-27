# 911 PLUMBING SERVICE 4 Less

Single-page marketing website for **911 PLUMBING SERVICE 4 Less** — a 24/7 emergency
plumbing company offering flat-rate, upfront pricing.

## Stack

Vanilla HTML, CSS and JavaScript. No build step, no dependencies, no external APIs.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Entire single-page site (semantic HTML, meta tags, JSON-LD `Plumber` schema) |
| `styles.css` | Design system, layout, responsive rules, print styles |
| `script.js` | Mobile nav, scroll reveals, smooth anchors, phone formatting, form validation |
| `favicon.svg` | Favicon |

## Sections

Hero with call-to-action · trust stats · six-card services overview · why-choose-us ·
four-step process · testimonials · call-now CTA band · contact details and quote form · footer.

## Running locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

Then visit <http://localhost:8000>.

## Notes

- Photography is sourced from Pexels and matched to each section's subject.
- The quote form validates entirely client-side and displays a confirmation message;
  wire it to a backend or form service to deliver submissions.
- Responsive down to 320px, with a persistent "Call Now" bar on mobile.
