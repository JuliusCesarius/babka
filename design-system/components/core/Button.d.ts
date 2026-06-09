/**
 * @startingPoint section="Components" subtitle="CTA principal, secundario, ghost y naranja — estilos WCAG AA" viewport="700x280"
 */
export interface ButtonProps {
  /** Visual style. primary=wheat/ink, secondary=blue/white, ghost=outlined, orange=spark, subtle=crumb bg */
  variant?: 'primary' | 'secondary' | 'ghost' | 'orange' | 'subtle';
  /** Size preset */
  size?: 'sm' | 'md' | 'lg';
  /** Disabled state — reduces opacity, blocks interaction */
  disabled?: boolean;
  /** Loading state — shows spinner, blocks interaction */
  loading?: boolean;
  /** Optional icon node rendered inside the button */
  icon?: React.ReactNode;
  /** Icon position relative to label */
  iconPosition?: 'left' | 'right';
  /** Stretch button to container width */
  fullWidth?: boolean;
  /** Click handler */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** HTML button type */
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
}
