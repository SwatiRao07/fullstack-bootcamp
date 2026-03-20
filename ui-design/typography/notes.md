# Typography Drills Documentation

## Drill 1: System vs Web Fonts
- **System Stacks**: Implemented robust system font stacks for body, headings (initially), and code.
- **Weight Showcase**: Demonstrated weights 400, 600, and 800 in the "System Stacks & Weights" section.

## Drill 2: Google Fonts & Variable Axes
- **Imports**: Successfully imported `Inter`, `Merriweather`, and `Source Code Pro` from Google Fonts with `display=swap`.
- **Variable Axis**: Added a range slider that modifies the `--current-weight` CSS variable, which is applied to a paragraph using the `Inter` variable font. This ensures smooth transitions with zero CLS.

## Drill 3: Local Font with @font-face
- **Local Assets**: Downloaded `Geist-Regular.woff2` and `Geist-Bold.woff2` from Vercel's official repository into `assets/fonts/`.
- **@font-face**: Configured the local font in `style.css` and updated headings to use `Geist` as the primary font with robust fallbacks.

## Drill 4: Hierarchy & Rhythm
- **Type Scale**: Established a mathematical scale for headings `h1-h6`.
- **Drop Cap**: Applied a drop cap effect to the first letter of the article's first paragraph using `::first-letter`.
- **Hero Effects**: Added a subtle `text-shadow` to the hero title, active only on desktop viewports.

## Drill 5: Code Blocks & Emphasis
- **Code Blocks**: Fixed-width code blocks styled with `Source Code Pro`, internal padding, auto-overflow, and surface background.
- **Blockquotes**: Designed with a left accent border and increased font size/line-height for better emphasis.
