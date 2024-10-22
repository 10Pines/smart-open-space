import React, { useState } from 'react';

import { Calendar, DropButton } from 'grommet';
import PropTypes from 'prop-types';

import { DownIcon } from '#shared/icons';
import Row from '#shared/Row';

const getNextYear = () => new Date(new Date().setFullYear(new Date().getFullYear() + 1));

const MyCalendar = ({ onChange, value, ...props }) => {
  const [open, setOpen] = useState(false);

  const onSelect = (nextDate) => {
    onChange({ target: { value: nextDate } });
    setOpen(false);
  };

  return (
    <DropButton
      dropContent={
        <Calendar
          bounds={[new Date().toISOString(), getNextYear().toISOString()]}
          date={value}
          daysOfWeek
          onSelect={onSelect}
          locale="es"
          size="small"
          {...props}
        />
      }
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Row pad="small">
        {value ? new Date(value).toLocaleDateString('es') : 'Elegir fecha'}
        <DownIcon />
      </Row>
    </DropButton>
  );
};
MyCalendar.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired,
};

export default MyCalendar;
