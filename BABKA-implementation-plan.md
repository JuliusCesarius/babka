# BABKA-002 · Plan de implementación por fases

**Enfoque:** UI-first → contract-first → mock-then-wire.
Construimos primero lo que Clarisa y los dueños *ven*, con datos falsos y sin backend. Las formas de esos datos mockeados se vuelven el contrato de la API. Después, fase por fase, reemplazamos cada mock por un cable real **sin tocar la UI**.

---

## Principio rector

1. **La UI define la interfaz.** Los fixtures de Fase 0 (tipos TypeScript) son la fuente de verdad del contrato. El backend luego implementa *hacia* ese contrato (los tipos TS se traducen a modelos Pydantic). No al revés.
2. **Cada fase es demostrable y deployable** por sí sola en `artifacts.dashone.ai`. Nunca hay un estado "a medias que no se puede enseñar".
3. **La BD entra tarde, a propósito.** El primer entregable no toca base de datos. El acceso a BD aparece hasta la Fase 2, cuando ya validamos que la UX es la correcta.
4. **El problema más difícil (sin SKUs) se valida con humanos antes de meter IA.** La Fase 3 prueba el modelo de datos y la conciliación con datos reales y sucios *antes* de que exista el agente.

---

## Resumen de fases

| Fase | Lo que el usuario ve | Cable que se conecta | ¿BD? | ¿Deployable? |
|---|---|---|---|---|
| 0 · El cascarón | Dashboard navegable completo, datos falsos, conversación WhatsApp simulada | Ninguno (se dibuja el contrato) | No | Sí |
| 1 · Se siente vivo | La misma UI pero reacciona: aprobar, filtrar, estados de carga | Frontend ↔ mock API | No | Sí |
| 2 · Datos de verdad | Login de Clarisa; los datos persisten; edición manual | Frontend ↔ Supabase | **Sí (primera vez)** | Sí |
| 3 · Entra la realidad | Subir XLS de POS, verlo parseado, conciliar a mano | POS files → eventos → conciliación | Sí | Sí |
| 4 · Entra BABKA | Mensaje/foto de WhatsApp → propuesta de conciliación → bandeja HITL | WhatsApp ↔ agente ↔ Supabase ↔ dashboard | Sí | Sí |
| 5 · Segundo carril | Flujo de pedidos/distribución también automatizado | Checklist sub-agent | Sí | Sí |
| 6 · El piloto | Una sucursal cerrando sola; reporte diario | Autonomía + escalamiento | Sí | Sí |
| 7+ · Aprende y se arregla | (V2) aprendizaje, auto-fix, más agentes | Curator, Maintenance, FoodCost, Compras | Sí | Sí |

---

## Fase 0 · El cascarón
**Meta:** que los dueños de SOCO puedan hacer clic en algo que se ve real, en una semana, sin infraestructura.

**Lo que el usuario ve:**
- **Resumen** — estado por sucursal (Centro, Norte, Montes Ame, Marista, Slowfood), inventario del día, semáforo de conciliación.
- **Conciliaciones** — lista + detalle con el desglose de destinos (vendido, traspaso, merma, personal, etc.) y la `diferencia` cerrando en cero.
- **Bandeja HITL** — cola de aprobaciones pendientes (descuadres, traspasos) como las vería Clarisa.
- **WhatsApp simulado** — el mockup de teléfono con la conversación del agente (reusamos el carrusel del diagnóstico) para *mostrar* cómo hablaría BABKA, aunque no exista todavía.

**Se construye:** React + Vite + TypeScript, design system SOCO (Fraunces / DM Sans / JetBrains Mono, 60-30-10), shadcn/ui, Recharts. Toda la data de `fixtures/*.ts`.

**NO se construye:** backend, BD, auth, agente. Nada persiste.

**Entregable:** URL pública clickeable en `artifacts.dashone.ai` para reacción de stakeholders. Este es el primer entregable.

---

## Fase 1 · Se siente vivo
**Meta:** que la UI responda como si tuviera backend, pero todo sigue en el navegador.

**Lo que el usuario ve:** aprobar un HITL y que desaparezca de la cola; filtrar conciliaciones; cambiar de sucursal; estados de carga y *optimistic updates*. Persistencia solo de sesión.

**Se construye:** capa de mock API (MSW – Mock Service Worker) que implementa el contrato; TanStack Query; estado de cliente; validación de formularios.

**NO se construye:** todavía sin BD ni agente.

**Cable:** frontend ↔ mock API. El contrato ahora es *ejecutable* — frontend y backend ya pueden avanzar en paralelo contra él.

---

## Fase 2 · Datos de verdad
**Meta:** primera vez que entra la base de datos.

**Lo que el usuario ve:** Clarisa inicia sesión; los datos persisten entre sesiones; puede crear/editar una conciliación manualmente en la UI.

