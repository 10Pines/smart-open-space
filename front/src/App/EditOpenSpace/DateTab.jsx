import React from 'react';
import { Box, Text, Button } from 'grommet';
import ButtonNew from '#shared/ButtonNew';
import HourHeader from '#shared/HourHeader';
import PropTypes from 'prop-types';
import { getLastEndFromCollectionOfSlots } from '#helpers/time';
import { TrashIcon } from '#shared/icons';

const TALK_SLOT = 'TalkSlot';
const OTHER_SLOT = 'OtherSlot';

const Slot = ({ color, onRemove, start, text }) => (
  <>
    <HourHeader hour={start} />
    <Box
      background={{ color, opacity: 'medium' }}
      direction="row"
      justify="center"
      pad={onRemove ? 'small' : 'medium'}
      round="small"
    >
      <Text alignSelf="center" color="dark-1">
        {text}
      </Text>
      {onRemove && <Button icon={<TrashIcon color="neutral-4" />} onClick={onRemove} />}
    </Box>
  </>
);
Slot.propTypes = {
  color: PropTypes.string.isRequired,
  onRemove: PropTypes.func,
  start: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

const CloseSlot = ({ time }) => (
  <Slot color="accent-1" key={`cierre-${time}`} start={time} text="Cierre" />
);
CloseSlot.propTypes = {
  time: PropTypes.string.isRequired,
};

export const DateTab = ({ value, addSlot, removeSlot, date }) => {
  const lastEnd = getLastEndFromCollectionOfSlots(value);

  return (
    <>
      {value.map(({ type, startTime, description }, i) => (
        <Slot
          color={type === TALK_SLOT ? 'brand' : 'accent-1'}
          key={startTime}
          start={startTime}
          text={type === TALK_SLOT ? 'Charla' : description}
          onRemove={i === value.length - 1 ? () => removeSlot(date, lastEnd) : null}
        />
      ))}
      {value.length > 0 && <CloseSlot time={lastEnd} />}

      <Box direction="row" margin={{ vertical: 'medium' }} justify="evenly">
        <ButtonNew
          label="Slot de Charla"
          onClick={() => addSlot(TALK_SLOT, date, lastEnd)}
        />
        <ButtonNew
          label="Slot Miscelaneo"
          color="accent-1"
          onClick={() => addSlot(OTHER_SLOT, date, lastEnd)}
        />
      </Box>
    </>
  );
};
DateTab.prototype = {
  value: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  addSlot: PropTypes.func.isRequired,
};
