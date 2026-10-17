# FORMA responsive layout

Responsive overrides are in `scss/pages/_responsive.scss`, imported after `pages/home` in `scss/main.scss`. Existing desktop styles remain in `_home.scss`.

## How the layout changes

| Maximum viewport width | Main changes |
| --- | --- |
| 1440px | Smaller side gutters and navigation spacing |
| 1200px | Compact navigation, typography and card spacing |
| 1100px | Categories change from four columns to two |
| 960px | Hero photograph sits below the copy; benefits use two columns; Story stacks; Inspiration uses a wide photo above two smaller ones |
| 800px | Disclosure navigation and stacked reviews |
| 600px | Phone spacing, stacked Inspiration images and footer columns |
| 480px | Categories use one column |
| 360px | Full-width primary hero button |

The navbar background remains transparent. Only the expanded menu panel has a cream background. The full desktop navigation remains available down to 801px.

The mobile menu script is appended to `js/script.js`. It supports Escape, outside clicks, selecting a link, keyboard navigation, and resetting its state on resize. Navigation remains visible if JavaScript does not run.

Watch Story still plays inside the header. On narrow screens the video uses `object-fit: contain` to show the complete frame, with an espresso background and light navigation text. Closing or finishing playback restores the hero content.

## Validation

- Sass build completed; existing `@import` deprecation notices remain.
- `node --check js/script.js` passed.
- Browser viewport checks at 320, 360, 390, 480, 600, 768, 800, 801, 820, 950, 1024, 1200, 1440, and 1920px, plus 844x390 landscape: no horizontal page overflow, overlapping desktop navigation, or broken internal anchors.
- Visually inspected mobile hero, category cards, Story, Inspiration, footer, tablet hero and desktop hero.
- Tested mobile menu open/close, Escape focus restoration, Tab navigation, outside clicks, link selection, and resize reset.
- Tested inline video playback and automatic return to hero on mobile; navbar remains transparent.
- No browser console errors observed.

Checks used browser viewport emulation, not physical devices or a cross-browser device lab.
