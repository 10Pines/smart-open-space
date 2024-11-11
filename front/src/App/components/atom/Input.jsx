import React, { useState } from 'react';
import { Box, TextArea, TextInput } from 'grommet';
import customTheme from '#app/theme';
import globalStyles from '#shared/styles/styles.js';

const Input = ({
  label,
  placeholder = 'Input...',
  value,
  onChange,
  icon,
  multiline,
  resize = 'vertical',
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const Input = multiline ? TextArea : TextInput;

  return (
    <Box
      style={{
        position: 'relative',
        width: '100%',
      }}
    >
      {label && (
        <label
          style={{
            position: 'absolute',
            top: isFocused || value ? '0px' : !multiline ? '50%' : '24px',
            left: '16px',
            fontSize: isFocused || value ? '0.75rem' : '1rem',
            color: isFocused || value ? customTheme.global.colors.primary.light : '#666',
            backgroundColor: isFocused || value ? 'white' : 'transparent',
            padding: isFocused || value ? '0 4px' : '0',
            transform: isFocused || value ? 'translateY(-50%)' : 'translateY(-50%)',
            transition: '0.2s ease all',
            pointerEvents: 'none',
            zIndex: 1,
          }}
        >
          {label}
        </label>
      )}
      <Input
        placeholder={!isFocused && label ? '' : placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        fill
        style={{
          width: '100%',
          border: `1px solid ${customTheme.global.colors.primary.light}`,
          padding: '12px 16px',
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
