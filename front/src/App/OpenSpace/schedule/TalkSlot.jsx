import { Box } from 'grommet';
import Talks from '../Talks';
import Talk from '../Talk';
import React from 'react';
import PropTypes from 'prop-types';

export const TalkSlot = ({ slots, showSpeakerName }) =>
  slots.length === 0 ? (
    <Box height="small" />
  ) : (
    <Talks>
      {slots.map(({ talk, room }) => (
        <Talk key={talk.id} talk={talk} room={room} showSpeakerName={showSpeakerName} />
      ))}
    </Talks>
  );
TalkSlot.propTypes = { slots: PropTypes.arrayOf(PropTypes.shape()).isRequired };
