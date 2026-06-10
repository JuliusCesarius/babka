# BABKA — Sistema de gestión operacional

> Panadería de masa madre + café de especialidad · Mérida, Yucatán

BABKA es un agente AI de operaciones para SOCO. Automatiza el cierre de vitrina, la conciliación de inventario y el flujo de pedidos vía WhatsApp — con humanos en el loop para todo lo que no cierra limpio.

**Demo (Fase 0 — sin backend):** https://babka-pfjxvdjt3-juliuscesarius-projects.vercel.app

---

## Qué hace el dashboard hoy (Fase 0)

| Página | Descripción |
|--------|------------|
| **Resumen** | Vista operativa por sucursal: estado de cierre, descuadres, revisiones pendientes, feed de actividad. Toggle Admin / CEO para cambiar entre vista operativa y ejecutiva. |
| **Conciliaciones** | Tablas de inventario por sucursal y destino. Anotaciones contextuales por fila y celda. Modal de detalle de celda con notas inline y CTA a Dante. |
| **Calendario** | Historial de cierres por fecha y sucursal. |
| **Revisión** | Cola de aprobaciones HITL ordenada por prioridad. Cada ítem muestra mensaje del agente, opciones de acción con radio buttons, trazabilidad completa e hipótesis del agente. |
| **WhatsApp** | Simulación del canal de conversación BABKA ↔ gerente. |
| **Clarisa AI** | Chat con mock de respuestas del agente. CTAs de revisiones pendientes cableados. |

Todos los datos son fixtures tipados en `src/fixtures/` — no hay backend ni secretos.

---

## Arquitectura objetivo (Fases 4+)

```
WhatsApp (Baileys)
      ↓
Orquestador LangGraph
      ↓              ↓
BABKA-Vitrina   BABKA-Checklist
      ↓
Supabase (BD + Auth + Storage)
      ↓
Dashboard React (Clarisa + dueños)
      ↑
  Revisiones (HITL Queue)
```

**Sucursales:** Centro · Norte · Montes Ame · Marista · Slowfood

---

## Fases de implementación

| Fase | Descripción | Estado |
|------|------------|--------|
| 0 · El cascarón | Dashboard navegable completo, datos falsos | ✅ Completo |
| 1 · Se siente vivo | UI reactiva con mock API (MSW) | Pendiente |
| 2 · Datos de verdad | Auth + Supabase + persistencia | Pendiente |
| 3 · Entra la realidad | Parser POS (SoftRestaurant XLS) + conciliación manual | Pendiente |
| 4 · Entra BABKA | Agente WhatsApp end-to-end + HITL | Pendiente |
| 5 · Segundo carril | Sub-agente Checklist + pedidos/distribución | Pendiente |
| 6 · El piloto | Autonomía de una sucursal × 5 días seguidos | Pendiente |
| 7+ · Aprende y se arregla | V2: Curator, Maintenance, FoodCost, Compras | Futuro |

Ver [`BABKA-implementation-plan.md`](./BABKA-implementation-plan.md) para el plan completo.

---

## Stack técnico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 18 + Vite 5 + TypeScript strict |
| Gráficas | Recharts |
| Base de datos | Supabase (PostgreSQL + Auth + Storage + pgvector) |
| Agente | LangGraph + Claude (Anthropic) |
| WhatsApp | Baileys |
| Tracing | LangSmith |
| Deploy | Vercel |

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
| Color firma | `--babka-blue` · `#1F5AD9` |
| Color acento | `--babka-orange` · `#DC7A33` |
| Fondo base | `--flour` · `#FFFFFF` |
| Texto principal | `--ink` · `#1A1714` |

**Tokens CSS:** `--space-N`, `--text-xs/sm/base/lg…`, `--r-sm/md/lg/pill`, `--z-modal: 300`

### Principios

- Bordes siempre redondeados (`--r-sm` 10px → `--r-pill` 999px). Jamás 0px.
- Sombras cálidas (`rgba(26,23,20,…)`). Nunca azuladas.
- Hover: `translateY(-3px)` en cards, `translateY(-1px)` en botones.
- Focus ring: siempre `--babka-blue`. Nunca amarillo (no pasa AA sobre blanco).
- Sin emojis en UI. Sin gradientes genéricos. Mucho aire blanco.
- Texto sobre `--wheat`: siempre `--ink`. Nunca blanco.

---

## Estructura del proyecto

```
babka/
├── README.md
├── BABKA-implementation-plan.md
├── design-system/           # Tokens CSS + componentes base
├── src/
│   ├── main.tsx
│   ├── App.tsx              # Estado global: role, page, chatContext
│   ├── fixtures/            # Datos falsos tipados (contrato de la API futura)
│   │   ├── branches.ts      # Sucursales, conciliaciones, HITL requests
│   │   ├── chat.ts          # Mensajes iniciales + respuestas mock
│   │   └── history.ts       # Snapshots históricos
│   ├── components/
│   │   ├── Layout.tsx       # Shell: Nav (desktop) / TopBar+BottomNav (mobile)
│   │   ├── Nav.tsx          # Sidebar desktop — sticky 100vh
│   │   ├── TopBar.tsx       # Header mobile/tablet + RoleToggle (exportado)
│   │   └── BottomNav.tsx    # Nav inferior mobile
│   ├── pages/
│   │   ├── Resumen.tsx      # Vista operativa + ejecutiva (CEO toggle)
│   │   ├── Conciliaciones.tsx # Tablas + anotaciones contextuales
│   │   ├── HITL.tsx         # Cola de revisiones con radio buttons
│   │   ├── AgentChat.tsx    # Chat Clarisa AI
│   │   ├── Calendario.tsx
│   │   └── WhatsAppSim.tsx
│   ├── hooks/
│   │   └── useBreakpoint.ts # isMobile (<640) · isTablet (640–1024) · isDesktop (≥1024)
│   └── types/               # Tipos TypeScript (= contrato Pydantic futuro)
├── package.json
└── vite.config.ts
```

---

## Desarrollo local

```bash
npm install
npm run dev
# → http://localhost:5173
```

No se necesita ningún secreto ni infraestructura. Todo corre con datos ficticios de `src/fixtures/`.

```bash
npm run build   # build de producción
npx vercel      # deploy a Vercel
```

---

## Contacto

- **Producto / dueños:** SOCO Mérida
- **Operadora principal:** Clarisa (usuario principal del dashboard)
- **Demo:** https://babka-pfjxvdjt3-juliuscesarius-projects.vercel.app
