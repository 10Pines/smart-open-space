import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text } from 'grommet';
import { isSameDate } from '#helpers/time';

const DateTimeIndicator = ({ date, width, ...props }) => {
  if (!isSameDate(date.start, date.end)) throw new Error('Las fechas deben ser iguales');

  const getHour = (date) => {
    return (
      date.getHours().toString().padStart(2, '0') +
      ':' +
      date.getMinutes().toString().padStart(2, '0')
    );
  };

  const day = date.start.getDate().toString().padStart(2, '0');
  const month = date.start.toLocaleString('es-ES', { month: 'long' });
  const hours = `${getHour(date.start)} a ${getHour(date.end)}`; // Horario fijo, podrías parametrizarlo si es variable.

  return (
    <Box
      background={props.background ?? 'typography'}
      pad={props.pad ?? 'small'}
      align={props.align ?? 'center'}
      justify={props.justify ?? 'center'}
      round={props.round ?? 'small'}
      width={
        width ?? {
          width: 'fit-content',
          min: '80px',
        }
      }
      gap={props.gap ?? '0.6rem'}
      {...props}
    >
      <Text size="xxlarge">{day}</Text>
      <Box align="center">
        <Text>{month.charAt(0).toUpperCase() + month.slice(1)}</Text>
        <Text size="small">{hours}</Text>
      </Box>
    </Box>
  );
};

DateTimeIndicator.propTypes = {
  date: PropTypes.shape({
    start: PropTypes.instanceOf(Date).isRequired,
    end: PropTypes.instanceOf(Date).isRequired,
  }).isRequired,
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({ width: PropTypes.string }),
  ]),
  props: PropTypes.object,
};

export default DateTimeIndicator;
