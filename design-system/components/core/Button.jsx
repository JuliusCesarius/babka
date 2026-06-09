import React from 'react';

/**
 * Button variants follow the 60/20/10/10 proportion rule.
 * Primary = wheat background (CTA), secondary = blue, ghost = outlined, orange = spark accent.
 * NEVER white text on yellow. NEVER yellow focus ring.
 */
export function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon = null,
  iconPosition = 'left',
  children,
  onClick,
  type = 'button',
  fullWidth = false,
  ...rest
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontFamily: 'var(--font-body)',
    fontWeight: 'var(--weight-bold)',
    letterSpacing: 'var(--tracking-wide)',
    textTransform: 'uppercase',
    border: 'none',
    borderRadius: 'var(--r-pill)',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'background 0.3s var(--ease-out), color 0.3s var(--ease-out), box-shadow 0.3s var(--ease-out), transform 0.15s var(--ease-out)',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    outline: 'none',
    width: fullWidth ? '100%' : undefined,
    opacity: disabled ? 0.45 : 1,
  };

  const sizes = {
    sm: { fontSize: '11px', padding: '7px 16px', height: '32px' },
    md: { fontSize: '12px', padding: '10px 24px', height: '40px' },
    lg: { fontSize: '13px', padding: '13px 32px', height: '48px' },
  };

  const variants = {
    primary: {
      background: 'var(--wheat)',
      color: 'var(--ink)',
      boxShadow: 'var(--shadow-sm)',
    },
    secondary: {
      background: 'var(--babka-blue)',
      color: '#ffffff',
      boxShadow: 'var(--shadow-sm)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--ink)',
      border: '1.5px solid var(--ink)',
      boxShadow: 'none',
    },
    orange: {
      background: 'var(--babka-orange)',
      color: 'var(--ink)',
      boxShadow: 'var(--shadow-sm)',
    },
    subtle: {
      background: 'var(--crumb)',
      color: 'var(--ink)',
      boxShadow: 'none',
    },
  };

  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);

  const hoverStyles = hovered && !disabled && !loading ? {
    primary:   { background: 'var(--wheat-deep)', boxShadow: 'var(--shadow-md)', transform: 'translateY(-1px)' },
    secondary: { background: 'var(--babka-blue-deep)', boxShadow: 'var(--shadow-md)', transform: 'translateY(-1px)' },
    ghost:     { background: 'var(--ink)', color: '#fff' },
    orange:    { background: 'var(--babka-orange-deep)', boxShadow: 'var(--shadow-md)', transform: 'translateY(-1px)' },
    subtle:    { background: 'var(--line)' },
  }[variant] : {};

  const pressStyles = pressed && !disabled ? { transform: 'scale(0.97) translateY(0)', boxShadow: 'none' } : {};

  const style = {
    ...base,
    ...sizes[size],
    ...variants[variant],
    ...hoverStyles,
    ...pressStyles,
  };

  return (
    <button
      type={type}
      style={style}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      {...rest}
    >
      {loading && (
        <span style={{
          width: '14px', height: '14px', border: '2px solid currentColor',
          borderTopColor: 'transparent', borderRadius: '50%',
          display: 'inline-block', animation: 'babka-spin 0.7s linear infinite',
          flexShrink: 0,
        }} />
      )}
      {!loading && icon && iconPosition === 'left' && <span style={{ flexShrink: 0, display: 'flex' }}>{icon}</span>}
      {children}
      {!loading && icon && iconPosition === 'right' && <span style={{ flexShrink: 0, display: 'flex' }}>{icon}</span>}
      <style>{`@keyframes babka-spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}
