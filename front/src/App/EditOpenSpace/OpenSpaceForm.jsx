import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import MainHeader from '#shared/MainHeader';
import {
  CalendarIcon,
  ClockIcon,
  CloseIcon,
  HomeIcon,
  TracksIcon,
  TrashIcon,
} from '#shared/icons';
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
import { compareAsc, set } from 'date-fns';
import Input from '../components/atom/Input';
import AddElementBox from '../components/molecule/AddElementBox';
import Button from '../components/atom/Button';
import useSize from '#helpers/useSize';
import TrackForm from '../components/molecule/TrackForm';
import RoomPickerForm from '../components/molecule/RoomPickerForm';
import DateTimeForm from '../components/molecule/DateTimeForm';
import Carousel from '../components/molecule/Carousel';
import Badge from '../components/molecule/Badge';

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
const datePlusOneDay = (date) => new Date(date.getTime() + 24 * 60 * 60 * 1000);

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
  rooms: [
    {
      name: '',
      link: '',
    },
  ],
  dates: [new Date()],
  slots: [],
};

export const OpenSpaceForm = ({
  onSubmit,
  history,
  title,
  initialValues = emptyOpenSpace,
}) => {
  const [openSpace, setOpenSpace] = useState(initialValues);
  const tracks = useRef();
  const rooms = useRef();
  const fechas = useRef();

  const [showInputSlot, setShowInputSlot] = useState(null);
  // const [availableDates, setAvailableDates] = useState(
  //   (initialValues.dates || []).sort(compareAsc)
  // );
  const [deletedDate, setDeletedDate] = useState({
    date: null,
    index: -1,
  });
  const isSmall = useSize() === 'small';

  const isRepeatedTrack = (tracks, track) =>
    tracks.filter((eachTrack) => eachTrack.name === track.name).length > 1;

  const hasTracksWithRepeatedName = (tracks) =>
    tracks.some((eachTrack) => isRepeatedTrack(tracks, eachTrack));

  const validate = () => {
    return true;
  };

  const checkSubmit = () => {
    if (!validate()) {
      alert('Hay errores en el formulario');
    } else {
      onSubmit({ value: openSpace });
    }
  };

  const renderSlotInput = (mustShow) =>
    mustShow !== null && (
      <InputSlot
        onExit={() => setShowInputSlot(null)}
        mustShow
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

  const changeRoom = (room, index) => {
    const newRooms = [...openSpace.rooms];
    newRooms[index] = room;
    setOpenSpace({ ...openSpace, rooms: newRooms });
  };

  const changeDate = (date, index) => {
    const newDates = [...openSpace.dates];
    newDates[index] = date;
    for (let i = index + 1; i < newDates.length; i++) {
      if (compareAsc(newDates[i], newDates[i - 1]) <= 0) {
        newDates[i] = datePlusOneDay(new Date(newDates[i - 1].getTime()));
      }
    }
    setOpenSpace({ ...openSpace, dates: newDates });
  };

  const addTrack = () => {
    const newTracks = [
      ...openSpace.tracks,
      { name: '', description: '', color: undefined },
    ];
    setOpenSpace({ ...openSpace, tracks: newTracks });
    tracks.current.scrollToEnd();
  };

  const addRoom = () => {
    const newRooms = [...openSpace.rooms, { name: '', link: '' }];
    setOpenSpace({ ...openSpace, rooms: newRooms });
    rooms.current.scrollToEnd();
  };

  const addDate = () => {
    const newDate =
      openSpace.dates.length > 0
        ? new Date(
            openSpace.dates[openSpace.dates.length - 1].getTime() + 24 * 60 * 60 * 1000
          )
        : new Date();

    const newDates = [...openSpace.dates, newDate];
    setOpenSpace({ ...openSpace, dates: newDates });
    fechas.current.scrollToEnd();
  };

  const removeTrack = (index) => {
    setOpenSpace({
      ...openSpace,
      tracks: openSpace.tracks.filter((_, i) => i !== index),
    });
  };

  const removeRoom = (index) => {
    setOpenSpace({
      ...openSpace,
      rooms: openSpace.rooms.filter((_, i) => i !== index),
    });
  };

  const removeDate = (index) => {
    setDeletedDate({ date: openSpace.dates[index], index });
    setOpenSpace({
      ...openSpace,
      dates: openSpace.dates.filter((_, i) => i !== index),
    });
  };

  const cardsAnimation = {
    type: 'fadeIn',
    delay: 1,
    duration: 800,
  };

  const badgeProps = {
    icon: <CloseIcon size="small" />,
    position: 'top-right',
    buttonProps: {
      size: 'xxsmall',
    },
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
          <Carousel ref={tracks}>
            {openSpace.tracks &&
              openSpace.tracks.map((track, index) => (
                <Box
                  style={{ minWidth: '300px', paddingTop: '0.5rem' }}
                  animation={cardsAnimation}
                >
                  <Badge key={index} onClick={() => removeTrack(index)} {...badgeProps}>
                    <TrackForm
                      track={track}
                      onChange={(trackChanged) => changeTrack(trackChanged, index)}
                      width={{ min: '300px' }}
                      animation={cardsAnimation}
                    />
                  </Badge>
                </Box>
              ))}
            <AddElementBox
              size={{
                height: openSpace.tracks.length > 0 ? 'auto' : '167px',
                width: '300px',
              }}
              onClick={addTrack}
              width={{ min: '300px' }}
            />
          </Carousel>
        </Box>

        <Box gap="medium">
          <Text>Salas</Text>
          <Carousel ref={rooms}>
            {openSpace.rooms &&
              openSpace.rooms.map((room, index) => (
                <Box
                  style={{ minWidth: '300px', paddingTop: '0.5rem' }}
                  animation={cardsAnimation}
                >
                  <Badge key={index} onClick={() => removeRoom(index)} {...badgeProps}>
                    <RoomPickerForm
                      room={room}
                      onChange={(roomChanged) => changeRoom(roomChanged, index)}
                      width={{ min: '300px' }}
                      animation={cardsAnimation}
                    />
                  </Badge>
                </Box>
              ))}
            <AddElementBox
              onClick={addRoom}
              size={{
                height: openSpace.rooms.length > 0 ? 'auto' : '146px',
                width: '300px',
              }}
              width={{ min: '300px' }}
            />
          </Carousel>
        </Box>

        <Box gap="medium">
          <Text>Fecha/s</Text>
          <Box direction="row" gap="small">
            <Carousel ref={fechas}>
              {openSpace.dates &&
                openSpace.dates.map((date, index) => (
                  <Box
                    style={{ minWidth: '390px', paddingTop: '0.5rem' }}
                    animation={cardsAnimation}
                  >
                    <Badge key={index} onClick={() => removeDate(index)} {...badgeProps}>
                      <DateTimeForm
                        title={`Día ${index + 1}`}
                        value={date}
                        onChange={(dateChanged) => changeDate(dateChanged, index)}
                        minDate={
                          index !== 0 ? datePlusOneDay(openSpace.dates[index - 1]) : null
                        }
                      />
                    </Badge>
                  </Box>
                ))}
              <AddElementBox
                onClick={addDate}
                size={{
                  height: openSpace.dates.length > 0 ? 'auto' : '138px',
                  width: '390px',
                }}
                width={{ min: '390px' }}
              />
            </Carousel>
          </Box>
        </Box>

        <Box gap="medium">
          <Text>Grilla Horaria</Text>
          {/* // TODO: Add grilla horaria */}
          <TimeSelector
            value={openSpace.slots}
            onChange={({ value: slots }) => {
              setOpenSpace({ ...openSpace, slots });
            }}
            onNewSlot={(type, start, onSubmitSlot) => {
              setShowInputSlot({ onSubmitSlot, start, type });
            }}
            dates={openSpace.dates}
            deletedDate={deletedDate}
          />
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
          <Button primary onClick={checkSubmit}>
            Aceptar
          </Button>
          <Button secondary onClick={history.goBack}>
            Cancelar
          </Button>
        </Box>
      </Box>
      {renderSlotInput(showInputSlot)}
    </>
  );
};
