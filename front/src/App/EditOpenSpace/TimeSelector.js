import React, { useEffect } from 'react';
import { Box, Tabs, Tab } from 'grommet';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { DateTab } from './DateTab';
import { byDate } from '#helpers/time';

const TimeSelector = ({ onChange, onNewSlot, value, dates, deletedDate }) => {
  const addSlot = (type, date, lastEnd) => {
    return onNewSlot(type, lastEnd, ({ startTime, endTime, description }) => {
      onChange({
        value: [
          ...value,
          {
            type,
            startTime: lastEnd || startTime,
            endTime,
            description,
            date: [date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate()],
          },
        ],
      });
    });
  };

  const removeSlot = (date, lastEnd) =>
    onChange({
      value: value.filter((slot) => !byDate(date)(slot) || slot.endTime != lastEnd),
    });

  const canShowOrElse = (showRes, elseRes) => {
    if (dates == null || dates.length < 1) {
      return elseRes;
    }
    return showRes;
  };

  useEffect(() => {
    onChange({
      value: value.filter((slot) => !byDate(deletedDate)(slot)),
    });
  }, [deletedDate]);

  return canShowOrElse(
    <Box>
      <Tabs>
        {dates.map((date, i) => (
          <Tab key={i} title={format(date, 'yyyy-MM-dd')}>
            <DateTab
              key={i}
              value={value.filter(byDate(date))}
              addSlot={addSlot}
              date={date}
              removeSlot={removeSlot}
            />
          </Tab>
        ))}
      </Tabs>
    </Box>,
    // else
    <Box />
  );
};

TimeSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  onNewSlot: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(PropTypes.shape),
};

export default TimeSelector;
