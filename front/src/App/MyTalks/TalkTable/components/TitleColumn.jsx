import { Box, Text } from 'grommet';
import React from 'react';

export function TitleColumn({ datum }) {
  return (
    <Box direction="column">
      <Text weight="bold" color="dark-2">
        {datum.title}
      </Text>
      <Text weight="normal" color="gray">
        {datum.authorName}
      </Text>
    </Box>
  );
}
