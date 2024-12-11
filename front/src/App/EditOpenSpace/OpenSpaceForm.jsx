import React, { useRef, useState } from 'react';
import MainHeader from '#shared/MainHeader';
import { CalendarIcon, ClockIcon, CloseIcon, HomeIcon, TalkIcon } from '#shared/icons';
import { Box } from 'grommet';
import TimeSelector from './TimeSelector';
import Spinner from '#shared/Spinner';
import Input from '../components/atom/Input';
import AddElementBox from '../components/molecule/AddElementBox';
import Button from '../components/atom/Button';
import useSize from '#helpers/useSize';
import TrackForm from '../components/molecule/TrackForm';
import LinkForm from '#components/molecule/LinkForm.jsx';
import DateTimeForm from '../components/molecule/DateTimeForm';
import Carousel from '../components/molecule/Carousel';
import Badge from '../components/molecule/Badge';
import InputSlot from '../components/molecule/InputSlot';
import FormTitle from '../components/atom/FormTitle';
import useOpenSpaceForm from '#helpers/hooks/useOpenSpaceForm';
import { datePlusOneDay } from '#helpers/time';
import globalStyles from "#shared/styles/styles.js";

const emptyOpenSpace = {
  name: '',
  description: '',
  tracks: [
    {
      name: '',
      description: '',
      color: '#3F8880',
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

const DEFAULT_COLOR = '#3F8880';

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
  const refs = { tracksRef: tracks, roomsRef: rooms, datesRef: fechas };
  const {
    addTrack,
    addRoom,
    addDate,
    removeTrack,
    removeRoom,
    removeDate,
    changeTrack,
    changeRoom,
    changeDate,
    validate,
  } = useOpenSpaceForm(openSpace, setOpenSpace, refs);

  const [showInputSlot, setShowInputSlot] = useState(null);
  const [deletedDate, setDeletedDate] = useState({
    date: null,
    index: -1,
  });
  const isSmall = useSize() === 'small';

  const manageOpenSpaceData = (openSpace) => {
    const { tracks, rooms, ...rest } = openSpace;

    return {
      ...rest,
      tracks: tracks
        .filter((track) => track.name !== '')
        .map((track) => ({ ...track, color: track.color ?? DEFAULT_COLOR })),
      rooms: rooms.filter((room) => room.name !== ''),
    };
  };

  const checkSubmit = () => {
    if (!validate()) {
      alert('Falta completar el nombre o hay tracks repetidos');
    } else {
      onSubmit({ value: manageOpenSpaceData(openSpace) });
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
        <Box>
          <FormTitle icon={<TalkIcon />}>Ejes temáticos</FormTitle>
          <Carousel ref={tracks}>
            {openSpace.tracks &&
              openSpace.tracks.map((track, index) => (
                <Box
                  style={{ minWidth: '300px', paddingTop: '0.5rem' }}
                  animation={globalStyles.cardsAnimation}
                >
                  <Badge key={index} onClick={() => removeTrack(index)}>
                    <TrackForm
                      track={track}
                      onChange={(trackChanged) => changeTrack(trackChanged, index)}
                      width={{ min: '300px' }}
                      animation={globalStyles.cardsAnimation}
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

        <Box>
          <FormTitle icon={<HomeIcon />}>Salas</FormTitle>
          <Carousel ref={rooms}>
            {openSpace.rooms &&
              openSpace.rooms.map((room, index) => (
                <Box
                  style={{ minWidth: '300px', paddingTop: '0.5rem' }}
                  animation={globalStyles.cardsAnimation}
                >
                  <Badge key={index} onClick={() => removeRoom(index)}>
                    <LinkForm
                      item={room}
                      onChange={(roomChanged) => changeRoom(roomChanged, index)}
                      width={{ min: '300px' }}
                      animation={globalStyles.cardsAnimation}
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

        <Box>
          <FormTitle icon={<ClockIcon />}>Día/s del evento</FormTitle>
          <Box direction="row" gap="small">
            <Carousel ref={fechas}>
              {openSpace.dates &&
                openSpace.dates.map((date, index) => (
                  <Box
                    style={{ minWidth: '390px', paddingTop: '0.5rem' }}
                    animation={globalStyles.cardsAnimation}
                  >
                    <Badge
                      key={index}
                      onClick={() => {
                        setDeletedDate({ date, index });
                        removeDate(index);
                      }}
                    >
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

        <Box>
          <FormTitle icon={<CalendarIcon />}>Grilla Horaria</FormTitle>
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
