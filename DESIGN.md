---
name: Foldkit CN
description: Familiar shadcn component documentation translated into a precise, Foldkit-native workbench.
colors:
  workshop-teal: '#25736f'
  deep-teal: '#124f4c'
  warm-canvas: '#f8f7f2'
  clean-surface: '#fffef9'
  graphite-ink: '#24231f'
  field-note: '#686257'
  code-wash: '#f0eee5'
  structural-border: '#dfddd2'
  destructive: '#c03c3c'
typography:
  display:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: '3rem'
    fontWeight: 700
    lineHeight: 1
    letterSpacing: '-0.03em'
  display-mobile:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: '2.125rem'
    fontWeight: 700
    lineHeight: 1
    letterSpacing: '-0.03em'
  headline:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: '2rem'
    fontWeight: 700
    lineHeight: 1.2
  lede:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: '1.125rem'
    fontWeight: 400
    lineHeight: 1.55
  compact:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: '0.875rem'
    fontWeight: 400
    lineHeight: 1.5
  body:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: '1rem'
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif'
    fontSize: '0.78rem'
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: '0.08em'
rounded:
  sm: '4.8px'
  md: '6.4px'
  lg: '8px'
  xl: '11.2px'
spacing:
  xs: '4px'
  sm: '8px'
  md: '16px'
  lg: '24px'
  xl: '32px'
components:
  navigation-active:
    backgroundColor: '{colors.code-wash}'
    textColor: '{colors.deep-teal}'
    typography: '{typography.body}'
    rounded: '{rounded.sm}'
    padding: '4px 6px'
  code-panel:
    backgroundColor: '{colors.code-wash}'
    textColor: '{colors.graphite-ink}'
    rounded: '{rounded.lg}'
    padding: '16px'
  metadata-row:
    backgroundColor: '{colors.code-wash}'
    textColor: '{colors.graphite-ink}'
    rounded: '{rounded.sm}'
    padding: '9px 10px'
---

# Design System: Foldkit CN

## Overview

**Creative North Star: "The Foldkit Workbench"**

Foldkit CN is a calm technical workspace: familiar enough for a shadcn user to navigate immediately, but explicit about the Foldkit architecture underneath every component. The shell is precise, pragmatic, and compact. Content, behavior, installability, and provenance carry the visual hierarchy; decoration does not.

The system uses warm neutral surfaces and restrained teal emphasis to distinguish the documentation shell from the neutral shadcn-compatible preview canvas. It rejects a superficial shadcn reskin that merely renames source material or hides how each component was translated into Foldkit.

**Key Characteristics:**

- Familiar documentation structure with a distinct Foldkit voice
- Restrained teal reserved for navigation, focus, and meaningful action
- Compact geometry, structural borders, and readable technical density
- Clear separation between the Foldkit docs shell and component preview themes
- Responsive navigation that preserves discovery and context

## Colors

The palette feels like a maintained engineering notebook: warm enough for long reading sessions, dark enough for dependable contrast, and punctuated by a focused teal signal.

### Primary

- **Workshop Teal:** The principal interactive signal for links, focus, and active context.
- **Deep Teal:** The higher-contrast action and selected-state color on light surfaces.

### Neutral

- **Warm Canvas:** The page background that separates the shell from white previews.
- **Clean Surface:** Popovers, cards, and elevated documentation surfaces.
- **Graphite Ink:** Primary text and technical content.
- **Field Note:** Secondary prose, metadata, and navigation labels.
- **Code Wash:** Code panels, metadata rows, and quiet selected backgrounds.
- **Structural Border:** Dividers and component boundaries.
- **Destructive:** Error and destructive-action feedback only.

**The Restrained Signal Rule.** Teal identifies action, focus, selection, and Foldkit-specific emphasis; it is never ambient decoration.

**The Two-World Rule.** The documentation shell keeps the Foldkit palette while component previews preserve their origin-compatible tokens.

## Typography

**Display Font:** Inter with the system sans-serif fallback stack  
**Body Font:** Inter with the system sans-serif fallback stack  
**Label/Mono Font:** System UI for labels; the platform monospace stack for code

