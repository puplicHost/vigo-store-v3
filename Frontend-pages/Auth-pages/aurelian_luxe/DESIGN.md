# Design System Specification: Editorial Modernism

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Digital Atelier."** We are moving away from the rigid, boxed-in layouts of traditional e-commerce and toward a high-end editorial experience. The goal is to make the user feel like they are flipping through a luxury boutique’s lookbook rather than navigating a database.

To achieve this, the system prioritizes **intentional asymmetry** and **tonal depth**. We break the "template" look by utilizing generous, "breathed" whitespace and overlapping elements (e.g., a product image slightly bleeding over a background container shift). This creates a sense of human craft and intentionality that standard grids cannot replicate.

---

## 2. Colors & Surface Philosophy
The palette is built on sophisticated neutrals that evoke a sense of permanence and quality, punctuated by a "Gold-Leaf" primary accent to signify luxury and action.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning or containment. Boundaries must be defined solely through background color shifts or subtle tonal transitions.
*   *Implementation:* Use `surface-container-low` for a section background sitting on a `surface` main background.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of fine materials. Depth is achieved through "Tonal Nesting" rather than lines.
*   **Layer 0 (Base):** `surface` (#fcf9f8) – The canvas.
*   **Layer 1 (Sections):** `surface-container-low` (#f6f3f2) – Sub-navigation or secondary content blocks.
*   **Layer 2 (Elevated Content):** `surface-container-lowest` (#ffffff) – Used for primary cards or product highlights to create a "lifted" feel against the warmer background.

### The "Glass & Gradient" Rule
To ensure the UI feels innovative and "aspirational," use **Glassmorphism** for floating elements (like persistent navigation bars or quick-view modals). Use `surface` colors at 80% opacity with a `backdrop-blur` of 20px. 

For CTAs, avoid flat color. Apply a subtle linear gradient from `primary` (#775a19) to `primary-container` (#c5a059) at a 135-degree angle. This adds "visual soul" and a metallic sheen appropriate for a premium brand.

---

### 3. Typography
The typographic pairing is a conversation between heritage and modernity.

*   **The Voice (Serif):** *Noto Serif* is our "Display" and "Headline" typeface. It conveys authority and artisanal quality. Use it for high-level storytelling and product titles.
*   **The Engine (Sans-Serif):** *Manrope* is our "Title," "Body," and "Label" typeface. It is clean, geometric, and highly legible, representing our "Innovative" brand pillar.

**Key Scales:**
- **Display-LG (56px):** Used for Hero statements. Tracking should be set to -2% for a tighter, editorial feel.
- **Body-MD (14px):** Our workhorse. Ensure a generous line-height (1.6) to maintain the minimalist aesthetic.
- **Label-MD (12px):** Always uppercase with +5% letter spacing when used for category tags or "New Arrival" badges.

---

## 4. Elevation & Depth
We eschew traditional "Drop Shadows" for a more sophisticated **Ambient Lighting** model.

*   **Tonal Layering:** The primary method of elevation. A `surface-container-high` card placed on a `surface` background provides enough contrast to signify hierarchy without any shadow at all.
*   **Ambient Shadows:** If a shadow is required for a floating modal, use a "Tinted Blur."
    *   *Values:* Y: 20px, Blur: 40px, Color: `on-surface` (#1c1b1b) at 4% opacity. This mimics natural light diffusion.
*   **The "Ghost Border" Fallback:** If accessibility requirements demand a container edge, use a "Ghost Border": `outline-variant` (#d1c5b4) at 15% opacity. Never use 100% opaque borders.

---

## 5. Components

### Buttons
*   **Primary:** Gradient from `primary` to `primary-container`. Text: `on-primary` (White). Rounding: `md` (12px).
*   **Secondary:** Ghost style. No background. `Ghost Border` (15% opacity `outline-variant`). Text: `on-surface`.
*   **Tertiary:** Text-only with a 1px underline using the `primary` token, offset by 4px.

### Cards & Lists
*   **Forbid Divider Lines:** Use vertical whitespace (1.5rem to 2rem) or a background shift to `surface-container-lowest` to separate items.
*   **Rounding:** All product cards must use `md` (12px) rounding. Featured editorial cards may use `lg` (16px) for added softness.

### Input Fields
*   **Style:** Minimalist. Only a bottom "Ghost Border" that transitions to a 2px `primary` border on focus. 
*   **Label:** Use `label-md` floating above the input, never inside the placeholder area.

### Signature Component: The "Editorial Reveal"
For high-end e-commerce, use a "Detail Chip" component—a semi-transparent glass chip (`surface` at 60% opacity + blur) that sits over product images, housing the `label-sm` price and "Quick Add" action.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical margins. If the left margin is 80px, try a right margin of 120px for editorial sections to create visual interest.
*   **Do** use "Soft Layering." Let an image container overflow its parent section by 40px to break the "web-safe" feel.
*   **Do** prioritize `surface` shifts over lines. If you feel the need for a line, try a 10% darkening of the background color instead.

### Don't
*   **Don't** use pure black (#000) for text. Use `on-surface` (#1c1b1b) to maintain a soft, premium "ink-on-paper" look.
*   **Don't** use standard shadows. If the shadow looks like a "fuzzy edge," it’s too heavy. It should be felt, not seen.
*   **Don't** crowd the interface. If you can't fit it with at least 32px of padding, it likely belongs in a progressive disclosure (like a "View More" drawer).