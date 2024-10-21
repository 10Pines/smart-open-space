import { Box, Text } from 'grommet';
import React from 'react';

export function StateColumn(props) {
  return (
    <Box direction="column">
      <Box
        align="center"
        justify="center"
        background={props.datum.state === 'Agendada' ? '#b4e6e2' : '#AFB8AF'}
        round={'medium'}
        pad="small"
      >
        <Text color="black">{props.datum.state}</Text>
      </Box>
      {props.datum.talkDate && (
        <Box direction={'row-responsive'} gap="small">
          <Text weight="bold" size="xsmall">
            {props.datum.talkDate}
          </Text>
          <Text weight="bold" size="xsmall">
            {props.datum.talkStartTime}hs
          </Text>
        </Box>
      )}
    </Box>
  );
}