**Character:** One dependable sans-serif family keeps the product surface direct and consistent. Scale and weight create hierarchy without introducing a decorative display voice.

### Hierarchy

- **Display** (700, 3rem desktop / 2.125rem mobile, 1): Route-level page titles only.
- **Headline** (700, 2rem, 1.2): Major documentation sections.
- **Title** (700, approximately 1rem–1.25rem): Component names, result titles, and local group headings.
- **Body** (400, 1rem, 1.7): Documentation prose, capped near 65–75 characters where practical.
- **Compact** (400, 0.875rem, 1.5): Navigation, metadata, code, and dense product information.
- **Label** (700, 0.78rem, 0.08em, uppercase): Sparse taxonomy and metadata labels, not a repeated eyebrow above every section.

**The Technical Hierarchy Rule.** Labels orient, headings structure, and body copy explains; never use label styling as decorative scaffolding.

## Elevation

The shell is flat and structural by default. Background changes and one-pixel borders create hierarchy. The broad ambient shadow is reserved for genuinely floating surfaces such as the brand mark or transient overlays; preview popovers use their own origin-compatible elevation vocabulary.

### Shadow Vocabulary

- **Shell Ambient** (`0 18px 45px rgb(36 35 31 / 8%)`): Rare floating shell elements only.
- **Preview Overlay:** Origin-compatible compact overlay shadows inside the isolated preview surface.

**The Flat Workbench Rule.** Documentation content rests on the workbench; shadows appear only when an element actually floats above it.

## Components

### Buttons

- **Shape:** Compact gently curved corners derived from the 8px base radius.
- **Primary:** Deep teal action treatment with high-contrast surface text.
- **Hover / Focus:** Stronger teal on hover and a clearly visible teal focus ring; state transitions remain brief and functional.
- **Secondary / Ghost:** Neutral or transparent surfaces with structural borders and consistent geometry.

### Cards / Containers

- **Corner Style:** Compact 8px corners where grouping needs a boundary; many content regions remain square and sectional.
- **Background:** Clean Surface for shell containers and Code Wash for technical panels.
- **Shadow Strategy:** Flat by default; use structural borders before elevation.
- **Border:** One-pixel Structural Border.
- **Internal Padding:** 16–32px according to content density.

### Inputs / Fields

- **Style:** Neutral surface, structural input border, compact radius, and readable text.
- **Focus:** Teal ring and border emphasis without layout shift.
- **Error / Disabled:** Destructive color is reserved for actual errors; disabled controls reduce emphasis while retaining legibility.

### Navigation

The sticky header, left taxonomy, and optional table of contents maintain location across long pages. Default links use Field Note; hover, active, and current-page states use teal and a quiet selected background. Mobile navigation collapses structurally rather than merely shrinking desktop columns.

### Code and Preview Panels

Code panels use Code Wash, monospace type, one structural border, and a compact title rail. Preview panels isolate origin-compatible component tokens from the Foldkit shell so visual parity remains honest.

## Do's and Don'ts

### Do:

- **Do** preserve shadcn's familiar discovery, preview, installation, usage, and API workflow.
- **Do** make Foldkit architecture, conventions, examples, lifecycle, and provenance conspicuous.
- **Do** reserve Workshop Teal and Deep Teal for interaction, focus, selection, and meaningful Foldkit emphasis.
- **Do** keep prose readable, controls keyboard-operable, focus visible, and motion compatible with reduced-motion preferences.
- **Do** keep docs-shell tokens separate from origin-compatible preview tokens.

### Don't:

- **Don't** create a superficial shadcn reskin that merely renames the source material or obscures how the component has been translated into Foldkit.
- **Don't** apply shadcn site-level branding wholesale; familiar affordances are the structure, not the identity.
- **Don't** turn every section into a bordered card or repeat tiny uppercase eyebrows as decorative scaffolding.
- **Don't** pair a one-pixel border with a broad decorative shadow on the same static container.
- **Don't** use teal as decoration, gradients on text, or glass effects as the default surface treatment.
