# Visual Media Drill Notes

## Drill 1: Icon Implementation Options

**Webfont Icons (Material Symbols)**
- *Pros:* Extremely easy to include into a project, behave exactly like text allowing rapid modification of `font-size` and `color`, massive directory of options loaded simultaneously.
- *Cons:* Huge payloads mean a noticeable performance and loading impact (sometimes fetching thousands of icons when only 3 are used). Can trigger FOIT (Flash of Invisible Text) where the remote font takes too long to load.

**Inline SVGs (e.g., Heroicons)**
- *Pros:* Zero extra HTTP requests which makes loading blisteringly fast. Incredible control using CSS properties like `fill` or `stroke`, crisp vector scaling, and impossible to FOIT. 
- *Cons:* Pollutes the HTML markup with hard-to-read `<svg>` and `<path>` syntax. Requires an abstraction layer (like React components) in heavy use.

*Observation:* 
Inline SVGs with `currentColor` applied via CSS provide the most bulletproof and performant experience possible, explicitly resolving rendering flashes and size issues observed with webfonts. 

## Drill 2: Image Formats & Optimization

Using an optimization tool like Squoosh (https://squoosh.app/) on the main hero JPG:
- **Original (`1200x800` standard JPG):** ~125KB
- **Optimized (`1200x800` WebP at 75% quality):** ~45KB
- *Size Reduction:* ~64%

**Observations:**
- **JPG/WebP** is the definitive format for high-color continuous-tone photography (like the puppy portrait). WebP routinely achieves identical visual quality at a fraction of the size.
- **PNG** is selected only when partial transparency (alpha channels) is strictly required; for example, UI overlapping or complex graphics.
- **SVG** should exclusively be used for scalable logos and mathematical vectors. These files render perfectly sharp on ANY display size using extremely small sub-kilobyte file footprints.

## Drill 3: Responsive Images `<picture>`

Using the `<picture>` element forces the browser to evaluate the `srcset` mathematically before downloading:
1. Prioritizes the ultra-light `WebP` version for modern browsers. 
2. A larger version (`1600w`) serves crisp 4k/retina displays, while a smaller mobile constraint (`800w`) dramatically cuts download times using the `sizes="100vw"` logic.
3. Provides a standard `<img>` JPG tag as an unbreakable fallback for outdated machines.

*DevTools Verification:*
When testing with DevTools Network tab simulated under a "Fast 3G" connection and dragging viewport width to below 800px, the browser engine explicitly requests ONLY the `800w` dimension image. Also, `loading="lazy"` accurately prevented off-screen images from downloading until they entered the viewport boundary.
