# Trollip Legacy Builders — Version 3 Multipage

This is a **multi-page static HTML site**. Keep the entire folder together. The pages depend on `styles.css` and the files in `assets/`.

## Important: preview correctly

**Do not download/open `index.html` by itself.** If you do, the CSS and images will not be beside the file and the browser will show unstyled HTML with broken images — exactly what happens when a single HTML file is opened from Downloads.

### Easiest option on Windows

Double-click:

`start-preview.bat`

Then open:

`http://localhost:5500/`

### CLI option

```bash
cd trollip-legacy-builders-multipage
python -m http.server 5500
```

Then visit `http://localhost:5500/`.

## Pages

- `index.html` — Home
- `about.html` — About
- `services.html` — Services
- `programmes.html` — Programmes
- `digital.html` — Digital Services
- `stories.html` — Stories
- `contact.html` — Contact
- `styles.css` — Shared design system
- `assets/` — Images and video

All internal navigation is relative to this folder, so the complete folder must remain intact when moved into a CLI project.
