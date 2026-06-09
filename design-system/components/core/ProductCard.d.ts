export interface ProductCardProps {
  /** Nombre del producto — Fraunces 900 */
  name: string;
  /** Descripción corta — DM Sans regular */
  description?: string;
  /** Precio en MXN (solo número) */
  price: number | string;
  /** Unidad de venta — "pieza", "kilo", "paquete" */
  unit?: string;
  /** Texto del badge encima de los blobs */
  badge?: string;
  /** Variante de color del badge */
  badgeVariant?: 'wheat' | 'blue' | 'blue-soft' | 'orange' | 'crumb';
  /** Si está disponible para ordenar */
  available?: boolean;
  /** Callback del botón Ordenar */
  onOrder?: () => void;
  /** Color dominante del header de blobs */
  accentColor?: 'blue' | 'wheat' | 'orange';
}
