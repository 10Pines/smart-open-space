import { Box } from 'grommet';
import { numbersToTime } from '#helpers/time';
import { Slot } from './Slot';
import React from 'react';
import HourHeader from '#shared/HourHeader';
import { OtherSlot } from './OtherSlot';
import PropTypes from 'prop-types';

export const DateSlots = ({ talksOf, sortedSlots, showSpeakerName }) => {
  return (
    <Box margin={{ bottom: 'medium' }}>
      {[
        ...sortedSlots.map((slot, index) => (
          <Slot
            key={slot.id}
            talksOf={talksOf}
            slot={slot}
            showSpeakerName={showSpeakerName}
            index={index}
          />
        )),
        <React.Fragment key="cierre">
          <HourHeader hour={numbersToTime(sortedSlots.slice(-1)[0].endTime)} isFinal />
        </React.Fragment>,
      ]}
    </Box>
  );
};
DateSlots.prototype = {
  talksOf: PropTypes.func.isRequired,
  sortedSlots: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};
