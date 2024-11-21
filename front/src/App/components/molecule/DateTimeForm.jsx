import React from "react";
import {Box, Text} from "grommet";
import DateTimePicker from "../atom/DateTimePicker.jsx";

const DateTimeForm = ({ title, value, onChange, ...props }) => {
    return (
      <Box
        style={{ backgroundColor: '#3F8880', borderRadius: '5px' }}
        width={'390px'}
        height={'130px'}
        direction="column"
        {...props}
      >
        <Text color={'white'} weight={'bold'} style={{ padding: '10px 10px 10px 17px' }}>
          {title}
        </Text>
        <Box alignSelf={'center'} margin={{ top: 'xsmall' }}>
          <DateTimePicker
            onChange={(date) => {
              onChange(new Date(date));
            }}
            value={value}
            primary={true}
            alignSelf={'center'}
            minDate={props.minDate ? props.minDate : null}
            maxDate={props.maxDate ? props.maxDate : null}
          />
        </Box>
      </Box>
    );
};

export default DateTimeForm;
