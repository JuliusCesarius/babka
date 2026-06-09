/* @ds-bundle: {"format":3,"namespace":"BabkaDesignSystem_9af84f","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"ProductCard","sourcePath":"components/core/ProductCard.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"78a73689d0bf","components/core/Button.jsx":"b61f7bd97f77","components/core/Input.jsx":"85bf3c3d7546","components/core/ProductCard.jsx":"233832d51a76"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.BabkaDesignSystem_9af84f = window.BabkaDesignSystem_9af84f || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Badge — etiqueta de estado, categoría o atributo.
 * Siempre pill. Texto DM Sans medium uppercase small con letter-spacing amplio.
 */
function Badge({
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
    lineHeight: 1
  };
  const sizes = {
    sm: {
      fontSize: '10px',
      padding: '3px 10px'
    },
    md: {
      fontSize: '11px',
      padding: '5px 12px'
    },
    lg: {
      fontSize: '12px',
      padding: '6px 16px'
    }
  };
  const variants = {
    wheat: {
      background: 'var(--wheat)',
      color: 'var(--ink)'
    },
    'wheat-light': {
      background: 'var(--wheat-light)',
      color: 'var(--ink)',
      border: '1px solid var(--wheat)'
    },
    blue: {
      background: 'var(--babka-blue)',
      color: '#ffffff'
    },
    'blue-soft': {
      background: 'var(--babka-blue-soft)',
      color: 'var(--babka-blue-deep)'
    },
    orange: {
      background: 'var(--babka-orange)',
      color: 'var(--ink)'
    },
    crust: {
      background: 'var(--crust)',
      color: '#ffffff'
    },
    crumb: {
      background: 'var(--crumb)',
      color: 'var(--ink-soft)',
      border: '1px solid var(--line)'
    },
    ink: {
      background: 'var(--ink)',
      color: '#ffffff'
    }
  };
  const style = {
    ...base,
    ...sizes[size],
    ...variants[variant]
  };
  return /*#__PURE__*/React.createElement("span", _extends({
    style: style
  }, rest), dot && /*#__PURE__*/React.createElement("span", {
    style: {
      width: size === 'sm' ? '5px' : '6px',
      height: size === 'sm' ? '5px' : '6px',
      borderRadius: '50%',
      background: 'currentColor',
      opacity: 0.7,
      flexShrink: 0
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Button variants follow the 60/20/10/10 proportion rule.
 * Primary = wheat background (CTA), secondary = blue, ghost = outlined, orange = spark accent.
 * NEVER white text on yellow. NEVER yellow focus ring.
 */
function Button({
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
    opacity: disabled ? 0.45 : 1
  };
  const sizes = {
    sm: {
      fontSize: '11px',
      padding: '7px 16px',
      height: '32px'
    },
    md: {
      fontSize: '12px',
      padding: '10px 24px',
      height: '40px'
    },
    lg: {
      fontSize: '13px',
      padding: '13px 32px',
      height: '48px'
    }
  };
  const variants = {
    primary: {
      background: 'var(--wheat)',
      color: 'var(--ink)',
      boxShadow: 'var(--shadow-sm)'
    },
    secondary: {
      background: 'var(--babka-blue)',
      color: '#ffffff',
      boxShadow: 'var(--shadow-sm)'
    },
    ghost: {
      background: 'transparent',
      color: 'var(--ink)',
      border: '1.5px solid var(--ink)',
      boxShadow: 'none'
    },
    orange: {
      background: 'var(--babka-orange)',
      color: 'var(--ink)',
      boxShadow: 'var(--shadow-sm)'
    },
    subtle: {
      background: 'var(--crumb)',
      color: 'var(--ink)',
      boxShadow: 'none'
    }
  };
  const [hovered, setHovered] = React.useState(false);
  const [pressed, setPressed] = React.useState(false);
  const hoverStyles = hovered && !disabled && !loading ? {
    primary: {
      background: 'var(--wheat-deep)',
      boxShadow: 'var(--shadow-md)',
      transform: 'translateY(-1px)'
    },
    secondary: {
      background: 'var(--babka-blue-deep)',
      boxShadow: 'var(--shadow-md)',
      transform: 'translateY(-1px)'
    },
    ghost: {
      background: 'var(--ink)',
      color: '#fff'
    },
    orange: {
      background: 'var(--babka-orange-deep)',
      boxShadow: 'var(--shadow-md)',
      transform: 'translateY(-1px)'
    },
    subtle: {
      background: 'var(--line)'
    }
  }[variant] : {};
  const pressStyles = pressed && !disabled ? {
    transform: 'scale(0.97) translateY(0)',
    boxShadow: 'none'
  } : {};
  const style = {
    ...base,
    ...sizes[size],
    ...variants[variant],
    ...hoverStyles,
    ...pressStyles
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    style: style,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => {
      setHovered(false);
      setPressed(false);
    },
    onMouseDown: () => setPressed(true),
    onMouseUp: () => setPressed(false)
  }, rest), loading && /*#__PURE__*/React.createElement("span", {
    style: {
      width: '14px',
      height: '14px',
      border: '2px solid currentColor',
      borderTopColor: 'transparent',
      borderRadius: '50%',
      display: 'inline-block',
      animation: 'babka-spin 0.7s linear infinite',
      flexShrink: 0
    }
  }), !loading && icon && iconPosition === 'left' && /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      display: 'flex'
    }
  }, icon), children, !loading && icon && iconPosition === 'right' && /*#__PURE__*/React.createElement("span", {
    style: {
      flexShrink: 0,
      display: 'flex'
    }
  }, icon), /*#__PURE__*/React.createElement("style", null, `@keyframes babka-spin { to { transform: rotate(360deg); } }`));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Input — campo de texto con focus ring azul (WCAG AA).
 * Fondo flour-warm, borde line, radio --r-md.
 */
function Input({
  label,
  hint,
  error,
  id,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  prefix,
  suffix,
  required = false,
  ...rest
}) {
  const [focused, setFocused] = React.useState(false);
  const wrapStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontFamily: 'var(--font-body)',
    width: '100%'
  };
  const labelStyle = {
    fontSize: '12px',
    fontWeight: 'var(--weight-medium)',
    color: 'var(--ink)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase'
  };
  const fieldWrap = {
    display: 'flex',
    alignItems: 'center',
    background: disabled ? 'var(--crumb)' : 'var(--flour-warm)',
    border: `1.5px solid ${error ? 'var(--babka-orange)' : focused ? 'var(--babka-blue)' : 'var(--line)'}`,
    borderRadius: 'var(--r-md)',
    boxShadow: focused ? '0 0 0 3px var(--babka-blue-soft)' : 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    overflow: 'hidden'
  };
  const inputStyle = {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    padding: '10px 14px',
    fontSize: 'var(--text-base)',
    fontFamily: 'var(--font-body)',
    color: disabled ? 'var(--bran)' : 'var(--ink)',
    cursor: disabled ? 'not-allowed' : 'text'
  };
  const affixStyle = {
    padding: '0 12px',
    color: 'var(--bran)',
    fontSize: 'var(--text-sm)',
    fontFamily: 'var(--font-mono)',
    background: 'var(--crumb)',
    alignSelf: 'stretch',
    display: 'flex',
    alignItems: 'center'
  };
  const hintStyle = {
    fontSize: 'var(--text-xs)',
    color: error ? 'var(--babka-orange-deep)' : 'var(--bran)'
  };
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  return /*#__PURE__*/React.createElement("div", {
    style: wrapStyle
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: labelStyle
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--babka-orange)',
      marginLeft: '3px'
    }
  }, "*")), /*#__PURE__*/React.createElement("div", {
    style: fieldWrap
  }, prefix && /*#__PURE__*/React.createElement("span", {
    style: {
      ...affixStyle,
      borderRight: '1px solid var(--line)'
    }
  }, prefix), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: type,
    placeholder: placeholder,
    value: value,
    onChange: onChange,
    disabled: disabled,
    required: required,
    style: inputStyle,
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false)
  }, rest)), suffix && /*#__PURE__*/React.createElement("span", {
    style: {
      ...affixStyle,
      borderLeft: '1px solid var(--line)'
    }
  }, suffix)), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: hintStyle
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/ProductCard.jsx
try { (() => {
/**
 * ProductCard — tarjeta de producto estilo empaque Babka.
 * Header con blobs orgánicos, kicker badge, título Fraunces, precio mono.
 */
function ProductCard({
  name,
  description,
  price,
  unit = 'pieza',
  badge,
  badgeVariant = 'wheat',
  available = true,
  onOrder,
  accentColor = 'blue'
}) {
  const [hovered, setHovered] = React.useState(false);
  const blobColors = {
    blue: {
      big: '#1F5AD9',
      mid: '#E6B23C',
      small: '#DC7A33'
    },
    wheat: {
      big: '#E6B23C',
      mid: '#1F5AD9',
      small: '#DC7A33'
    },
    orange: {
      big: '#DC7A33',
      mid: '#1F5AD9',
      small: '#E6B23C'
    }
  }[accentColor] || {
    big: '#1F5AD9',
    mid: '#E6B23C',
    small: '#DC7A33'
  };
  const badgeStyles = {
    wheat: {
      bg: 'var(--wheat)',
      color: 'var(--ink)'
    },
    blue: {
      bg: 'var(--babka-blue)',
      color: '#fff'
    },
    'blue-soft': {
      bg: 'var(--babka-blue-soft)',
      color: 'var(--babka-blue-deep)'
    },
    orange: {
      bg: 'var(--babka-orange)',
      color: 'var(--ink)'
    },
    crumb: {
      bg: 'var(--crumb)',
      color: 'var(--ink-soft)',
      border: '1px solid var(--line)'
    }
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
    opacity: available ? 1 : 0.6
  };
  return /*#__PURE__*/React.createElement("div", {
    style: cardStyle,
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      background: 'var(--flour-warm)',
      height: '130px',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%'
    },
    viewBox: "0 0 240 130",
    preserveAspectRatio: "xMidYMid slice",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 -20 C60 -30 130 10 140 50 C150 90 110 130 70 138 C30 146 -20 120 -30 80 C-40 40 -20 -10 20 -20Z",
    fill: blobColors.big,
    opacity: "0.9"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M170 20 C195 15 225 35 228 60 C231 85 210 108 186 112 C162 116 138 98 136 74 C134 50 148 25 170 20Z",
    fill: blobColors.mid,
    opacity: "0.85"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M200 90 C214 85 230 95 232 110 C234 125 222 136 208 136 C194 136 183 124 184 110 C185 97 188 94 200 90Z",
    fill: blobColors.small,
    opacity: "0.8"
  })), badge && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: '12px',
      left: '12px',
      background: bs.bg,
      color: bs.color,
      border: bs.border,
      fontFamily: 'var(--font-body)',
      fontWeight: 700,
      fontSize: '10px',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      padding: '4px 10px',
      borderRadius: 'var(--r-pill)'
    }
  }, badge)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 18px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '10px',
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: 'var(--bran)'
    }
  }, unit), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-display)',
      fontWeight: 900,
      fontSize: '22px',
      lineHeight: 1.1,
      color: 'var(--ink)',
      letterSpacing: '-0.02em'
    }
  }, name), description && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: '13px',
      color: 'var(--ink-soft)',
      lineHeight: 1.5
    }
  }, description), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: '4px',
      marginTop: '4px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: '20px',
      fontWeight: 500,
      color: 'var(--ink)'
    }
  }, "$", price), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: '11px',
      color: 'var(--bran)'
    }
  }, "MXN")), onOrder && /*#__PURE__*/React.createElement("button", {
    onClick: available ? onOrder : undefined,
    disabled: !available,
    style: {
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
      transition: 'background 0.3s var(--ease-out)'
    }
  }, available ? 'Ordenar' : 'Agotado')));
}
Object.assign(__ds_scope, { ProductCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/ProductCard.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.ProductCard = __ds_scope.ProductCard;

})();
