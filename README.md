# FORMA

A responsive furniture brand concept website by [Mustafa](https://github.com/MustafaK-Mahfouth).

Built with semantic HTML, SCSS (BEM naming), and vanilla JavaScript. This is a portfolio project, not an operating furniture store. Product details, testimonials, and brand statistics are illustrative; imagery includes AI-generated visuals.

## Features

- Responsive layouts and mobile navigation
- Inline hero story video
- Furniture categories, brand story, inspiration gallery, and testimonials
- Scroll reveals and smooth anchor navigation with reduced-motion support

## Local development

Requires Node.js 22 and npm.

```sh
npm ci
npm run dev
```

Open index.html using a local static server such as VS Code Live Server. The dev command watches and compiles SCSS; it does not start a web server.

## Production build

```sh
npm run build:site
```

The generated dist directory contains the deployable website. Source files and development dependencies are excluded.

## Netlify

Import this repository on Netlify. The checked-in netlify.toml sets the build command to npm run build:site and the publish directory to dist. No environment variables are required.

## Structure

- index.html: page content
- scss/: styles and responsive rules
- js/script.js: navigation, video, and reveal interactions
- assets/: images and videos
- scripts/build-site.cjs: deployment packaging

See RESPONSIVE.md for breakpoint notes.
