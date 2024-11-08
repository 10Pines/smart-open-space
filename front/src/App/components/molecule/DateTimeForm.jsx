import React from "react";
import {Box, Text} from "grommet";
import DateTimePicker from "../atom/DateTimePicker.jsx";

const DateTimeForm = ({ title, value, onChange, ...props }) => {
    return (
        <Box style={{backgroundColor: "#3F8880", borderRadius: '5px'}}
             width={'390px'}
             height={'130px'}
             direction='column'
             {...props}
        >
            <Text color={"white"} style={{padding: '10px 10px 10px 17px'}}>{title}</Text>
            <DateTimePicker onChange={(date)=>{onChange(date)}} value={value} primary={true} alignSelf={"center"}/>
        </Box>
    );
};

export default DateTimeForm;
