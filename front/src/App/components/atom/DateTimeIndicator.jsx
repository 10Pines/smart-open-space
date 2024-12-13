import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text } from 'grommet';
import { isSameDate } from '#helpers/time';

const DateTimeIndicator = ({ date, dates, width, ...props }) => {
  const days = new Map();

  dates.forEach((date, i) => {
    const month = date.toLocaleString('es-ES', { month: 'long' });
    if (!days.has(month)) {
      days.set(month, [date.getDate().toString().padStart(2, '0')]);
    } else {
      days.get(month).push(date.getDate().toString().padStart(2, '0'));
    }
  })

  return (
    <Box
      background={props.background ?? 'typography'}
      pad={props.pad ?? {top: "5px", bottom: "5px", right: "small", left: "small"}}
      align={props.align ?? 'center'}
      justify={props.justify ?? 'center'}
      round={props.round ?? 'small'}
      width={
        width ?? "90%"
      }
      margin={{top: "medium"}}
      gap={props.gap}
      style={{minHeight: "100px"}}
      {...props}
    >
      {Array.from(days).map(([key, value], index) => (
          <>
            <Text key={index} weight="bold" size="small">
              {value.join(", ")}
            </Text>
            <Text size="small">{key}</Text>
          </>
      ))}
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
