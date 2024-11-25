//! This is an old component, used on the project but subject to change.
import React from 'react';
import PropTypes from 'prop-types';
import { Box, MaskedInput, Text } from 'grommet';

const pad = (n) => (n < 10 ? '0' : '') + n;

export const splitTime = (time) =>
  time === undefined ? [0, -1] : time.split(':').map((t) => Number(t));

export const validateTime = (time) => {
  const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/;
  return !timeRegex.test(time) && 'Hora inválida';
};

const InputTime = ({ onChange, start, title, value }) => {
  const [startHour, startMinutes] = splitTime(start);
  const [currentHour] = splitTime(value);
  return (
    <Box direction="row">
      <Text alignSelf="center">{title}</Text>
      <MaskedInput
        mask={[
          {
            length: [1, 2],
            options: [...Array(24 - startHour)].map((_, k) => pad(k + startHour)),
            regexp: /^(0[0-9]|1[0-9]|2[0-3]|[0-9])$/,
            placeholder: 'hh',
          },
          { fixed: ':' },
          {
            length: 2,
            options: ['00', '15', '30', '45'].filter(
              (minutes) => currentHour !== startHour || minutes > startMinutes
            ),
            regexp: /^[0-5][0-9]|[0-5]$/,
            placeholder: 'mm',
          },
        ]}
        onChange={onChange}
        plain
        value={value}
      />
    </Box>
  );
};

InputTime.propTypes = {
  onChange: PropTypes.func.isRequired,
  start: PropTypes.string,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

export default InputTime;
