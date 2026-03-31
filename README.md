# The Entanglement Project Website

A GitHub Pages-ready static website for **The Entanglement Project**.

## Sections

- Home (with Three.js hero animation)
- About
- Newsletter (category + markdown driven)
- Courses (JSON driven)
- Recent advancements in neuroscience (markdown driven)

## Customize content

### 1) Newsletter categories and article metadata
Edit:

- `content/newsletter/newsletter.json`

You can add/update/delete:

- category names
- category IDs
- article entries and linked markdown files

### 2) Newsletter article bodies
Add/update/delete markdown files in:

- `content/newsletter/articles/`

### 3) Courses
Edit:

- `content/courses/courses.json`

Each course has:

- `title`
- `description`
- `duration`
- `image`

### 4) Neuroscience advancements
Edit:

- `content/advancements/advancements.json`
- markdown files in `content/advancements/articles/`

## Branding

- Main logo path: `assets/logo.svg`
- Color theme variables: `styles.css` under `:root`

> If you want to use your exact official logo file, replace `assets/logo.svg` with your own logo asset and update the path in `index.html` if needed.

## Run locally

Because this site uses `fetch()` for JSON and markdown, use a local HTTP server (not file://):

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Deploy on GitHub Pages

### Option A: Deploy from main branch (root)

1. Push repository to GitHub.
2. In GitHub repo settings, open **Pages**.
3. Set **Source** to `Deploy from a branch`.
4. Choose branch `main` and folder `/ (root)`.

### Option B: GitHub Actions

You can also deploy with a GitHub Pages action workflow if you prefer CI-based publishing.
