import { Box, Text } from 'grommet';
import React from 'react';

export function VotesColumn(props) {
  return (
    <Box
      align="center"
      justify="center"
      background={'#b4e6b4'}
      round="full"
      width="xxsmall"
      height="xxsmall"
    >
      <Text color="black">{props.datum.votes}</Text>
    </Box>
  );
}
