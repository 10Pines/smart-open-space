import React, { useState } from 'react';
import MainHeader from '#shared/MainHeader';
import { CalendarIcon, ClockIcon, HomeIcon, TracksIcon } from '#shared/icons';
import MyForm from '#shared/MyForm';
import Tracks from './Tracks';
import Rooms from './Rooms';
import { Box, Form, Layer, MaskedInput, Text } from 'grommet';
import Dates from './Dates';
import TimeSelector from './TimeSelector';
import PropTypes from 'prop-types';
import Title from '#shared/Title';
import Detail from '#shared/Detail';
import Spinner from '#shared/Spinner';
import { compareAsc } from 'date-fns';
import Input from '../components/atom/Input';
import AddElementBox from '../components/molecule/AddElementBox';
import Button from '../components/atom/Button';
import useSize from '#helpers/useSize';
import TrackForm from '../components/molecule/TrackForm';

const OTHER_SLOT = 'OtherSlot';

const pad = (n) => (n < 10 ? '0' : '') + n;

export const splitTime = (time) =>
  time === undefined ? [0, -1] : time.split(':').map((t) => Number(t));

const InputTime = ({ onChange, start, title, value }) => {
  const [startHour, startMinutes] = splitTime(start);
  const [currentHour] = splitTime(value);
  return (
    <Box direction="row">
      <Text alignSelf="center">{title}</Text>
      <MaskedInput
        mask={[
          {
            length: [1, 2],
            options: [...Array(24 - startHour)].map((_, k) => pad(k + startHour)),
            regexp: /^(0[0-9]|1[0-9]|2[0-3]|[0-9])$/,
            placeholder: 'hh',
          },
          { fixed: ':' },
          {
            length: 2,
            options: ['00', '15', '30', '45'].filter(
              (minutes) => currentHour !== startHour || minutes > startMinutes
            ),
            regexp: /^[0-5][0-9]|[0-5]$/,
            placeholder: 'mm',
          },
        ]}
        onChange={onChange}
        plain
        value={value}
      />
    </Box>
  );
};
InputTime.propTypes = {
  onChange: PropTypes.func.isRequired,
  start: PropTypes.string,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
};

const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]|[0-9]):[0-5][0-9]$/;
const validateTime = (time) => !timeRegex.test(time) && 'Hora inválida';
const newHour = (time) => new Date().setHours(...time.split(':'));

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
          externalOnChange={(value) => {
            setStartTime(value.startTime);
          }}
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

const emptyOpenSpace = {
  name: '',
  description: '',
  tracks: [
    {
      name: '',
      description: '',
      color: undefined,
    },
  ],
  rooms: [],
  dates: [],
  slots: [],
};

export const OpenSpaceForm = ({
  onSubmit,
  history,
  title,
  initialValues = emptyOpenSpace,
}) => {
  const [openSpace, setOpenSpace] = useState(initialValues);

  const [showInputSlot, setShowInputSlot] = useState(null);
  const [availableDates, setAvailableDates] = useState(
    (initialValues.dates || []).sort(compareAsc)
  );
  const [deletedDate, setDeletedDate] = useState();
  const isSmall = useSize() === 'small';

  const isRepeatedTrack = (tracks, track) =>
    tracks.filter((eachTrack) => eachTrack.name === track.name).length > 1;

  const hasTracksWithRepeatedName = (tracks) =>
    tracks.some((eachTrack) => isRepeatedTrack(tracks, eachTrack));

  const checkSubmit = (value) => {
    if (value.dates.length > 0 && value.slots.length == 0) {
      alert('Si agregaste una fecha, tenés que agregar slots');
    } else {
      onSubmit({ value });
    }
  };

  const renderSlotInput = (mustShow) =>
    mustShow !== null && (
      <InputSlot
        onExit={() => setShowInputSlot(null)}
        onSubmit={(data) => {
          showInputSlot.onSubmitSlot(data);
          setShowInputSlot(null);
        }}
        start={showInputSlot.start}
        type={showInputSlot.type}
      />
    );

  const changeTrack = (track, index) => {
    const newTracks = [...openSpace.tracks];
    newTracks[index] = track;
    setOpenSpace({ ...openSpace, tracks: newTracks });
  };

  const addTrack = () => {
    const newTracks = [
      ...openSpace.tracks,
      { name: '', description: '', color: undefined },
    ];
    setOpenSpace({ ...openSpace, tracks: newTracks });
  };

  if (initialValues === undefined) return <Spinner />;

  return (
    <>
      <MainHeader>
        <MainHeader.Title label={title} />
      </MainHeader>
      <Box direction="column" gap="medium">
        <Input
          label="Nombre"
          placeholder="¿Cómo se va a llamar?"
          value={openSpace.name}
          onChange={(name) => setOpenSpace({ ...openSpace, name })}
        />
        <Input
          label="Descripción"
          placeholder="Añade una descripción..."
          multiline
          rows={7}
          value={openSpace.description}
          onChange={(description) => setOpenSpace({ ...openSpace, description })}
        />
        <Box gap="medium">
          <Text>Tracks</Text>
          <Box direction="row" gap="medium">
            {openSpace.tracks &&
              openSpace.tracks.map((track, index) => (
                <TrackForm
                  track={track}
                  onChange={(trackChanged) => changeTrack(trackChanged, index)}
                />
              ))}
            <AddElementBox
              size={{
                height: 'auto',
                width: '300px',
              }}
              onClick={addTrack}
            />
          </Box>
        </Box>

        <Box gap="medium">
          <Text>Salas</Text>
          <Box direction="row" gap="small">
            {/* // TODO: RoomsBox */}
            <AddElementBox />
          </Box>
        </Box>

        <Box gap="medium">
          <Text>Fecha</Text>
          <Box direction="row" gap="small">
            {/* // TODO: DateTimeBox */}
            <AddElementBox />
          </Box>
        </Box>

        <Box gap="medium">
          <Text>Grilla Horaria</Text>
          {/* // TODO: Add grilla horaria */}
          Aca iria la grilla horaria
        </Box>

        <Box
          direction={!isSmall ? 'row-reverse' : 'column'}
          justify="center"
          gap="medium"
          pad={{
            horizontal: 'large',
          }}
          margin={{
            top: 'medium',
          }}
        >
          <Button primary>Aceptar</Button>
          <Button secondary>Cancelar</Button>
        </Box>
      </Box>
      {renderSlotInput(showInputSlot)}
    </>
  );
};
