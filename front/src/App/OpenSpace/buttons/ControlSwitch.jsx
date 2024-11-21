import Switch from "react-switch";
import {Box, Text} from "grommet";
import React from "react";

const ControlSwitch = ({ onChange, checked, text }) => {
  return (
    <Box direction={"row"} gap="xsmall">
      <Switch onChange={onChange} checked={checked}/>
      <Text>{text}</Text>
    </Box>
  )
}

export default ControlSwitch;
