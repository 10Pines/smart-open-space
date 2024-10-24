import { Box, Text } from 'grommet';
import React from 'react';

export function TitleColumn({ datum }) {
  return (
    <Box direction="column">
      <Text weight="bold" color="dark-2">
        {datum.title}
      </Text>
      {datum.trackName ? (
        <Text weight="normal" color={datum.trackColor}>
          {datum.trackName}
        </Text>
      ) : (
        <Text weight="normal" color="gray">
          Sin track
        </Text>
      )}
    </Box>
  );
}
