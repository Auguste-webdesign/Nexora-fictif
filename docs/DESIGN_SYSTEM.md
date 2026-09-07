# NEXORA — Creative Direction & Design System

**Status:** Draft for approval — no code written yet
**Date:** 2026-08-26
**Scope:** Marketing site, single-page scroll experience

---

## 1. Brand Identity

**Name:** Nexora
**Category:** Curated premium tech retailer — a multi-brand storefront, not a manufacturer.
**Flagship centerpiece:** the **iPhone 18**, a real third-party product Nexora carries and is launching around. Nexora's own catalog spans phones, earbuds, headphones, monitors, mechanical keyboards, and other premium accessories from multiple brands.
**Personality:** Cold precision — surgical, engineered, clinical. The reference points are Teenage Engineering (technical honesty, mono labels, exposed structure) and Apple (restraint, negative space, confidence in silence).

**Core principle:** The product is the hero. The interface is scaffolding. Every element that isn't the phone must justify its existence or be removed.

**Tone of voice:** Declarative, compressed, never explanatory. No marketing adjectives ("amazing", "revolutionary"). No exclamation marks. Sentences end in periods, including fragments — the period is part of the aesthetic.

**Storytelling arc — reframed as retailer, not manufacturer:** The site is a *teardown*, but the argument is different from an OEM's: Nexora doesn't build the iPhone 18 — it shows you everything about it before you buy, with a transparency other retailers don't bother with. The narrative is: *curation as trust*. What other stores hide behind a product photo, Nexora exposes down to the last component. The hero scrub is the proof of that scrutiny; the catalog beneath it is the proof Nexora applies the same eye to everything it sells.

**Nominative use note:** because Nexora is a retailer (not a competing device maker), naming and depicting the iPhone 18 by its real name is standard retail practice (nominative fair use) — materially different from a competing brand naming its own hardware "iPhone." No further action needed here, but avoid implying Nexora manufactures the device anywhere in copy.

---

## 2. Color

Pure monochrome base, single accent.

| Token | Value | Use |
|---|---|---|
| `--nx-white` | `#FFFFFF` | Page background. Non-negotiable, site-wide. |
| `--nx-black` | `#000000` | Headlines, primary text |
| `--nx-gray-900` | `#0A0A0A` | Near-black for large type masses |
| `--nx-gray-600` | `#6B6B6B` | Body copy, secondary text |
| `--nx-gray-400` | `#A3A3A3` | Mono labels, eyebrows |
| `--nx-gray-200` | `#E5E5E5` | Hairlines, dividers, borders |
| `--nx-gray-100` | `#F5F5F5` | Subtle section fills (use sparingly) |
| `--nx-blue` | `#0A84FF` → refine toward metallic | **Accent.** See below. |

**Accent — "metallic electric blue":** A flat hex reads as generic iOS blue. To get *metallic*, the accent is defined as a **gradient token**, not a single color:

```
--nx-blue-core:   #0A84FF   /* electric core */
--nx-blue-deep:   #0047B3   /* shadow end */
--nx-blue-light:  #7FC4FF   /* specular highlight */
--nx-blue-metal:  linear-gradient(135deg, #0047B3 0%, #0A84FF 45%, #7FC4FF 70%, #0A84FF 100%)
```

Solid `--nx-blue-core` for small elements (dots, underlines, focus rings). The `--nx-blue-metal` gradient for buttons and any surface large enough to show the sheen. On hover, the gradient's angle/position shifts — that motion is what sells "metallic."

**Accent budget:** Maximum **three** blue elements visible in any single viewport. The accent appears on: the primary CTA, the scroll progress indicator, active nav state, and status/live indicators. Nowhere else.

**Open question:** the exact blue. `#0A84FF` is a safe starting point but is recognizably Apple's system blue. I'd suggest pushing colder/deeper — e.g. `#0B5FFF` or `#1E5AFF` — to avoid the association. Flagged for review.

---

## 3. Typography

**Pairing:** Display grotesk + technical monospace.

**A third face carries the logotype.** Inter and JetBrains Mono carry the interface; a wordmark set in either reads as a label rather than a mark. **Space Grotesk** (700, uppercase, `0.16em`, ~20px) sets "Nexora" in the navbar and footer — a technical grotesk with distinctive letterforms, engineered rather than decorative. It is used for the logotype and nothing else.

| Role | Typeface | Treatment |
|---|---|---|
| Display / headlines | **Neue Haas Grotesk Display** — fallbacks: Inter Display, Helvetica Now, Archivo | Tight tracking (`-0.03em` to `-0.04em`) at large sizes, weight 500–600. Never bold-heavy. |
| Body | Same grotesk, text optical size | Weight 400, tracking `0`, generous line-height (1.6) |
| Mono — eyebrows, labels, specs, data | **JetBrains Mono** — alternates: Berkeley Mono (paid, best fit), IBM Plex Mono, Geist Mono | Uppercase, tracking `+0.12em`, size 11–13px, color `--nx-gray-400` |

