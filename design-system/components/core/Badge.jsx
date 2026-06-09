import React from 'react';

/**
 * Badge — etiqueta de estado, categoría o atributo.
 * Siempre pill. Texto DM Sans medium uppercase small con letter-spacing amplio.
 */
export function Badge({
  variant = 'wheat',
  size = 'md',
  dot = false,
  children,
  ...rest
}) {
  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    fontFamily: 'var(--font-body)',
    fontWeight: 'var(--weight-medium)',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    borderRadius: 'var(--r-pill)',
    whiteSpace: 'nowrap',
    lineHeight: 1,
  };

  const sizes = {
    sm: { fontSize: '10px', padding: '3px 10px' },
    md: { fontSize: '11px', padding: '5px 12px' },
    lg: { fontSize: '12px', padding: '6px 16px' },
  };

  const variants = {
    wheat:      { background: 'var(--wheat)',        color: 'var(--ink)' },
    'wheat-light': { background: 'var(--wheat-light)', color: 'var(--ink)', border: '1px solid var(--wheat)' },
    blue:       { background: 'var(--babka-blue)',   color: '#ffffff' },
    'blue-soft':{ background: 'var(--babka-blue-soft)', color: 'var(--babka-blue-deep)' },
    orange:     { background: 'var(--babka-orange)', color: 'var(--ink)' },
    crust:      { background: 'var(--crust)',        color: '#ffffff' },
    crumb:      { background: 'var(--crumb)',        color: 'var(--ink-soft)', border: '1px solid var(--line)' },
    ink:        { background: 'var(--ink)',          color: '#ffffff' },
  };

  const style = { ...base, ...sizes[size], ...variants[variant] };

  return (
    <span style={style} {...rest}>
      {dot && (
        <span style={{
          width: size === 'sm' ? '5px' : '6px',
          height: size === 'sm' ? '5px' : '6px',
          borderRadius: '50%',
          background: 'currentColor',
          opacity: 0.7,
          flexShrink: 0,
        }} />
      )}
      {children}
    </span>
  );
}
