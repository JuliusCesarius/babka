# BABKA Design System

> **El rincón social de Mérida** — Sistema de diseño para Babka, panadería de masa madre y café de especialidad en Mérida, Yucatán.

---

## Fuentes y contexto

- **GitHub repo:** https://github.com/JuliusCesarius/babka *(referencia para el equipo — puede requerir acceso privado)*
- **Marca:** Babka — panadería artesanal + café de especialidad, Mérida, Yucatán, México
- **Tagline:** "Pan de hoy · El rincón social de Mérida"

> ⚠️ El repositorio `JuliusCesarius/babka` no estaba accesible en el momento de generación de este sistema. El sistema fue construido enteramente desde la especificación de marca provista. Si tienes acceso al repo, revísalo para extraer assets adicionales, pantallas reales y código fuente.

---

## Filosofía de marca

Babka es sobria, honesta y cercana. No es aspiracional ni pretenciosa — es el panadero que te conoce por nombre. Su cara es limpia como harina blanca, con el sello cobalt azul como firma y el amarillo trigo como calor primario.

**Voz:** Cercana, mexicana, sin pretensión. Como un panadero que te conoce.
**Tono:** Directo, cálido, concreto. Nunca corporativo, nunca hipster con mayúsculas en todo.

---

## CONTENT FUNDAMENTALS

### Voz y tono

- **Persona:** El panadero de barrio que te conoce. Habla de tú. No "estimado cliente" — simplemente "tú".
- **Idioma:** Español mexicano natural. Sin anglicismos innecesarios. Sin pretensión.
- **Casing:** Oraciones normales (solo primera letra en mayúscula), excepto el lockup "PAN DE HOY" que va en todas mayúsculas con tracking amplio.
- **Números:** Precios en MXN con signo de peso antes: `$85 MXN`. Sin decimales cuando es entero.
- **Emoji:** ❌ No se usan. La marca habla por formas y color, no por íconos de carita.
- **Puntuación:** Puntos y comas normales. Signos de apertura (¡¿) cuando hay exclamación/pregunta genuina. No abuso.

### Ejemplos de copy ✓ vs ✗

| ✓ Sí | ✗ No |
|---|---|
| "Pan horneado esta mañana" | "Artisan freshly-baked sourdough bread" |
| "¿Ya pediste el tuyo?" | "¡No te quedes sin tu pan!" |
| "Masa madre de largo proceso" | "Fermentado durante 48 horas con levadura salvaje premium" |
| "Hoy: focaccia con romero" | "TODAY'S SPECIAL 🔥🔥" |
| "Llevamos 5 años horneando en Mérida" | "Somos una empresa comprometida con la excelencia panadera" |
| "Ordenar" | "Añadir al carrito" |

### Estructura de frases
- CTAs cortos: 1-2 palabras. "Ordenar", "Ver más", "Hoy es el día".
- Descripciones de producto: 1 oración, máximo 2. Sin adjetivos superlicivos.
- Títulos: DM Sans 700 uppercase solo para el lockup PAN DE HOY. El resto: Fraunces con mayúscula normal.

---

## VISUAL FOUNDATIONS

### Colores
Regla estricta **60 / 20 / 10 / 10**:
- **60% Blanco** (`--flour`, `--flour-warm`, `--crumb`) — fondo de todo el contenido. Mucho aire.
- **20% Amarillo trigo** (`--wheat`) — COLOR PRIMARIO. CTAs, badges, highlights. Nunca texto blanco encima.
- **10% Azul cobalt** (`--babka-blue`) — firma de marca. Formas orgánicas, wordmark, links, focus rings.
- **10% Tinta** (`--ink`) — estructura: nav, footer, encabezados, texto principal.
- **Naranja** (`--babka-orange`) — chispa puntual fuera del conteo. Jamás como fondo base ni texto corrido.

### Tipografía
- **Fraunces** (Google Fonts, serif óptico): titulares, wordmark, precios. Peso 900 italic para wordmark y hero. Peso 600 para H2/H3. Carácter artesanal y orgánico.
- **DM Sans**: cuerpo, UI, todo lo funcional. 700 + uppercase + tracking amplio para el lockup "PAN DE HOY". 400/500 para texto corrido y labels.
- **JetBrains Mono**: datos, tokens, precios inline, códigos de pedido. Nunca para texto corrido.

### Fondos e imágenes
- Fondos siempre blancos o crema (`--flour-warm`, `--crumb`). Nunca degradados genéricos.
- Sin patrones de fondo ni texturas. El aire blanco ES el diseño.
- Las imágenes de producto, si existen, van sobre fondo blanco con luz natural cálida. Sin filtros de teléfono.
- Los "blobs" orgánicos (formas tipo clip-path o SVG path) son el motivo visual clave — reemplazan las imágenes de hero.

### Formas orgánicas (Blobs)
La firma visual más reconocible de Babka. Son paths SVG asimétricos, nunca círculos perfectos ni elipses.
- Un blob azul grande (~60% del área), uno amarillo mediano (~30%), uno naranja pequeño (~10%).
- Nunca centrados ni perfectamente simétricos. Ligeramente fuera del marco.
- Usados en: headers de tarjetas de producto, sección hero, fondos de sección.

### Esquinas y formas
- Siempre redondeadas: `--r-sm` (10px) para inputs/chips, `--r-md` (18px) para cards, `--r-lg` (28px) para cards grandes, `--r-pill` (999px) para botones y badges.
- Jamás esquinas 0px. Jamás bordes izquierdos de color con el resto cuadrado.