**Free/self-hostable stack (recommended for v1):** Inter Display (or Inter with `opsz`) + JetBrains Mono. Both self-hosted as WOFF2, subset to Latin. Neue Haas / Berkeley Mono are licensed upgrades to swap in later without changing layout.

**Type scale** (fluid, `clamp()`-based):

| Token | Min → Max | Role |
|---|---|---|
| `display-xl` | 56px → 140px | Hero brand statement |
| `display-l` | 40px → 88px | Section headlines |
| `display-m` | 28px → 48px | Sub-headlines |
| `body-l` | 17px → 20px | Lead paragraphs |
| `body-m` | 15px → 16px | Standard copy |
| `mono-label` | 11px → 13px | Eyebrows, specs, UI data |

**The mono is the brand signature.** Every section is introduced by a mono eyebrow with an index number — `01 / TEARDOWN`, `02 / MATERIALS`. This numbering runs through the whole page and is what makes it read as *engineered* rather than merely minimal.

---

## 4. Hero — Composition & Scroll Mechanic

### 4.1 Layout

**Full-bleed centerpiece.** The disassembly fills the entire viewport, edge to edge. Typography is layered *over* the footage, but confined to the **left and right margins** — the central corridor (roughly the middle 50% of the viewport width) stays permanently clear so the phone is never occluded.

```
┌──────────────────────────────────────────────┐
│ ◦ NEXORA                              ≡      │  micro-nav (see §5)
│                                              │
│                    ┌────┐                    │
│  Pure              │    │              01    │  ← side taglines
│  engineering.      │ 📱 │              ────  │     (mono + grotesk)
│                    │    │                    │
│                    └────┘                    │
│                                              │
│  ─────────────────  ▓░░░░░░░  ──────────────│  scroll progress (blue)
└──────────────────────────────────────────────┘
```

- Side text columns: fixed width, ~clamp(180px, 18vw, 300px), anchored with generous margin from the viewport edge (`clamp(24px, 5vw, 80px)`).
- Text alternates sides across checkpoints — never both sides occupied simultaneously, except at the final CTA beat.
- A thin scroll-progress rule sits at the bottom of the viewport, filling in `--nx-blue-core` as the scrub advances. This is the user's only affordance that scroll = control.

### 4.2 Scroll mechanic — pinned scrub

The hero is a **pinned scroll-scrubbed section**:

1. Hero pins at viewport top when it reaches full view.
2. Scroll delta maps linearly to disassembly progress, `0 → 1`.
3. **Scrub distance: `400vh`** of scroll for the 8-second sequence. This is the single most important tuning number — too short and it feels twitchy, too long and it feels like the page is broken. 400vh gives roughly 3–4 comfortable scroll gestures. To be tuned live.
4. At progress `1.0`, the section unpins and the page resumes normal scrolling.
5. Scrubbing is **bidirectional** — scrolling up reassembles the phone. This is free with a scrub implementation and is a genuinely delightful detail.
6. Progress is **damped/lerped** (~0.08–0.12 easing factor toward the target) so the animation glides rather than snapping frame-to-frame with the scroll wheel's discrete steps.

### 4.3 Text sequencing

Two-beat structure, extended with mid-scrub conceptual beats. All taglines are **2–4 words maximum**, sentence case, terminal period.

| Progress | Side | Content | Type |
|---|---|---|---|
| `0.00 – 0.10` | Centered | **NEXORA** wordmark + mono sub-line | Brand title card, fades out as scrub begins |
| `0.15 – 0.32` | Left | *Pure engineering.* | `display-m` grotesk |
| `0.38 – 0.55` | Right | *Nothing hidden.* | `display-m` grotesk |
| `0.60 – 0.78` | Left | *Boundless potential.* | `display-m` grotesk |
| `0.85 – 1.00` | Centered | Final statement + **primary CTA** | `display-l` + blue metallic button |

Between beats there is **deliberate silence** — stretches where no text is on screen and the disassembly carries the moment alone. That silence is a design feature, not a gap to fill.

**Tagline copy — draft pool** (to be selected/replaced). These stay conceptual, never naming specific hardware — the chip and technical advances get their own dedicated beat in §7.1 (`02 Chip / Performance`), deliberately kept out of the hero so the scrub stays about the visual experience, not spec-reading:
`Pure engineering.` · `Nothing hidden.` · `Boundless potential.` · `Beyond the surface.` · `Engineered to the atom.` · `Redefining the impossible.` · `Precision, exposed.`

**Transition style:** Each tagline enters with a short upward translate (12–16px) + opacity fade, ~500ms, on a soft ease-out. Exits are faster (~300ms) and fade only, no movement — arrivals are deliberate, departures are unobtrusive. Optionally the mono checkpoint index (`01`, `02`, `03`) uses the letter-swap effect from §5.

