import React from 'react';
import { Box, Select, Text } from 'grommet';
import customTheme from '../../../App/theme';
import { Down } from "grommet-icons";

const SelectDropdown = ({
                   defaultMessage = 'Ordenar por',
                    value,
                   onChangeValue,
                   options = [],
                   icon,
                    ...props
               }) => {

    return (
        <Box style={{
            width: '100%',
            background: `${customTheme.global.colors.primary.light}`,
            borderRadius: '5px'
        }}>
            <Select
                options={options}
                value={value}
                onChange={({ option }) => onChangeValue(option)}
                placeholder={<Text color={customTheme.global.colors.background.light}
                                   size={customTheme.global.font.size}
                                   weight={600}
                            >
                                {defaultMessage}
                            </Text>
                            }
                icon={<Down color={customTheme.global.colors.background.light}  />}
                {...props}
            />
        </Box>
    );
};

export default SelectDropdown;
