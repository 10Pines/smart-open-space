import React, { useEffect, useState } from 'react';

import { Box, Layer } from 'grommet';
import PropTypes from 'prop-types';

import { CalendarIcon, ClockIcon, HomeIcon } from '#shared/icons';
import Detail from '#shared/Detail';
import MyForm from '#shared/MyForm';
import Title from '#shared/Title';
import { Room } from '../../model/room';
import { compareAsc } from 'date-fns';
import { numbersToTime } from '#helpers/time';
import { getLocaleDateString } from '#helpers/GetLocaleDateString';

const SelectSlot = ({ rooms, dates, name, onExit, onSubmit, title }) => {
  const [value, setValue] = useState({
    room: new Room([]),
  });

  const noRoomSelected = !value.room.id;
  const noDateSelected = !value.date;
  const sortedDates = dates.sort(compareAsc);
  const hasOneDate = dates.length === 1;

  useEffect(() => {
    if (hasOneDate) setValue({ ...value, date: dates[0] });
  }, [dates, value.room]);

  return (
    <Layer onEsc={onExit} onClickOutside={onExit}>
      <Box pad="medium">
        <Box margin={{ vertical: 'medium' }}>
          <Title level="2">{title}</Title>
          <Detail size="large" text={name} textAlign="center" />
        </Box>
        <MyForm onSecondary={onExit} onSubmit={onSubmit} initialValue={value}>
          <MyForm.Select
            label="Sala"
            icon={<HomeIcon />}
            name="room"
            options={rooms}
            emptySearchMessage="No hay salas disponibles"
            labelKey="name"
            onChange={({ selected: selectedIndex }) => {
              setValue({
                room: rooms[selectedIndex],
              });
            }}
          />
          {!hasOneDate && (
            <MyForm.Select
              label="Fecha"
              icon={<CalendarIcon />}
              disabled={noRoomSelected}
              name="date"
              options={sortedDates.map((date) => getLocaleDateString(date))}
              emptySearchMessage="No hay fechas disponibles en esa sala"
              onChange={({ selected: selectedIndex }) =>
                setValue({ ...value, date: sortedDates[selectedIndex] })
              }
            />
          )}
          <MyForm.Select
            label="Horario"
            icon={<ClockIcon />}
            disabled={(noDateSelected && !hasOneDate) || noRoomSelected}
            emptySearchMessage="No hay horarios disponibles para esta sala en esa fecha"
            name="slot"
            labelKey="startTime"
            options={value.room.slotsAt(value.date).map((slot) => ({
              ...slot,
              startTime: numbersToTime(slot.startTime),
            }))}
          />
        </MyForm>
      </Box>
    </Layer>
  );
};
SelectSlot.propTypes = {
  rooms: PropTypes.arrayOf(
    PropTypes.shape({
      second: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)),
    }).isRequired
  ).isRequired,
  name: PropTypes.string.isRequired,
  onExit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default SelectSlot;