---

## 5. Navigation

**Dynamic two-state navbar.**

**State A — micro-nav (during hero scrub):**
- Extremely discreet. A small Nexora mark at top-left, a single menu affordance at top-right.
- Height ~48px, no background fill, no border, no blur. Just two marks floating on white.
- Nav links are hidden entirely. Nothing competes with the teardown.

**State B — full nav (after hero unpins):**
- Expands gracefully: the container width/height animates, a hairline bottom border (`--nx-gray-200`) fades in, and the nav links stagger in left-to-right.
- Full link set: Chip, Vision, Acquire (anchors to homepage sections) + **Catalog** (routes to `/catalog`) + primary CTA. On the catalog page itself, nav loads directly in State B (no scrub to wait for).
- Sticky thereafter, with `backdrop-filter: blur(20px)` over a `rgba(255,255,255,0.72)` fill so content passing beneath stays legible.

**Transition:** ~600ms, `cubic-bezier(0.22, 1, 0.36, 1)`. Triggered on hero unpin, reversible on scroll back up.

**Nav link hover — RandomLetterSwap.** Per your spec, nav links use the random-letter-swap hover effect: on hover, letters scramble/swap in a staggered cascade and settle back into the correct word.

```
staggerDuration: 0.025
transition: { duration: 0.6, type: "spring" }
```

⚠️ **Gap to resolve:** the prompt you supplied provides the *usage* file (`m-random-letter-swap-1.tsx`) but **not the source of the `RandomLetterSwap` component itself** (`@/components/ui/random-letter-swap`). I'll need to either (a) pull it from the source library it came from, or (b) implement it from the API surface — which is fully inferable from the usage: props `label`, `className`, `staggerDuration`, `transition`, with two stacked copies of the label translating vertically per-character on a stagger. **I recommend (b)** — it's ~40 lines, avoids an unverified dependency, and lets us match Nexora's mono type exactly. Needs your confirmation.

**Fit check:** a letter-scramble effect is playful, and Nexora is clinical. It works *if* it's applied to mono-set uppercase links with tight timing — it then reads as a system readout re-resolving, not as a toy. Recommendation: **use mono uppercase for nav links** specifically to make this effect land on-brand.

---

## 6. Tech Background Element

A subtle particle/constellation field — points drifting slowly, connected by lines when near, repelling gently from the cursor.

**Adaptation to Nexora — mandatory changes from the supplied prompt:**

| Supplied | Nexora |
|---|---|
| `ctx.fillStyle = 'black'` background fill | **Removed entirely.** Canvas stays transparent, page white shows through. Use `ctx.clearRect()` instead. |
| Purple particles `rgba(191,128,255,0.8)` | `rgba(10,132,255,0.28)` — electric blue, heavily reduced opacity |
| White/purple connection lines | `rgba(10,132,255,0.10)` — barely-there hairlines |
| Hero content (Aether Flow headline, badge, button) | **Discarded.** We take only the canvas layer. |

**Placement rules (strict):**
- ❌ **Never rendered during the hero disassembly.** That section stays absolutely clean — white, phone, type, nothing else.
- ✅ Available as a background layer for post-hero sections, mounted only when such a section enters the viewport.
- Sits at `z-index: 0`, behind all content, `pointer-events: none`.
- Opacity ceiling: it must be legible as *texture*, never as *decoration*. If you can describe it as "the particle thing," it's too strong.

**Performance notes (the supplied code needs fixing):**
- `connect()` is O(n²) over all particles every frame — at typical viewport sizes that's ~200 particles → 20,000 distance checks per frame. Needs a spatial grid, or a hard particle cap (~90), or a neighbor-window limit.
- Density derives from `canvas.height * canvas.width / 9000` — uncapped on large displays. Cap it.
- Canvas must be sized to `devicePixelRatio` or it will look soft on retina — critical for a "precision" brand.
- Must pause via `IntersectionObserver` when off-screen, and on `visibilitychange`.
- Mouse repulsion radius `200` with force `5` is quite strong; dial toward radius `160`, force `2`.

**Extensibility hook:** You mentioned wanting to add another visual/background element later. The architecture accounts for this — background layers are pluggable via a single `<BackgroundLayer variant="..." />` slot per section, so a gradient mesh, grid, or shader can be dropped in without touching section markup.

---

## 7. Site Architecture — Homepage + Catalog

The site is now two page types, not one continuous scroll.

### 7.1 Homepage — 100% iPhone 18 focus

Every section on the homepage is in service of the flagship. No other product appears here except inside the marquee teaser at the bottom.

