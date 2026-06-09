export interface BadgeProps {
  /** Color variant — wheat=primario, blue=firma, orange=chispa, crust/crumb=neutros */
  variant?: 'wheat' | 'wheat-light' | 'blue' | 'blue-soft' | 'orange' | 'crust' | 'crumb' | 'ink';
  /** Size preset */
  size?: 'sm' | 'md' | 'lg';
  /** Show a small dot before the label */
  dot?: boolean;
  children: React.ReactNode;
}
