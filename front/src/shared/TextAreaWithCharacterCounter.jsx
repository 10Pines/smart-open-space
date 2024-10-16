import { Text, TextArea } from 'grommet';
import React from 'react';
import PropTypes from 'prop-types';

function CharacterCounter({ value, maxLength }) {
  return (
    <Text alignSelf={'end'} color={'#777777'}>
      {value.length}/{maxLength}
    </Text>
  );
}
CharacterCounter.prototype = {
  value: PropTypes.number.isRequired,
  maxLength: PropTypes.number.isRequired,
};

export const TextAreaWithCharacterCounter = (props) => {
  return (
    <>
      <TextArea {...props} />
      <CharacterCounter value={props.value} maxLength={props.maxLength} />
    </>
  );
};
TextAreaWithCharacterCounter.prototype = {
  value: PropTypes.number.isRequired,
  maxLength: PropTypes.number.isRequired,
};
