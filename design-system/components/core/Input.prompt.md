Campo de texto con focus ring azul WCAG AA, label uppercase DM Sans, hint/error debajo.

```jsx
// Básico
<Input label="Tu nombre" placeholder="e.g. Lucía" />

// Con prefijo moneda
<Input label="Precio" prefix="$" suffix="MXN" type="number" />

// Error state
<Input label="Correo" error="Ingresa un correo válido" value="no-válido" />

// Deshabilitado
<Input label="Código de pedido" disabled value="BABKA-2026-001" />
```

Focus ring azul (nunca amarillo). Error en naranja. Borde --line en reposo, --babka-blue en focus.
