import {Box, Text} from "grommet";
import React from "react";
import {ClockIcon} from "#shared/icons.jsx";

const ScheduleItem = ({ children, Icon = ClockIcon }) => {
  return (
    <Box direction="row-responsive" gap="xsmall" align="center" justify="center">
      <Icon size="1rem" color={"rgb(125, 76, 219)"}/>
      <Text size="medium">
        {children}
      </Text>
    </Box>
  )
}

export default ScheduleItem;
