# Typographic Redesign Rationale

## Architectural Choices

### 1. Font Pairing & Contrast
- **Headings & Body**: Used **Source Serif 4**. A variable serif font that provides exceptional readability for long-form content. Its optical size (opsz) axis ensures it looks sharp at both 14pt and 48pt.
- **UI & Subheadings**: Used **Inter**. A clean, high-x-height sans-serif that creates a strong modern contrast against the serif body.
- **Code**: Used **Source Code Pro** for its crisp monospace clarity, paired with a custom wrapper to mimic a development environment.

### 2. Vertical Rhythm & Spacing
- **Baseline Logic**: Established a `--baseline` of `1.6` for optimal reading flow. 
- **Rhythm Variable**: All block-level elements (`p`, `h2`, `blockquote`, `pre`) utilize a consistent `--rhythm` margin-bottom of `1.5rem` to create a predictable vertical cadence.
- **Line Length**: Capped the `.prose` container at `740px`. This maintains an ideal character count (65–75 per line), preventing eye fatigue.

### 3. Typographic Hierarchy
- **Fluid Type Scale**: Used `clamp()` to transition from mobile to desktop sizes seamlessly. The scale follows a **Major Third (1.25)** modular ratio as it grows.
- **Micro-Copy**: Metadata and tags are set in uppercase with a `0.1em` letter-spacing to distinguish them from reading content without requiring bold weights.
- **Emphasis**:
    - **Drop Cap**: A large, bold serif letter initiates the story, grounding the reader.
    - **Leads (Ledes)**: The introduction paragraph uses a larger size (`--fs-lede`) and lighter color to ease the transition from the title to the body.
    - **Pull Quotes**: Indented with a bold border and italicized serif to break up long sections of text.

### 4. Visibility & Polish
- **Webkit Smoothing**: Enabled `-webkit-font-smoothing: antialiased` for cleaner rendering of thin weights on Retina displays.
- **Text Underlining**: Used `text-underline-offset: 4px` to prevent the underline from cutting through descenders (like 'g' or 'y'), which is a common typographic friction point.
