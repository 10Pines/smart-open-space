import { Box, Text } from 'grommet';
import React from 'react';
import { CalendarIcon, ClockIcon, HomeIcon } from '#shared/icons';

export function StateColumn(props) {
  return (
    <Box direction="column">
      <Box
        align="center"
        justify="center"
        background={props.datum.state === 'Agendada' ? '#b4e6e2' : '#AFB8AF'}
        round="medium"
        pad="small"
      >
        <Text color="black">{props.datum.state}</Text>
      </Box>
      {props.datum.talkDate && (
        <Box direction="column">
          <Box direction="row-responsive" gap="xsmall" align="center" justify="center">
            <CalendarIcon size="small" />
            <Text weight="bold" size="xsmall">
              {props.datum.talkDate}
            </Text>
          </Box>
          <Box direction="row-responsive" gap="xsmall" align="center" justify="center">
            <ClockIcon size="small" />
            <Text weight="bold" size="xsmall">
              {props.datum.talkStartTime}hs
            </Text>
            <HomeIcon size="small" />
            <Text weight="bold" size="small" truncate>
              {props.datum.room}
            </Text>
          </Box>
        </Box>
      )}
    </Box>
  );
}
