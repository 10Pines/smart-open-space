import React, { useEffect } from 'react';
import { Box, Tabs, Tab } from 'grommet';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { DateTab } from './DateTab';
import { byDate } from '#helpers/time';

const TimeSelector = ({ onChange, onNewSlot, value, dates, deletedDate }) => {
  const addSlot = (type, date, lastEnd) =>
    onNewSlot(type, lastEnd, ({ value: { startTime, endTime, description } }) => {
      onChange({
        target: {
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
        },
      });
    });

  const removeSlot = (date, lastEnd) =>
    onChange({
      target: {
        value: value.filter((slot) => !byDate(date)(slot) || slot.endTime != lastEnd),
      },
    });

  const handleShowOrElse = (result, def) => {
    if (dates.length < 1 || dates == undefined) {
      return def;
    }
    return result;
  };

  useEffect(() => {
    onChange({
      target: { value: value.filter((slot) => !byDate(deletedDate)(slot)) },
    });
  }, [deletedDate]);

  return handleShowOrElse(
    <Box>
      <Tabs>
        {dates.map((date) => (
          <Tab title={format(date, 'yyyy-MM-dd')}>
            <DateTab
              key={date}
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
