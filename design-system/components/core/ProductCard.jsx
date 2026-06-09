import React from 'react';

/**
 * ProductCard — tarjeta de producto estilo empaque Babka.
 * Header con blobs orgánicos, kicker badge, título Fraunces, precio mono.
 */
export function ProductCard({
  name,
  description,
  price,
  unit = 'pieza',
  badge,
  badgeVariant = 'wheat',
  available = true,
  onOrder,
  accentColor = 'blue',
}) {
  const [hovered, setHovered] = React.useState(false);

  const blobColors = {
    blue:   { big: '#1F5AD9', mid: '#E6B23C', small: '#DC7A33' },
    wheat:  { big: '#E6B23C', mid: '#1F5AD9', small: '#DC7A33' },
    orange: { big: '#DC7A33', mid: '#1F5AD9', small: '#E6B23C' },
  }[accentColor] || { big: '#1F5AD9', mid: '#E6B23C', small: '#DC7A33' };

  const badgeStyles = {
    wheat:     { bg: 'var(--wheat)',         color: 'var(--ink)' },
    blue:      { bg: 'var(--babka-blue)',    color: '#fff' },
    'blue-soft':{ bg: 'var(--babka-blue-soft)', color: 'var(--babka-blue-deep)' },
    orange:    { bg: 'var(--babka-orange)',  color: 'var(--ink)' },
    crumb:     { bg: 'var(--crumb)',         color: 'var(--ink-soft)', border: '1px solid var(--line)' },
  };
  const bs = badgeStyles[badgeVariant] || badgeStyles.wheat;

  const cardStyle = {
    fontFamily: 'var(--font-body)',
    background: 'var(--flour)',
    borderRadius: 'var(--r-lg)',
    boxShadow: hovered ? 'var(--shadow-lg)' : 'var(--shadow-md)',
    transform: hovered ? 'translateY(-3px)' : 'none',
    transition: 'box-shadow 0.3s var(--ease-out), transform 0.3s var(--ease-out)',
    overflow: 'hidden',
    width: '240px',
    display: 'flex',
    flexDirection: 'column',
    opacity: available ? 1 : 0.6,
  };

  return (
    <div
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header con blobs */}
      <div style={{ position: 'relative', background: 'var(--flour-warm)', height: '130px', overflow: 'hidden' }}>
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 240 130" preserveAspectRatio="xMidYMid slice" fill="none">
          <path d="M20 -20 C60 -30 130 10 140 50 C150 90 110 130 70 138 C30 146 -20 120 -30 80 C-40 40 -20 -10 20 -20Z" fill={blobColors.big} opacity="0.9"/>
          <path d="M170 20 C195 15 225 35 228 60 C231 85 210 108 186 112 C162 116 138 98 136 74 C134 50 148 25 170 20Z" fill={blobColors.mid} opacity="0.85"/>
          <path d="M200 90 C214 85 230 95 232 110 C234 125 222 136 208 136 C194 136 183 124 184 110 C185 97 188 94 200 90Z" fill={blobColors.small} opacity="0.8"/>
        </svg>
        {badge && (
          <span style={{
            position: 'absolute', top: '12px', left: '12px',
            background: bs.bg, color: bs.color, border: bs.border,
            fontFamily: 'var(--font-body)', fontWeight: 700,
            fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase',
            padding: '4px 10px', borderRadius: 'var(--r-pill)',
          }}>
            {badge}
          </span>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '16px 18px 20px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--bran)' }}>
          {unit}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '22px', lineHeight: 1.1, color: 'var(--ink)', letterSpacing: '-0.02em' }}>
          {name}
        </div>
        {description && (
          <div style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.5 }}>
            {description}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '4px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '20px', fontWeight: 500, color: 'var(--ink)' }}>
            ${price}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--bran)' }}>MXN</span>
        </div>
        {onOrder && (
          <button
            onClick={available ? onOrder : undefined}
            disabled={!available}
            style={{
              marginTop: '8px',
              background: available ? 'var(--wheat)' : 'var(--crumb)',
              color: 'var(--ink)',
              border: 'none',
              borderRadius: 'var(--r-pill)',
              padding: '9px 0',
              width: '100%',
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              cursor: available ? 'pointer' : 'not-allowed',
              transition: 'background 0.3s var(--ease-out)',
            }}
          >
            {available ? 'Ordenar' : 'Agotado'}
          </button>
        )}
      </div>
    </div>
  );
}
