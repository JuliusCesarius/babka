export interface InputProps {
  /** Label visible encima del campo */
  label?: string;
  /** Texto de ayuda debajo del campo */
  hint?: string;
  /** Mensaje de error — toma color naranja */
  error?: string;
  /** id HTML del input */
  id?: string;
  /** HTML input type */
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'search' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  /** Prefijo visual (ej. "$", "+52") */
  prefix?: React.ReactNode;
  /** Sufijo visual (ej. "MXN", icono) */
  suffix?: React.ReactNode;
  required?: boolean;
}
