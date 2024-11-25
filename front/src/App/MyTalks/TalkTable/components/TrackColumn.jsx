import { Anchor, Box, Text } from 'grommet';
import React from 'react';

export function TrackColumn(props) {
  return (
    <>
      {props.datum.trackName ? (
        <Text weight="normal" color={props.datum.trackColor}>
          {props.datum.trackName}
        </Text>
      ) : (
        <Text weight="normal" color="gray">
          Sin track
        </Text>
      )}
    </>
  );
}
