Botón de acción de Babka — siempre pill, texto uppercase DM Sans 700, WCAG AA garantizado.

```jsx
// CTA principal — wheat con texto ink
<Button variant="primary" size="md">Ordenar ahora</Button>

// Acción secundaria — azul cobalt con texto blanco
<Button variant="secondary">Ver menú</Button>

// Ghost — contorno tinta
<Button variant="ghost">Más info</Button>

// Chispa naranja — uso puntual
<Button variant="orange">¡Hoy último día!</Button>

// Con ícono
<Button variant="primary" icon={<ArrowRight size={16}/>} iconPosition="right">
  Explorar
</Button>

// Loading
<Button variant="primary" loading>Procesando...</Button>
```

**Variantes:** primary · secondary · ghost · orange · subtle
**Tamaños:** sm (32px) · md (40px) · lg (48px)
**Reglas WCAG:** botón primario NUNCA texto blanco sobre amarillo. Focus ring siempre azul.
