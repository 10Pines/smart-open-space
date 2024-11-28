//! This is an old component, used on the project but subject to change.
import React, { useState } from 'react';
import { Box, Layer } from 'grommet';
import PropTypes from 'prop-types';
import Title from '#shared/Title';
import Detail from '#shared/Detail';
import MyForm from '#shared/MyForm';
import InputTime from '../atom/InputTime';
import { newHour, validateTime } from '#helpers/time';

const OTHER_SLOT = 'OtherSlot';

const InputSlot = ({ onExit, onSubmit, type, start }) => {
  const [startTime, setStartTime] = useState();

  return (
    <Layer onEsc={onExit} onClickOutside={onExit}>
      <Box pad="medium">
        <Box margin={{ vertical: 'medium' }}>
          <Title level="2">Horario</Title>
          <Detail>Nuevo slot</Detail>
        </Box>
        <MyForm
          onSecondary={onExit}
          onSubmit={onSubmit}
          externalOnChange={(value) => setStartTime(value.startTime)}
        >
          {start === undefined ? (
            <MyForm.Field
              component={InputTime}
              name="startTime"
              title="De"
              validate={validateTime}
            />
          ) : (
            <Box>{`De ${start}`}</Box>
          )}
          <MyForm.Field
            component={InputTime}
            name="endTime"
            title="A"
            start={start || startTime}
            validate={(time, { startTime: sTime }) =>
              validateTime(time) ||
              (newHour(time) <= newHour(start || sTime) && 'Debe ser mayor al Desde')
            }
          />
          {type === OTHER_SLOT && <MyForm.Text name="description" label="Descripción" />}
        </MyForm>
      </Box>
    </Layer>
  );
};

InputSlot.propTypes = {
  onExit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  start: PropTypes.string,
  type: PropTypes.string.isRequired,
};

export default InputSlot;
