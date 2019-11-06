import React, { useState } from 'react';

import { Calendar, DropButton } from 'grommet';
import PropTypes from 'prop-types';

import { DownIcon } from '#shared/icons';
import Row from '#shared/Row';

const MyCalendar = ({ onChange, value, ...props }) => {
  const [open, setOpen] = useState(false);

  const onSelect = nextDate => {
    onChange({ value: nextDate });
    setOpen(false);
  };

  return (
    <DropButton
      dropContent={<Calendar date={value} onSelect={onSelect} {...props} />}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
    >
      <Row pad="small">
        {value ? new Date(value).toLocaleDateString() : 'Elegir fecha'}
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