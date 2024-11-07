import React from "react";
import {Box, Text} from "grommet";
import customTheme from "#app/theme.js";
import DateTimePicker from "../atom/DateTimePicker.jsx";

const DateTimeForm = ({ title, value, onChange, ...props }) => {
    return (
        <Box
            width={'390px'}
            height={'160px'}
            background={customTheme.global.colors.primary.light}
            border={{color: '#3F8880', size: "1px"}}
            style={{borderRadius: '5px'}}
            direction='column'
        >
            <Text>{title}</Text>
            <DateTimePicker onChange={onChange} value={value} alignSelf="center"/>
        </Box>
    );
};

export default DateTimeForm;
