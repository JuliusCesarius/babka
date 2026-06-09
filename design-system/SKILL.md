---
name: babka-design
description: Use this skill to generate well-branded interfaces and assets for Babka, a sourdough bakery and specialty coffee shop in Mérida, Yucatán. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for prototyping.
user-invocable: true
---

Read the README.md file within this skill, and explore the other available files.

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## Quick reference

**Brand:** Babka — panadería de masa madre + café de especialidad, Mérida, Yucatán. "El rincón social de Mérida."

**Core tokens (always use CSS vars, never hex):**
- `--babka-blue: #1F5AD9` — firma/acento
- `--wheat: #E6B23C` — primario (CTAs)
- `--babka-orange: #DC7A33` — chispa puntual
- `--flour / --flour-warm / --crumb` — fondos (60%)
- `--ink / --ink-soft` — estructura y texto

**Proportion rule (non-negotiable):** 60% white · 20% wheat · 10% blue · 10% ink

**Fonts:** Fraunces (display/wordmark) · DM Sans (body/UI) · JetBrains Mono (data/tokens)

**Key rules:**
- NEVER white text on yellow (WCAG AA fail)
- Focus rings always blue, never yellow
- Buttons always pill shape (--r-pill)
- Wordmark: Fraunces 900 italic, color --babka-blue
- "PAN DE HOY" lockup: DM Sans 700 uppercase tracking-widest, on --wheat background

**GitHub source:** https://github.com/JuliusCesarius/babka
