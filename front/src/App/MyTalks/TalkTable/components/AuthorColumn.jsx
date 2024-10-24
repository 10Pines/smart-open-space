import { Anchor, Box, Text } from 'grommet';
import React from 'react';

export function AuthorColumn(props) {
  return (
    <Box direction="column">
      <Text>{props.datum.authorName}</Text>
      <Anchor weight="normal" href={`mailto:${props.datum.authorEmail}`}>
        {props.datum.authorEmail}
      </Anchor>
    </Box>
  );
}
