import React, { useState } from 'react';

import PropTypes from 'prop-types';
import { Box, Button, Grid, Heading, Layer, Text } from 'grommet';
import { FormClose } from 'grommet-icons';
import Slider from 'react-slick';

import RowBetween from './shared/RowBetween';
import { useGetOS } from '../helpers/api/os-client';
import { useUser } from '../helpers/useAuth';

const sliderSettings = {
  centerMode: true,
  arrows: false,
  dots: false,
  infinite: true,
  speed: 50,
  slidesToShow: 3,
  slidesToScroll: 1,
  focusOnSelect: true,
  adaptiveHeight: true,
  className: 'sarlanga',
  responsive: [
    {
      breakpoint: 960,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
};

const TalkSlider = ({ children }) => <Slider {...sliderSettings}>{children}</Slider>;

TalkSlider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
    .isRequired,
};

const LayerInfo = ({ info, onClose }) => (
  <Layer onClickOutside={onClose} onEsc={onClose}>
    <Box pad={{ horizontal: 'medium', bottom: 'medium', top: 'small' }}>
      <Box direction="row" justify="end">
        <Button icon={<FormClose />} onClick={onClose} plain />
      </Box>
      <Text>{info}</Text>
    </Box>
  </Layer>
);

LayerInfo.propTypes = {
  info: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

const ButtonMoreInfo = ({ onClick }) => (
  <Button
    alignSelf="center"
    color="accent-3"
    label="Mas info"
    primary
    onClick={onClick}
  />
);

ButtonMoreInfo.propTypes = {
  onClick: PropTypes.func.isRequired,
};

const Talk = ({ talk, room }) => {
  const [open, setOpen] = useState(false);
  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  return (
    <Box
      justify="between"
      background="white"
      elevation="small"
      pad="medium"
      round
      overflow="hidden"
      gap="medium"
      margin="xsmall"
    >
      <Box>
        <Heading level="3" margin="none" size="small">
          {talk.name}
        </Heading>
        <Text color="dark-5" size="medium">
          {room.name}
        </Text>
      </Box>
      {talk.description && <ButtonMoreInfo onClick={onOpen} />}
      {open && <LayerInfo info={talk.description} onClose={onClose} />}
    </Box>
  );
};

Talk.propTypes = {
  room: PropTypes.shape().isRequired,
  talk: PropTypes.shape().isRequired,
};

const Dots = ({ gridArea }) => (
  <Box
    alignSelf="center"
    gridArea={gridArea}
    border={{ size: 'xsmall', style: 'dashed' }}
  />
);

Dots.propTypes = {
  gridArea: PropTypes.string.isRequired,
};

const HourHeader = ({ hour }) => (
  <Grid
    areas={[['left', 'main', 'right']]}
    columns={['flex', 'xsmall', 'flex']}
    rows={['xxsmall']}
  >
    <Dots gridArea="left" />
    <Box align="center" alignSelf="center" gridArea="main" flex>
      {`${hour}:00 hs`}
    </Box>
    <Dots gridArea="right" />
  </Grid>
);

HourHeader.propTypes = {
  hour: PropTypes.number.isRequired,
};

const TimeSpan = ({ hour, slots }) => (
  <>
    <HourHeader hour={hour} />
    <TalkSlider>
      {slots.map(({ talk, room }) => (
        <Talk key={talk.id} talk={talk} room={room} />
      ))}
    </TalkSlider>
  </>
);

TimeSpan.propTypes = {
  hour: PropTypes.number.isRequired,
  slots: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const Schedule = ({ slots, startTime, endTime }) => {
  const start = Number(startTime.slice(0, 2));
  const end = Number(endTime.slice(0, 2));
  const times = [...Array(end - start)].map((_, i) => i + start);
  return times.map(hour => (
    <TimeSpan key={hour} hour={hour} slots={slots.filter(s => s.hour === hour)} />
  ));
};

const OpenSpace = ({
  match: {
    params: { id },
  },
  history,
  location: { pathname },
}) => {
  const [{ name, slots, ...os }] = useGetOS(id, () => {}); // history.push('/'));
  const user = useUser();

  const ButtonMyTalks = () => (
    <Box>
      <Button
        color="accent-1"
        fill="vertical"
        label="Mis charlas"
        onClick={() => history.push(`${user ? `${pathname}/mis-charlas` : '/login'}`)}
        primary
      />
    </Box>
  );

  return (
    <>
      <RowBetween>
        <Heading level="2">{name}</Heading>
        <ButtonMyTalks />
      </RowBetween>
      {slots && <Schedule slots={slots} startTime={os.startTime} endTime={os.endTime} />}
    </>
  );
};

OpenSpace.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
  }).isRequired,
};

export default OpenSpace;
