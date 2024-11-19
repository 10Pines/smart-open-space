import {Box, RadioButtonGroup} from "grommet";
import React from "react";
import customTheme from "#app/theme.js";

const ColorPicker = ({
                   onChange = (e) => {},
                    value,
                   ...props
               }) => {
    
    const themeColors = customTheme.global.colors;
    const colors = [
        themeColors['card-purple'].light,
        themeColors['card-pink'].light,
        themeColors['card-yellow'].light,
        themeColors['card-green'].light,
        themeColors['card-blue'].light,
    ];

    return (
        <RadioButtonGroup
             name={'colorPicker'}
             options={colors}
             direction={'row'}
             onChange={(e) => onChange(e.target.value)}
             children={(option, { checked, hover }) =>
                 <Box
                    background={option}
                    border = {{
                            color: "black",
                            size: checked ? "2px" : "0px",
                            side: "all"
                        }}
                    width={'25px'}
                    height={'25px'}
                    style={ {borderRadius: '50%' }}
                 />
                }
             {...props}
        />
    );
};

export default ColorPicker;
