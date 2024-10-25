import React, {useState} from 'react';
import {Box, Button as GrommetButton, Spinner, Text, TextInput} from 'grommet';
import customTheme from '../../../App/theme';
import globalStyles from "#shared/styles/styles.js";
import {ClockIcon} from "#shared/icons.jsx";

const Input = ({
                    children = 'Input...',
                    onClick = () => {},
                    loading = false,
                    icon,
                    ...props
                }) => {
    const [value, setValue] = useState('');
    if (typeof children !== 'string') throw new Error('Children must be a string');

    return (
        <TextInput
            placeholder={children}
            value={value}
            onChange={event => setValue(event.target.value)}
            fill
            width={'medium'}
            style={{ height: '2.5rem',
                width: '24rem',
                border: `1px solid ${customTheme.global.colors.primary.light}`,
                padding: '8px 40px 8px 16px',
                ...globalStyles.meera
        }}
            borderRadius= '1px'
            icon= {icon &&
                <Box style={{ paddingLeft: '21rem' }}>
                    {icon}
                </Box>
            }
        />
    );
};

export default Input;
