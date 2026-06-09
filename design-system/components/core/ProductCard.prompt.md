Tarjeta de producto estilo empaque Babka — header con blobs orgánicos, kicker, título Fraunces 900, precio mono.

```jsx
<ProductCard
  name="Pan de Caja"
  description="Masa madre de largo proceso, corteza crujiente."
  price={85}
  unit="pieza"
  badge="Pan de hoy"
  badgeVariant="wheat"
  accentColor="blue"
  available={true}
  onOrder={() => alert('Pedido!')}
/>

// Agotado
<ProductCard name="Focaccia" price={95} available={false} badge="Agotado" badgeVariant="crumb" />

// Acento naranja
<ProductCard name="Babka dulce" price={110} accentColor="orange" badge="¡Especial!" badgeVariant="orange" />
```

**accentColor:** determina el blob dominante del header (blue · wheat · orange).
**onOrder:** si se omite, no se renderiza el botón.
