# The Entanglement Project Website

A GitHub Pages-ready static website for **The Entanglement Project**.

## Sections

- Home (Three.js hero)
- About
- Articles
- Courses
- YouTube Videos
- Neuroscience Research Updates

## Customize content

### Articles (categories + metadata)
Edit:

- `content/articles/articles.json`

You can:

- add/update/delete categories
- keep `all` category
- add/update/delete article entries

Article body files are markdown files in:

- `content/articles/articles/`

### Courses
Edit:

- `content/courses/courses.json`

### Neuroscience updates
Edit:

- `content/advancements/advancements.json`
- markdown files in `content/advancements/articles/`

### YouTube video cards
Edit:

- `content/videos/videos.json`

When empty (`"videos": []`), the page shows an under-development message.

## Branding assets

- Main logo: `assets/logo.svg`
- Founder photo placeholder: `assets/about-photo.svg` (replace with your actual photo)
- Theme colors: `styles.css` `:root` variables

## Run locally

Use a local HTTP server because the app loads JSON/Markdown with `fetch()`:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.