| # | Section | Content | Background |
|---|---|---|---|
| `01` | **Hero — Teardown** | Pinned scrub, conceptual side taglines (§4) | None (clean white) |
| `02` | **Chip / Performance** | The specific, technical beat: the new chip, named technological advances, called out with real mono specs and large grotesk numbers. This is where the site gets concrete — deliberately separate from the hero's conceptual taglines. | None |
| `03` | **Vision** | A breathing-room beat — near-empty, one long-form statement, room to "observe everything" after the density of `02`. | Particle field |
| `04` | **Acquire** | iPhone 18 models/config, pricing, primary blue CTA. | None |
| `05` | **Marquee — Catalog teaser** | Auto-scrolling infinite ticker of other products (earbuds, headphones, monitors, keyboards, accessories). Entirely click-through to `/catalog`. See §7.3. | None |
| — | **Footer** | Mono-set, dense, technical. Links, legal, a live status line. | None |

**Section rhythm:** Alternate high-density and near-empty sections (`02` dense → `03` empty → `04` dense). That breathing pattern is what separates premium from merely clean.

**Vertical spacing:** Sections use `clamp(120px, 18vh, 220px)` vertical padding. Generous. When in doubt, more.

### 7.2 Catalog page (`/catalog`) — v1 scope

- **Full grid, filterable by category:** Phones, Earbuds, Headphones, Monitors, Keyboards, Accessories. Filter as a horizontal mono-labelled pill row, single-select or multi-select (multi-select recommended — a retailer catalog usually wants "Earbuds + Headphones" simultaneously).
- **Card content:** product image, brand + product name (mono eyebrow for brand, grotesk for name), price. No hover-video, no expanded detail — keep cards uniform and calm.
- **No product detail pages in v1.** Cards are visually "complete" objects — not obviously broken links. Either non-interactive (cursor stays default) or open a lightweight quick-view modal with the same info slightly enlarged. **Recommend: quick-view modal** — costs little, avoids the page feeling like a dead end.
- **No hero/hairline-draw treatment here** — this page is denser and more utilitarian than the homepage; motion is limited to the standard reveal-on-scroll (§8) for grid rows.
- **iPhone 18 also appears in this grid** (as the Phones category, possibly pinned first) — the catalog is genuinely complete, not a "everything except our flagship" list.

### 7.3 Marquee / Ticker — spec

- **Behavior:** continuous auto-scroll, infinite loop, no user input required (not scroll-linked). Runs at a slow, deliberate pace — this is ambient, not attention-grabbing.
- **Content:** a repeating strip of product cards (image + brand/name, mono-set), duplicated seamlessly so the loop has no visible seam.
- **Direction:** single row, horizontal, left-moving (right-moving on hover is a nice-to-have, not required).
- **Interaction:** hovering pauses the scroll (standard marquee convention, gives users a chance to read/click); clicking *anywhere* in the marquee strip, or a "View full catalog →" mono label beside it, navigates to `/catalog`.
- **Motion:** CSS `@keyframes` transform-based scroll (not JS-driven), so it costs nothing on the main thread and keeps running smoothly regardless of scroll position.
- **Reduced motion:** per §11, this is exactly the kind of decorative motion that *should* stop under real `prefers-reduced-motion` — but must still respect the dev override so it's visible while building on this machine.

---

## 8. Transitions Between Sections

- **Primary pattern:** scroll-triggered reveal — content enters on a 20px upward translate + fade, ~700ms, `cubic-bezier(0.16, 1, 0.3, 1)`, staggered 60–80ms per child.
- **Trigger point:** element at 75% of viewport height. Fires once; no re-animation on scroll-up (re-triggering reads as cheap).
- **Section dividers:** a full-width hairline in `--nx-gray-200` that draws itself horizontally from left to right over ~800ms as the section enters. Subtle, technical, on-brand.
- **No** parallax on text. **No** slide-in-from-side. **No** scale-up-from-zero. The only motion vocabulary is: fade, short vertical translate, hairline draw, and the hero scrub.
- **Numeric counts:** the `04 / Performance` figures count up on entry, mono-tabular so digits don't shift width.

---

## 9. Responsive & Mobile

**Breakpoints:** `sm 640` · `md 768` · `lg 1024` · `xl 1280` · `2xl 1536`

**Hero on mobile — the critical adaptation.** The side-margin text placement does not survive a narrow viewport: there are no side margins.

- **< 768px:** Taglines move from side columns to a **single bottom-anchored block** (bottom third of the viewport), centered, with the phone occupying the upper two-thirds. Same sequencing, same timing, different anchor.
- **Scrub distance shortens** to ~300vh on mobile — touch scrolling covers ground faster and 400vh feels interminable on a phone.
- **Pinning on mobile:** must be tested against iOS Safari's dynamic toolbar (the collapsing URL bar changes `100vh` mid-scroll). Use `100dvh` and lock the pin container's height on mount.
- **Frame assets:** a separate, smaller image sequence for mobile (see §10) — serving desktop frames to a phone is unacceptable on payload.
- **Particle background:** reduced particle count on mobile, or disabled entirely below 768px. It's texture; it's not worth the battery.

