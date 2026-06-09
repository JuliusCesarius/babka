import React from 'react';

/**
 * Input — campo de texto con focus ring azul (WCAG AA).
 * Fondo flour-warm, borde line, radio --r-md.
 */
export function Input({
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
    width: '100%',
  };

  const labelStyle = {
    fontSize: '12px',
    fontWeight: 'var(--weight-medium)',
    color: 'var(--ink)',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
  };

  const fieldWrap = {
    display: 'flex',
    alignItems: 'center',
    background: disabled ? 'var(--crumb)' : 'var(--flour-warm)',
    border: `1.5px solid ${error ? 'var(--babka-orange)' : focused ? 'var(--babka-blue)' : 'var(--line)'}`,
    borderRadius: 'var(--r-md)',
    boxShadow: focused ? '0 0 0 3px var(--babka-blue-soft)' : 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s',
    overflow: 'hidden',
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
    cursor: disabled ? 'not-allowed' : 'text',
  };

  const affixStyle = {
    padding: '0 12px',
    color: 'var(--bran)',
    fontSize: 'var(--text-sm)',
    fontFamily: 'var(--font-mono)',
    background: 'var(--crumb)',
    alignSelf: 'stretch',
    display: 'flex',
    alignItems: 'center',
  };

  const hintStyle = {
    fontSize: 'var(--text-xs)',
    color: error ? 'var(--babka-orange-deep)' : 'var(--bran)',
  };

  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div style={wrapStyle}>
      {label && (
        <label htmlFor={inputId} style={labelStyle}>
          {label}{required && <span style={{ color: 'var(--babka-orange)', marginLeft: '3px' }}>*</span>}
        </label>
      )}
      <div style={fieldWrap}>
        {prefix && <span style={{ ...affixStyle, borderRight: '1px solid var(--line)' }}>{prefix}</span>}
        <input
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          style={inputStyle}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {suffix && <span style={{ ...affixStyle, borderLeft: '1px solid var(--line)' }}>{suffix}</span>}
      </div>
      {(hint || error) && (
        <span style={hintStyle}>{error || hint}</span>
      )}
    </div>
  );
}
