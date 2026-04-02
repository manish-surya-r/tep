# The Entanglement Project Website

A static, GitHub Pages-ready site inspired by a clean research-foundation style layout.

## Sections

- Home
- About
- Articles
- Courses
- Resources
- Videos
- Neuroscience Research Updates

## Content model (easy to customize)

- Articles metadata: `content/articles/articles.json`
- Article markdown files: `content/articles/articles/*.md`
- Courses: `content/courses/courses.json`
- Resources: `content/resources/resources.json`
- Videos: `content/videos/videos.json`
- Neuroscience updates: `content/advancements/advancements.json`

## Notes

- Each section uses a light background and changes tone on hover.
- Article cards open in a separate tab (`article.html`) where visitors can switch between all articles.
- Replace `assets/about-photo.svg` with your real portrait file when ready.

## Run locally

```bash
python -m http.server 8000
```

Open: `http://localhost:8000`
