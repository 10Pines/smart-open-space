import React, {useState} from 'react';
import {Box, Select, Text, TextInput} from 'grommet';
import customTheme from '../../../App/theme';
import globalStyles from "#shared/styles/styles.js";
import {CaretDown, Down} from "grommet-icons";

const Dropdown = ({
                   children = 'Input...',
                   onChangeValue,
                   icon,
               }) => {
    const [value, setValue] = useState('');
    if (typeof children !== 'string') throw new Error('Children must be a string');

    return (
        <Box style={{
            width: '24rem',
            background: `${customTheme.global.colors.primary.light}`,
            borderRadius: '5px'
        }}>
            <Select
                options={['small', 'medium', 'large']}
                value={value}
                onChange={({ option }) => setValue(option)}
                placeholder={<Text color={customTheme.global.colors.background.light}
                                   size={customTheme.global.font.size}
                                   weight={600}
                margin={{left: "6px", top: "8px", bottom: "8px"}}>
                    Ordenar por
            </Text>
            }
                icon={<Down color={customTheme.global.colors.background.light}/>}
            />
        </Box>
    );
};

export default Dropdown;
