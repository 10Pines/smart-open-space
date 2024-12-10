import React, { useState } from 'react';
import { Box, TextArea, TextInput } from 'grommet';
import customTheme from '#app/theme';
import globalStyles from '#shared/styles/styles.js';

const Input = ({
  label,
  inputLabel,
  placeholder = 'Input...',
  value,
  onChange,
  icon,
    formField = false,
  multiline,
  resize = 'vertical',
  primary = true,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const InputComponent = multiline ? TextArea : TextInput;
  const newLabel = label || inputLabel;

  return (
    <Box
      style={{
        position: 'relative',
        width: '100%',
        display: 'inline-block',
      }}
    >
      {newLabel && (
        <label
          style={{
            position: 'absolute',
            top: isFocused || value ? '0px' : !multiline ? '50%' : '24px',
            left: '16px',
            fontSize: isFocused || value ? '0.75rem' : '1rem',
            color:
              isFocused || value
                ? primary
                  ? customTheme.global.colors.primary.light
                  : 'white'
                : primary
                ? '#666'
                : 'lightgrey',
            backgroundColor:
              isFocused || value
                ? primary
                  ? 'white'
                  : customTheme.global.colors.primary.light
                : 'transparent',
            padding: isFocused || value ? '0 4px' : '0',
            transform: isFocused || value ? 'translateY(-50%)' : 'translateY(-50%)',
            transition: '0.2s ease all',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          {newLabel}
        </label>
      )}
      <InputComponent
        placeholder={!isFocused && newLabel ? '' : placeholder}
        value={value}
        onChange={(event) => onChange(formField ? event : event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        fill
        style={{
          width: '100%',
          border: `1px solid ${
            primary
              ? customTheme.global.colors.primary.light
              : customTheme.global.colors.background.light
          }`,
          padding: '12px 16px',
          color: primary ? 'inherit' : 'white',
          ...globalStyles.meera,
        }}
        icon={icon}
        reverse
        resize={multiline ? resize : undefined}
        {...props}
      />
    </Box>
  );
};

export default Input;
