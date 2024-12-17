import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text } from 'grommet';
import {capitalize} from "#helpers/textUtils.js";

const DateTimeIndicator = ({ dates=[], width, ...props }) => {
  const days = new Map();

  dates.forEach((date, i) => {
    const month = date.toLocaleString('es-ES', { month: 'long' });
    if (!days.has(month)) {
      days.set(month, [date.getDate().toString().padStart(2, '0')]);
    } else {
      days.get(month).push(date.getDate().toString().padStart(2, '0'));
    }
  })
  const monthsOrder = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];
  const sortedDays = Array.from(days)
      .sort(([keyA], [keyB]) => monthsOrder.indexOf(keyA) - monthsOrder.indexOf(keyB));


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
      {sortedDays.map(([key, value], index) => (
          <>
            <Text key={index} weight="bold" size="small">
              {value.join(", ")}
            </Text>
            <Text size="small">{capitalize(key)}</Text>
          </>
      ))}
    </Box>
  );
};

DateTimeIndicator.propTypes = {
  width: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({ width: PropTypes.string }),
  ]),
  props: PropTypes.object,
};

export default DateTimeIndicator;
