import { Box, Text } from 'grommet';
import React from 'react';

export function TitleColumn({ datum, onClick }) {
  return (
    <Box direction="column">
      <Text weight="bold" color="dark-2"
        onClick={onClick}
        style={{
          cursor: 'pointer',
          transition: 'text-decoration 0.2s ease',
        }}
        onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
        onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
      >
        {datum.title}
      </Text>
      <Text weight="normal" color="gray">
        {datum.authorName}
      </Text>
    </Box>
  );
}
