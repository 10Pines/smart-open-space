import React, { useEffect, useState } from 'react';
import { Box, Tabs, Tab } from 'grommet';
import PropTypes from 'prop-types';
import { format } from 'date-fns';
import { DateTab } from './DateTab';
import { byDate } from '#helpers/time';

const TimeSelector = ({ onChange, onNewSlot, value, dates, deletedDate }) => {
  const [activeDateIndex, setActiveDateIndex] = useState(0);
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
            date: new Date(date),
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
    setActiveDateIndex(0);
  }, []);

  useEffect(() => {
    const { index, date } = deletedDate;

    if (index == activeDateIndex) setActiveDateIndex(Math.max(activeDateIndex - 1, 0));
    if (activeDateIndex >= dates.length) setActiveDateIndex(dates.length - 1);

    onChange({
      value: value.filter((slot) => !byDate(date)(slot)),
    });
  }, [deletedDate]);

  useEffect(() => {
    if (dates.length == 1) {
      setActiveDateIndex(0);
    }
  }, dates);

  return canShowOrElse(
    <Box>
      <Tabs activeIndex={activeDateIndex} onActive={setActiveDateIndex}>
        {dates.map((date, i) => (
          <Tab
            key={i}
            title={format(date, 'yyyy-MM-dd')}
            style={
              activeDateIndex == i
                ? {
                    border: '2px solid #7D4CDB',
                    borderRadius: '5px',
                    padding: '0.5rem',
                    backgroundColor: 'white',
                    cursor: 'default',
                    textDecoration: 'none',
                  }
                : {}
            }
          >
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