### Sombras
- Cálidas, tenues. Nunca azuladas ni frías. La tinta del box-shadow usa `rgba(26,23,20,…)` — café oscuro, no negro puro.
- `--shadow-sm`: hover cards, chips. `--shadow-md`: cards en reposo. `--shadow-lg`: cards en hover. `--shadow-xl`: modales.

### Animaciones y transiciones
- Duración base: `0.3s`. Easing: `cubic-bezier(.2,.8,.2,1)` (ease-out suave).
- Hover en botones: `translateY(-1px)` + sombra más profunda.
- Hover en cards: `translateY(-3px)` + shadow upgrade.
- Press en botones: `scale(0.97)`.
- Sin bounces ni springs exagerados. Sin loops decorativos en contenido.
- `prefers-reduced-motion`: todo visible en su estado final, sin animaciones de entrada.

### Hover y press states
- Botones: fondo más oscuro (`--wheat-deep`, `--babka-blue-deep`) + ligero float. Press: shrink.
- Cards: float + shadow upgrade.
- Links: color más oscuro (`--babka-blue-deep`).
- Nav items: fondo `--crumb` o underline azul.

### Focus rings
- **Siempre azul** (`--babka-blue`), nunca amarillo (amarillo sobre blanco no se distingue — no pasa AA).
- `outline: 2px solid var(--babka-blue); outline-offset: 3px;` en `:focus-visible`.

### Accesibilidad WCAG AA
- Botón primario: `--wheat` + `--ink`. NUNCA texto blanco sobre amarillo.
- Naranja siempre con `--ink`.
- Azul con texto blanco ✓ (pasa AA).
- Focus ring azul.

### Cards
- Fondo `--flour` (blanco puro). Radio `--r-lg` (28px). Sombra `--shadow-md`.
- Header con blobs SVG orgánicos. Badge flotante top-left.
- Body: kicker uppercase mono, título Fraunces 900, descripción DM Sans, precio JetBrains Mono.

### Iconografía
No existe un sistema de iconos definido en el repo fuente. Las opciones recomendadas:
- **Lucide Icons** (CDN): stroke fino, weight consistente. `https://unpkg.com/lucide@latest`
- Unicode characters para flechas y bullets simples.
- Sin emoji en UI. Sin iconos de relleno (fill) para UI funcional.

### Layout
- Escala de espacio base 4px: 4 · 8 · 12 · 16 · 24 · 32 · 48 · 72.
- Grid de contenido máximo ~1100px. Márgenes laterales generosos.
- Mucho aire blanco. "Sobrio sobre saturado" — si hay duda, quita elementos.
- Flex/grid con `gap` para todo layout. Nunca márgenes inline por elementos individuales.

---

## ICONOGRAFÍA

No hay sistema de iconos propio en el repo de Babka. Se recomienda **Lucide Icons** desde CDN:

```html
<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
```

Íconos de referencia frecuente:
- `arrow-right`, `shopping-bag`, `map-pin`, `clock`, `leaf`, `check`, `x`, `chevron-down`

Reglas:
- Stroke weight: 1.5px consistente (Lucide default).
- Color: siempre heredar del padre. Nunca hardcoded.
- Tamaño: 16px (labels), 20px (botones), 24px (navegación), 32px (decorativo).
- ❌ Sin emoji como íconos de UI.
- ❌ Sin íconos de relleno para acciones funcionales.

---

## Estructura de archivos

```
/
├── styles.css                  # Entry point — solo @imports
├── tokens/
│   ├── colors.css              # Variables de color + aliases semánticos
│   ├── typography.css          # Fuentes, escala, pesos, tracking
│   ├── spacing.css             # Espacio, radios, sombras, z-index, transiciones
│   └── base.css                # Reset + estilos base globales
├── assets/
│   ├── babka-wordmark.svg      # BABKA azul sobre transparente
│   ├── babka-wordmark-white.svg# BABKA blanco (fondos oscuros)
│   ├── babka-logo-full.svg     # Wordmark + tagline
│   ├── babka-icon.svg          # Blob azul con "B"
│   └── babka-wordmark-blue.svg # Alias azul
├── components/
│   └── core/
│       ├── Button.jsx/.d.ts/.prompt.md
│       ├── Badge.jsx/.d.ts/.prompt.md
│       ├── Input.jsx/.d.ts/.prompt.md
│       ├── ProductCard.jsx/.d.ts/.prompt.md
│       └── components.card.html
├── guidelines/
│   ├── colors/     # blue, wheat, orange, neutrals, proportion cards
│   ├── type/       # fraunces, dmsans, mono, scale cards
│   ├── spacing/    # spacing, radii, shadows cards
│   └── brand/      # wordmark, blobs, lockup cards
└── ui_kits/
    └── website/
        └── index.html          # Prototipo interactivo del sitio web Babka
```

---

## Componentes disponibles

| Componente | Variantes principales |
|---|---|
| `Button` | primary · secondary · ghost · orange · subtle / sm · md · lg |
| `Badge` | wheat · blue · blue-soft · orange · crust · crumb · ink / sm · md · lg |
| `Input` | default · error · disabled · con prefix/suffix |
| `ProductCard` | accentColor blue · wheat · orange / available · sold-out |

---

## Uso rápido

```html
<!-- 1. Carga estilos globales -->
<link rel="stylesheet" href="path/to/styles.css">

<!-- 2. Carga el bundle de componentes -->
<script src="path/to/_ds_bundle.js"></script>

<!-- 3. Usa componentes en React/Babel -->
<script type="text/babel">
  const { Button, Badge, ProductCard } = window.BabkaDesignSystem_9af84f;
  // ...
</script>
```

---

*Generado el 8 de junio de 2026 · Babka Design System v1.0*