**Se construye:** proyecto Supabase con el subconjunto V1 del schema (products, product_aliases, branches, users, orders/order_items, inventory_events, vitrina_snapshots, reconciliations/items, hitl_requests, audit_log); Supabase Auth; seed data; se reemplaza el mock API por el cliente de Supabase. La columna generada `diferencia` hace la aritmética.

**NO se construye:** ingestión ni agente.

**Cable:** frontend ↔ Supabase.

**Entregable:** dashboard real multi-usuario donde el equipo *podría* (en teoría) hacer la conciliación a mano.

---

## Fase 3 · Entra la realidad
**Meta:** validar el modelo de datos y la conciliación con datos reales y sucios — con humanos al control, antes de cualquier IA.

**Lo que el usuario ve:** sube un XLS de SoftRestaurant, lo ve parseado en eventos, ve poblarse una conciliación; Clarisa concilia a mano en la UI. Pantalla de **resolución de alias** (un string de producto desconocido → SKU canónico, con sugerencia de pgvector y confirmación humana).

**Se construye:** parser `pos_ingestion`, tabla `pos_imports` (batch + hash + dedupe), upload a Storage, el motor de conciliación (funciones puras) validado contra exports reales.

**NO se construye:** WhatsApp ni agente — los humanos manejan.

**Cable:** archivos POS → eventos en Supabase → vista de conciliación.

**Entregable:** prueba de que el modelo y la aritmética sobreviven los datos reales de SOCO. **Esto de-riesga lo más difícil (el problema de los nombres sin SKU) antes de sumar la complejidad del agente.**

---

## Fase 4 · Entra BABKA
**Meta:** el primer flujo end-to-end con agente, sobre una sola sucursal.

**Lo que el usuario ve:** un gerente manda un mensaje/foto por WhatsApp; aparece en el dashboard; BABKA propone una conciliación; un descuadre (`diferencia ≠ 0`) cae en la bandeja HITL que Clarisa ya conoce desde la Fase 0.

**Se construye:** gateway Baileys, orquestador LangGraph, resolución de identidad, ruteo de intención, sub-agente BABKA-Vitrina, visión para fotos (imagen → JSON), tracing en LangSmith, HITL cableado a la cola del dashboard que ya existe.

**NO se construye:** Checklist, aprendizaje, auto-fix.

**Cable:** WhatsApp ↔ Baileys ↔ orquestador ↔ Vitrina ↔ Supabase ↔ dashboard (HITL).

**Entregable:** flujo completo de cierre de vitrina en una sucursal.

---

## Fase 5 · Segundo carril
**Meta:** segundo dominio, mismo patrón.

**Lo que el usuario ve:** el flujo de pedidos/distribución también automatizado; distribución por sucursal rastreada.

**Se construye:** sub-agente BABKA-Checklist; flujos de orden y distribución.

**Cable:** mismo patrón hub-and-spoke, segundo sub-agente registrado.

---

## Fase 6 · El piloto
**Meta:** alcanzar la métrica de éxito de V1.

**Lo que el usuario ve:** la conciliación de una sucursal cerrando de forma autónoma; un reporte diario (WhatsApp + email).

**Se construye:** reglas de autonomía (BR-3: solo auto-cerrar cuando `diferencia = 0`), hooks de escalamiento (reporte diario vía SendGrid/Resend), Sentry, instrumentación del piloto para medir "5 días consecutivos".

**Entregable:** **una sucursal concilia sola 5 días seguidos** — la métrica de éxito definida en el spec.

---

## Fase 7+ · Aprende y se arregla (V2)
Diferido, ya especificado en BABKA-001:
- **Curator** — loop de aprendizaje (feedback namespaced, eval-gated).
- **Maintenance** — auto-fix vía Claude Code + PR + merge de superadmin humano.
- **FoodCost / Compras** — nuevos sub-agentes bajo el contrato `BabkaSubAgent`.
- **WhatsApp Business API** y **SoftRestaurant directo a BD** — upgrades de capa, sin tocar el backend.

---

## Notas de ejecución

- **Paralelización:** después de la Fase 0 el contrato queda fijo. A partir de ahí, el pulido del frontend y la construcción del backend (Fases 2–4) corren en paralelo contra ese contrato. Una persona en UI, otra en agente.
- **Cuándo entra la BD:** explícitamente en la Fase 2. Las Fases 0–1 son 100% frontend deployable sin secretos ni infraestructura.
- **Qué reusamos de lo ya hecho:** el design system SOCO (ya finalizado), el mockup de teléfono WhatsApp del diagnóstico (para la pantalla "WhatsApp simulado" de Fase 0), y la infraestructura de publicación `dashone-publish` → `artifacts.dashone.ai`.
- **Orden de validación de riesgo:** UX (Fase 0–1) → datos sucios/SKUs (Fase 3) → agente (Fase 4). Lo más incierto de cada tipo se prueba lo antes posible.
