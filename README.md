# BABKA — Sistema de gestión operacional

> Panadería de masa madre + café de especialidad · Mérida, Yucatán

BABKA es un agente AI de operaciones para SOCO (el grupo de restaurantes/panaderías). Automatiza el cierre de vitrina, la conciliación de inventario y el flujo de pedidos vía WhatsApp — con humanos en el loop para todo lo que no cierra limpio.

---

## Arquitectura del sistema

```
WhatsApp (Baileys)
      ↓
Orquestador LangGraph
      ↓              ↓
BABKA-Vitrina   BABKA-Checklist   ← sub-agentes
      ↓
Supabase (BD + Auth + Storage)
      ↓
Dashboard React (Clarisa + dueños)
      ↑
  HITL Queue (aprobaciones humanas)
```

**Sucursales:** Centro · Norte · Montes Ame · Marista · Slowfood

---

## Plan de implementación

Ver [`BABKA-implementation-plan.md`](./BABKA-implementation-plan.md) para el plan completo por fases.

| Fase | Descripción | Estado |
|------|------------|--------|
| 0 · El cascarón | Dashboard navegable completo, datos falsos | 🚧 En progreso |
| 1 · Se siente vivo | UI reactiva con mock API (MSW) | Pendiente |
| 2 · Datos de verdad | Auth + Supabase + persistencia | Pendiente |
| 3 · Entra la realidad | Parser POS (SoftRestaurant XLS) + conciliación manual | Pendiente |
| 4 · Entra BABKA | Agente WhatsApp end-to-end + HITL | Pendiente |
| 5 · Segundo carril | Sub-agente Checklist + pedidos/distribución | Pendiente |
| 6 · El piloto | Autonomía de una sucursal × 5 días seguidos | Pendiente |
| 7+ · Aprende y se arregla | V2: Curator, Maintenance, FoodCost, Compras | Futuro |

---

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | React + Vite + TypeScript |
| UI / Componentes | Design System BABKA + shadcn/ui + Recharts |
| Mock API (Fase 1) | Mock Service Worker (MSW) |
| Base de datos | Supabase (PostgreSQL + Auth + Storage + pgvector) |
| Agente | LangGraph + Claude (Anthropic) |
| WhatsApp | Baileys |
| Tracing | LangSmith |
| Alertas/Email | Sentry + SendGrid/Resend |
| Deploy | artifacts.dashone.ai |

---

## Design System

El design system de BABKA vive en [`/design-system`](./design-system).

### Marca

| Elemento | Valor |
|----------|-------|
| Tipografía display | Fraunces (serif óptico) |
| Tipografía UI | DM Sans |
| Tipografía datos/precios | JetBrains Mono |
| Color primario (CTAs) | `--wheat` · `#E6B23C` |
| Color firma de marca | `--babka-blue` · `#1F5AD9` |
| Color acento | `--babka-orange` · `#DC7A33` |
| Fondo base | `--flour` · `#FFFFFF` |
| Texto principal | `--ink` · `#1A1714` |

### Regla de proporción de color: 60 / 20 / 10 / 10

- **60%** Blanco/crema — fondo y aire
- **20%** Amarillo trigo — CTAs y highlights
- **10%** Azul cobalt — firma de marca
- **10%** Tinta — estructura y texto

### Componentes disponibles

```
design-system/
├── tokens/           # colors.css · typography.css · spacing.css · base.css
├── styles.css        # entry point (@imports de tokens)
├── assets/           # SVGs: wordmark, logo, icon
├── components/core/  # Button · Badge · Input · ProductCard
└── _ds_bundle.js     # bundle React pre-compilado
```

**Uso rápido:**
```tsx
// Importa tokens CSS globalmente en main.tsx
import './design-system/styles.css'

// Usa los componentes JSX
import { Button, Badge } from './design-system/_ds_bundle.js'
```

### Principios de diseño

- Bordes siempre redondeados (`--r-sm` 10px → `--r-pill` 999px). Jamás 0px.
- Sombras cálidas (`rgba(26,23,20,…)`). Nunca azuladas.
- Hover: `translateY(-3px)` en cards, `translateY(-1px)` en botones.
- Focus ring: siempre `--babka-blue`. Nunca amarillo (no pasa AA sobre blanco).
- Sin emojis en UI. Sin gradientes genéricos. Mucho aire blanco.
- Texto sobre `--wheat`: siempre `--ink`. Nunca blanco.

---

## Estructura del proyecto (Fase 0+)

```
babka/
├── README.md
├── BABKA-implementation-plan.md
├── design-system/           # Design System BABKA (tokens + componentes)
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── fixtures/            # Datos falsos tipados (contrato de la API)
│   ├── components/          # Componentes UI de la app
│   ├── pages/               # Resumen · Conciliaciones · HITL · WhatsApp
│   └── types/               # Tipos TypeScript (= contrato Pydantic futuro)
├── package.json
└── vite.config.ts
```

---

## Desarrollo local (Fase 0 — sin backend)

```bash
npm install
npm run dev
# → http://localhost:5173
```

No se necesita ningún secreto ni infraestructura. Todo corre con datos ficticios de `src/fixtures/`.

---

## Contacto / Equipo

- **Producto / dueños:** SOCO Mérida
- **Operadora principal:** Clarisa (usuario HITL)
- **Deploy:** `artifacts.dashone.ai`
