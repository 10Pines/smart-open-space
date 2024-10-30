import React from 'react';
import { TextInput } from 'grommet';
import customTheme from '#app/theme';
import globalStyles from "#shared/styles/styles.js";

const Input = ({
                    placeholder = 'Input...',
                    value,
                    onChange,
                    icon,
                    ...props
                }) => {

    return (
        <TextInput
            placeholder={placeholder}
            value={value}
            onChange={event => {
                onChange(event.target.value)}
            }
            fill
            style={{ height: '2.5rem',
                width: '100%',
                border: `1px solid ${customTheme.global.colors.primary.light}`,
                padding: '8px 16px',
                ...globalStyles.meera
        }}
            borderRadius= '1px'
            icon= { icon }
            reverse
            {...props}
        />
    );
};

export default Input;