**Touch:** no hover states on touch devices — the letter-swap nav effect needs a non-hover fallback (it simply doesn't fire; links are plain). Ensure tap targets ≥ 44px.

---

## 10. The Video — Technical Approach

**Asset:** `MEDIA/Disassembling_iPhone_animation_202608261447.mp4` — **probed**: 1280×720, h264, 24 fps, exactly 8.00 s = **192 frames**, 1.19 MB, plus an unused AAC audio track.

**Corrections to earlier assumptions in this section:**
- The source is **720p, not 1080p+**. The desktop set is therefore extracted at native 1280 px; anything larger would be upscaling. On a 1440p or 4K display the teardown is consequently softer than native — mitigated by drawing the frame *contained* at 88 % of the viewport rather than cover-cropping it, which both avoids visible upscaling and creates the side corridors the taglines need. **If a higher-resolution master exists, supplying it is the single biggest available quality win.**
- The clip's background is a flat **`#FAFAFA`, not pure white**, which would have left a visible off-white rectangle on a pure-white page. The extraction script lifts the white point (`colorlevels`, 250→255); verified as `rgb(255,255,255)` at all four corners afterwards, with phone detail preserved.
- The hero canvas renders with **`mix-blend-mode: multiply`**. Because the ground is now pure white, multiply makes it effectively transparent — so the future background element (§6) will show through the teardown with no chroma-keying and no halos. Keying was rejected: the exploded view contains white screen areas that a colour key would punch holes in.
- **ffmpeg is not installed system-wide.** Rather than modifying the machine, it is a project-local devDependency (`ffmpeg-static`), invoked by `scripts/extract-frames.mjs`.
- Frame count kept at the full **192** (not the proposed 120): the source is only 24 fps, so dropping frames would visibly coarsen the scrub. Measured output: **desktop 5.61 MB / mobile 2.02 MB**, mitigated by the coarse-to-fine loading order below.

### Options considered

**A — `<video>` element, scrub via `currentTime`**
Simplest. But: seeking an MP4 to arbitrary timestamps is not frame-accurate, decoders only seek cleanly to keyframes, and iOS Safari throttles/janks badly under rapid `currentTime` writes. **Rejected** — it would visibly stutter, which is fatal for a "premium, highly polished" brief.

**B — Image sequence on `<canvas>` ✅ RECOMMENDED**
Extract the clip to still frames, preload, and `drawImage()` the frame matching scroll progress. This is exactly how Apple builds these heroes. Perfectly smooth, fully deterministic, bidirectional for free, no codec quirks.

**C — Hybrid** (video + `requestVideoFrameCallback` desktop, sequence fallback)
Two code paths, two sets of bugs, for no gain over B. **Rejected.**

### Recommended pipeline (Option B)

1. **Extract frames** with ffmpeg → WebP (with JPEG fallback for old Safari).
2. **Frame count: 120** (≈15 fps over 8s). Because scrubbing is user-paced and slow, 120 frames is visually seamless — full 240 would double payload for no perceptible gain.
3. **Two resolution sets:**
   - Desktop: 1920px wide → target ≤ 45 KB/frame → ~5.4 MB total
   - Mobile: 960px wide → target ≤ 18 KB/frame → ~2.2 MB total
   The white background compresses extremely well, so these targets are realistic. **If the total exceeds ~6 MB, drop to 90 frames** rather than degrading per-frame quality.
4. **Loading strategy:** this is the make-or-break UX detail.
   - Load frame `0` immediately; render it as a static hero instantly.
   - Preload the remaining frames in the background, **in priority order** (every 8th frame first for a coarse pass, then fill in) so early scrubbing works before the full set has landed.
   - A minimal mono progress readout (`LOADING 34%`) during initial load — on-brand, and honest about what's happening.
   - **Scroll is locked** until a usable threshold (~30% of frames) is buffered.
5. **Canvas rendering:** size to `devicePixelRatio`, `drawImage` with cover-fit math, redraw only when the damped progress value actually changes frame index.
6. **Fallback:** if canvas or the sequence fails to load, show frame `0` as a static `<img>` with the final CTA visible. The page must never be unusable.

**Keep the MP4** in the repo as the source of truth — the frame sequence is a build artifact, regenerable via a committed script (`scripts/extract-frames.sh`).

---

## 11. ⚠️ Reduced-Motion — Environment-Specific Warning

**This machine has Windows animations disabled system-wide, so every browser here reports `prefers-reduced-motion: reduce`.**

Consequences for this project:
- If we write the conventional `@media (prefers-reduced-motion: reduce)` guard that disables animation, **the entire site will appear frozen and broken on your own machine** during development, and we will waste hours debugging a non-bug.
- Framer Motion respects reduced-motion automatically in some configurations — this must be explicitly overridden.

**Approach:** implement a motion-preference layer with a **development override** (a query param or a localStorage flag) that forces motion on regardless of the OS setting. Reduced-motion is still honoured properly in production — the hero scrub degrades to discrete frame-stepping without damping, and decorative motion is dropped — but we can always see the real thing locally.

Additionally: verification of any animation must be **visual**, in the browser pane, via screenshots at multiple scroll positions. "The code ran" and pixel-diff counts are not proof.

---

## 12. Stack

Your two component prompts (shadcn structure, Tailwind, TypeScript, `framer-motion`, `lucide-react`, `@/components/ui/...` alias) effectively specify the stack:

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** + **shadcn/ui** conventions (`components/ui/`)
- **Framer Motion** — nav transition, text sequencing, reveals
- **Lenis** (recommended addition) — smooth scroll normalisation; makes the scrub feel considerably better across trackpads/wheels/touch
- **lucide-react** — icons
- Custom hooks: `useScrollScrub`, `useFrameSequence`, `useMotionPreference`

**Design tokens** live in `app/globals.css` as CSS custom properties, mapped into `tailwind.config.ts` so `text-nx-blue` etc. work as utilities. No hardcoded hex values in components.

⚠️ **Not explicitly confirmed:** Next.js specifically (vs. Vite + React). The shadcn/`"use client"` conventions in your prompts imply Next.js. Flagging rather than assuming.

---

## Revisions — Round 2 (post-review)

These supersede the earlier text where they conflict.

- **§5 Navigation — the micro→full expansion is removed.** The nav is now present and complete from first paint on every route. Only the *surface* is scroll-linked: transparent over the hero, picking up a blurred fill and hairline after ~24px of scroll. Two hover/press effects are implemented on the links: the random letter-swap, plus a blue rule that wipes in beneath, with a spring dip on press and a pulse on the wordmark dot.
- **Wash depths are set by two constraints, not one.** The first pass tuned the washes only for black body copy and landed at 1.48:1 against white on blue and platinum versus 1.78:1 on graphite — which is why §04's white "NEW" appeared to work on the grey finish alone. All three now sit in a **1.73–1.89:1** band against white while holding **11:1+** against black. Equalising luminance exactly was rejected: it pushed graphite and platinum to within three RGB levels of each other and the finishes stopped being tellable apart, so chroma is preserved and luminance merely banded.
- **§04's wipe commits on a timer, not on an animation callback.** It previously set the resting colour in `onAnimationComplete`, which made the section's ground depend on an animation actually finishing. Picking a second finish mid-wipe unmounted the first layer before it could commit, so the ground never advanced past its starting colour and the discs accumulated instead of being replaced — measured as the Acquire background staying blue across all three selections while the bubbles and footer changed correctly. The wipe is now driven by an effect keyed on the selection and commits on a timeout, so the state converges on the selected finish however the animation goes.
- **§04 selectors are opaque and self-evident.** Every finish button is filled with a darkened cast of the colour it selects (`deep`: `#3f5568` / `#3b3b3e` / `#7a7263`), white label on top; the active storage button is filled with the *selected* finish's accent, so it restates the current colour. Selection is marked three ways at once — a tick, full opacity against 70% for the others, and a two-step ring (`0 0 0 3px <wash>, 0 0 0 5px #000`). The ring uses the panel's own wash as its inner gap **because the panel changes colour with the finish**: a fixed ring colour would sometimes vanish into the background it sits on. The `deep` values were picked by hand, not derived at a common contrast ratio — equalising put graphite and platinum one RGB level apart, so they sit at 11.2:1 and 4.8:1 against white instead and stay 91 levels apart.
- **Lenis is removed, and with it the broken anchor navigation.** "Explorer l'architecture" failed for a reason neither of my first two fixes addressed: Lenis owns the scroll position and pulls it back to its own internal target on the following frame, so a native hash jump was undone before it could be seen. Routing anchors through `lenis.scrollTo` instead failed the opposite way — that call runs on the same rAF loop, so any stall swallowed the click via `preventDefault` while leaving the page put (measured: click intercepted, hash updated, scroll still 0). Local testing hid both faults, because a hidden Browser pane freezes rAF and therefore froze the very loop doing the damage. Nothing was lost by dropping the library: it existed to stop the teardown scrub stepping between frames, and the scrub already damps its own progress — that lerp, not Lenis, is what makes the sequence glide. Navigation is now native scrolling plus `scroll-margin-top: 96px` on the anchor targets, with no JavaScript in the path. Verified: the target holds at 2784 after 2.2s with no pull-back, and the section heading clears the navbar.
- **§04 — oversized "NEW" behind the product.** A display word set in the wordmark face at ~269px, white on the section's wash, sitting behind the storage and finish selectors — not behind the phone, which was its first home. It carries an explicit `-z-10`, which is load-bearing rather than defensive: an absolutely positioned element paints ABOVE static siblings regardless of DOM order, so without it the word covers the labels and swatches the moment Reveal's transform settles back to `none` and its children stop being painted as positioned. It is anchored at `top-[36%]` rather than centred, because the wrapper's midpoint sits below the "Stockage" label and a centred word cleared it entirely. Verified against the live layout: the word obscures nothing — hit-testing the label and the swatches returns them, not it.
- **Finish is site-wide state.** The colourway chosen in §04 recolours the whole site, not just that section. `lib/finishes.ts` holds each finish's four colour roles — `swatch` (real chassis colour, selector dots only), `wash` (mixed toward white for large filled areas carrying black copy), an `accent` triple, and `tint` — the same colour taken ~93% toward white, which is now the PAGE GROUND. Every surface that was pure white carries it, so the coloured panels no longer read as bright patches on a white sheet; the ladder is `#f1f5f9 → #c3d5e8` rather than `#ffffff → #c3d5e8`. Card surfaces went from opaque white to `white/55`, lifting off the ground instead of punching through it. **The default tint is declared in CSS, not only set by the provider on mount** — relying on the effect alone made the first paint pure white and then transitioned into the tint, a visible flash on every page load; that default must stay in step with `FINISHES[0].tint`. `FinishProvider` overrides `--color-nx-blue` / `-deep` / `-light` on `<html>`: Tailwind v4 emits theme tokens as CSS custom properties and utilities reference them, so `bg-nx-blue` and the `nx-metal` gradient repaint everywhere at once — navbar mark and CTA, hero CTA, scrub progress bar, catalogue link, footer status dot, focus rings — with no prop drilling and no second source of truth. The tinted **bubble** is now the section container of choice: §02's metric row, its headline block and its three advance cards, and §03's whole statement column all sit in rounded panels filled with the finish's wash — as do the navigation bar (translucent over the hero at 0.55 alpha, denser at 0.92 once scrolled) and the footer, so the page opens and closes in the same colour. Both tints are plain CSS transitions, not Motion animations: a value that changes on two discrete events does not need a frame loop, and routing it through one left the bar showing a stale colour whenever frames were throttled. Inside a bubble, body copy switches from the fixed grey token to `black/60`: a fixed grey drifts in contrast as the ground changes colour. §03's phone artwork follows the selection too, rather than being pinned to blue. Two things could not ride on the CSS variable and are passed explicitly: the ring field takes literal colours (a variable would not reach the shader), and the backdrop's grid and depth washes were hardcoded `rgba(11,95,255,…)`, now `color-mix(in srgb, var(--color-nx-blue) …%, transparent)`. **Accent note:** the accents are NOT the chassis colours — graphite and platinum are near-neutral, and a desaturated accent reads as a disabled control, so each is pushed to a usable saturation and darkened enough to carry white text.
- **§03 Vision / §04 Acquire — iPhone colourways.** Three supplied colour shots (blue / graphite / platinum) are prepared by `scripts/prepare-colorways.mjs`: the sources are 2752x1536 with the phone occupying a small part of a near-empty frame, so each is measured for its content bounding box (by luminance — ffmpeg's `cropdetect` looks for BLACK borders and finds nothing on a white-bordered image), cropped to it, white-point lifted from #FAFAFA to pure white, **keyed to a real alpha channel**, and padded to a 900x1200 portrait. The transparency is load-bearing: the first pass kept a white ground and composited with `mix-blend-multiply`, which produced a white rectangle behind the phone for the full 0.55s entrance — animating `opacity` creates a stacking context, and that isolates the blend. An alpha channel has no such coupling. The key is held tight (similarity 0.06) because the platinum chassis is only `#a9a8a5`; verified afterwards that the product survived intact. Vision now shows the blue colourway. Acquire is **colour-reactive**: selecting a finish swaps the phone with a scale/fade entrance, and the section's background is repainted by a disc of the incoming colour expanding from the phone itself — origin and radius are measured from the live layout on each click (phone centre relative to the section; distance to the furthest corner), so the wipe starts exactly at the product and always finishes covered at any viewport size. The washes are the measured chassis colours mixed ~74% toward white: the section carries black body copy, so a true titanium blue would fail contrast outright.
- **§4 Hero — catalogue satellites.** Four product tiles flank the teardown so the hero reads as a store rather than one object on white. Rules: Apple takes three of the four and the largest slots; only white-ground tiles are eligible (they render with `mix-blend-multiply`, so a coloured ground — the grey behind the AirPods Pro, or the three scene photos — would float as a visible rectangle); sizes run 179/154/134/90 px, a deliberate 2x spread so the group never reads as evenly-sized decoration, against the teardown's ~56vw. They hug the phone's footprint (x 22–78%) rather than the viewport edge, landing at x 9–19% and 77–92%. **They persist for the entire scrub** and are therefore positioned to miss every text slot outright rather than being timed around it — the closing CTA headline is wide (x 14–85%, y 13–23%), the side taglines sit at y 54–66%, so the upper pair starts below 26vh and the lower pair below 74vh, straddling the tagline band. Verified against the live layout: zero collisions with any text element.
- **§4 Hero — completely reworked.** The teardown is drawn at **62 % of contain** on desktop (was 88 %): the 720p source is downscaled rather than near-native, which is what makes it read sharp. The "scroll to disassemble" prompt and the grey eyebrow are gone; the bottom rail now shows a functional scrub readout (`000 / 100`) instead of an instruction. A large `iPhone 18` wordmark sits **behind** the canvas — because the canvas blends with `multiply` over a pure-white ground, the type reads through the empty areas and is occluded by the phone itself.
- **§6 Backdrop — the constellation canvas is replaced by the Cursor Ring Field.** A supplied raw-WebGL component (no Three.js, no new dependencies): a Poisson-scattered field of capsule sprites whose state — position, scale, accumulated energy — is integrated on the GPU into a floating-point texture, lit by a ring that eases toward the pointer and wanders on its own when there is none. Verified running on the full GPGPU path in-browser (`useSim: true`, no unresolved uniforms). It replaced `particle-field.tsx`, which is deleted.
  - Integrated as the third layer of `TechBackdrop`, so the grid and depth washes still sit beneath it.
  - Additions to the supplied file: a `uOpacity` uniform (the field must sit under type without competing), a `paused` prop wired to the motion preference, and an `IntersectionObserver` so off-screen sections cost nothing. The Framer preset wrapper became a typed default export.
  - Tuned per variant — hero `density 165 / opacity 0.55`, sections lighter. The component's own default is 300; the hero runs beside the teardown's rAF loop and takes a lighter field deliberately.
  - **Colour caveat:** the fragment shader multiplies each point by its ring energy, so unlit points fall toward black and only points inside the ring band carry the palette. On white this reads as a fine technical dot field with a blue wave moving through it — the palette governs the ring more than the resting field.
  - Two rules are disabled for this one file in `eslint.config.mjs` (`no-explicit-any` for the untyped WebGL1/2 context, `react-hooks/refs` for the deliberate density dirty-flag), scoped so they stay enforced everywhere else.
- **§6 Backdrop — the "never behind the hero" rule is reversed.** The hero carries the `hero` variant of a new three-layer `TechBackdrop`: a blueprint grid (radially masked so it never ends on a hard edge), two soft blue depth washes, and the particle constellation. Sections carry lighter variants. This was the fix for the page reading as blank white.
- **§11 Motion — the default is now ON, deliberately not keyed to `prefers-reduced-motion`.** Keying off the OS setting meant that on this machine (Windows animations disabled system-wide) every animation was disabled, which is why the nav hover effects appeared unimplemented and the marquee looked static. `?motion=off` still exposes the fully reduced experience.
- **Language: the site is French.** All UI copy, catalog categories, metadata and `<html lang>` are French; prices are `fr-FR` / EUR.
- **Extraction — a 3px black letterbox bar** was found on the top and bottom edges of every source frame (`cropdetect` missed it below threshold). Under `multiply` it rendered as hard black rules across the hero. Frames are now cropped to 1280×712. Five **stills** are also extracted from the same clip and used as real imagery in the page sections.

## Open Decisions — Need Your Input

1. **~~Product photography~~ — RESOLVED.** All 20 catalogue products now carry real photography, supplied by the client and normalised by `scripts/prepare-products.mjs` into one 1200x900 (4:3) WebP tile each (~0.86 MB total). Three source shapes are handled differently: a uniform background is padded out with its **own** sampled corner colour; a transparent source is flattened onto a background chosen against the product's mean luminance (pale products such as the white AirPods Pro get a cool grey, or they vanish on white); a scene photo with non-uniform corners is centre-cropped rather than padded, since there is no single colour to pad with. `ProductMedia` renders real photos plainly — the multiply blend and gradient plate are now used only on the glyph fallback path.
   - **Known weak asset:** the Sony Xperia 1 VII source is only 400x400 and is upscaled ~2x into the tile, so it reads softer than the rest. A larger source is the fix.
2. **The "Accessoires" category is removed** along with its four products, at the client's request. The catalogue is now 20 products across five categories: Téléphones, Écouteurs, Casques, Moniteurs, Claviers.
3. **A higher-resolution master of the teardown clip** — the single biggest remaining quality win (see §10).
4. **Exact accent blue** — currently `#0B5FFF`, chosen colder/deeper than Apple's `#0A84FF`. Confirm or adjust.
5. **Tagline copy (§4.3)** — currently *Ingénierie pure.* / *Rien de caché.* / *Potentiel infini.*
6. **Scrub distance (§4.2)** — 400vh desktop / 300vh mobile; still worth tuning against how it feels.
