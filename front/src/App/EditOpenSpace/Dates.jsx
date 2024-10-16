import React, { useState } from 'react';

import { Box } from 'grommet';
import PropTypes from 'prop-types';
import RowBetween from '#shared/RowBetween';
import { PlusButton } from '#shared/PlusButton';
import MyCalendar from './MyCalendar';
import ListWithRemoveButton from '#shared/ListWithRemoveButton';
import { isEqualsDateTime } from '#helpers/time';

const Dates = ({ value = [], onChange, onChangeDates, onRemoveItem }) => {
  const initialDate = '';
  const [date, setDate] = useState(initialDate);
  const isDateEmpty = date.trim().length < 1;
  const isDateIncluded = value.some((valDate) => isEqualsDateTime(valDate, date));

  const handlingOnChangeFuncs = (event) => {
    onChange(event);
    onChangeDates(event);
  };

  return (
    <Box pad="small">
      <RowBetween>
        <MyCalendar
          onChange={(event) => setDate(event.target.value)}
          placeholder="Fechas del Open Space"
          value={date}
        />
        <PlusButton
          conditionToDisable={isDateEmpty || isDateIncluded}
          item={new Date(date)}
          setItem={setDate}
          value={value}
          initialItem={date}
          onChange={handlingOnChangeFuncs}
        />
      </RowBetween>
      <ListWithRemoveButton
        items={value}
        onChange={handlingOnChangeFuncs}
        displayName={(item) => new Date(item).toLocaleDateString('es')}
        onRemoveItem={onRemoveItem}
      />
    </Box>
  );
};
Dates.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Dates;
