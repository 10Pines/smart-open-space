import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Text, Heading } from 'grommet';
import PropTypes from 'prop-types';

import ideasFlow from '#assets/ideas_flow.svg';
import { nextTalk, useGetOpenSpace } from '#api/os-client';
import { useQueue } from '#api/sockets-client';
import { useUser } from '#helpers/useAuth';
import ButtonLoading from '#shared/ButtonLoading';
import EmptyData from '#shared/EmptyData';
import Row from '#shared/Row';
import RowBetween from '#shared/RowBetween';
import { ClockIcon, NextIcon, TalkIcon, UserIcon } from '#shared/icons';
import Spinner from '#shared/Spinner';
import { RedirectToOS, RedirectToRoot, usePushToOpenSpace } from '#helpers/routes';

const TIME_FOR_SPEAKER = 30;

const useInterval = (callback, delay) => {
  const savedCallback = useRef();
  useEffect(() => {
    savedCallback.current = callback;
  });
  useEffect(() => {
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
};

const LabelTimeLeft = () => (
  <Row>
    <ClockIcon />
    <Text>TIEMPO RESTANTE</Text>
  </Row>
);

const BoxTime = ({ background = 'status-critical', label, size = 'large' }) => (
  <Box alignSelf="center" background={background} pad="medium" round>
    <Text textAlign="center" size={size} weight="bold">
      {label}
    </Text>
  </Box>
);
BoxTime.propTypes = {
  background: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  size: PropTypes.string,
};

const TimeLeft = ({ time }) => (
  <Box alignSelf="center" margin={{ top: 'medium' }}>
    {time === 0 ? (
      <BoxTime label="Se acabó tu tiempo!" />
    ) : (
      <Box gap="medium">
        <BoxTime
          background={time <= 5 ? undefined : 'dark-1'}
          label={time}
          size="xxlarge"
        />
        <LabelTimeLeft />
      </Box>
    )}
  </Box>
);
TimeLeft.propTypes = { time: PropTypes.number.isRequired };

const NextTalks = ({ restTalks, size }) =>
  restTalks.length < 1 ? (
    <Text textAlign="center">Último orador!</Text>
  ) : (
    <Box>
      <Text color="dark-3" textAlign="center">
        SIGUIENTES
        {size > 0 && ` (${size})`}
      </Text>
      {restTalks.map((t) => (
        <Row
          background="light-1"
          border={{ color: 'dark-3' }}
          direction="row-responsive"
          elevation="small"
          key={t.id}
          margin={{ top: 'small' }}
          pad="small"
          round
        >
          <Row alignContent="center">
            <TalkIcon />
            <Text>{t.name}</Text>
          </Row>
          <Text color="dark-5">{t.speaker.name}</Text>
        </Row>
      ))}
    </Box>
  );
NextTalks.propTypes = {
  restTalks: PropTypes.arrayOf(PropTypes.object).isRequired,
  size: PropTypes.number.isRequired,
};

const StartButton = (props) => (
  <Button color="status-warning" icon={<ClockIcon />} label="30''" primary {...props} />
);

const NextButton = (props) => (
  <ButtonLoading gap="none" icon={<NextIcon />} label="Siguiente" reverse {...props} />
);

const EmptyProjector = () => (
  <Box margin={{ top: 'large' }}>
    <EmptyData
      buttonText="Ir al OpenSpace"
      img={ideasFlow}
      onClick={usePushToOpenSpace()}
      text="No hay oradores para exponer"
    />
  </Box>
);

const TalkDetails = ({ talk }) => (
  <Box align="center">
    <Heading size="medium" margin="small">
      {talk.name}
    </Heading>
    <Text textAlign="center" size="xlarge">
      {talk.description}
    </Text>
    <Row>
      <UserIcon />
      <Text size="large">{talk.speaker.name}</Text>
    </Row>
  </Box>
);
TalkDetails.propTypes = {
  talk: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    speaker: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
  }).isRequired,
};

const OSProjector = () => {
  const user = useUser();
  const [time, setTime] = useState();
  const { data: { id, organizer } = {}, isPending, isRejected } = useGetOpenSpace();
  const queue = useQueue();
  // const pushToOS = usePushToOS();

  useInterval(() => {
    if (!time || time === 0) return;
    setTime(time - 1);
  }, 1000);

  if (isRejected) return <RedirectToRoot />;
  if (!user) return <RedirectToOS />;
  if (isPending) return <Spinner />;
  if (organizer.id !== user.id) return <RedirectToOS />;
  if (!queue) return <Spinner />;
  if (queue.length < 1) return <EmptyProjector />;

  const currentTalk = queue[0];
  const restTalks = queue.slice(1, 4);

  return (
    <>
      <RowBetween margin={{ vertical: 'medium' }}>
        {/* <Button icon={<PreviousIcon />} onClick={pushToOS} primary /> */}
        <StartButton onClick={() => setTime(TIME_FOR_SPEAKER)} />
        <NextButton
          onClick={() => {
            setTime(undefined);
            return nextTalk(id);
          }}
        />
      </RowBetween>
      <TalkDetails talk={currentTalk} />
      <Row
        direction="row-responsive"
        gap="large"
        justify="evenly"
        margin={{ top: 'medium' }}
      >
        {time !== undefined && <TimeLeft time={time} />}
        <NextTalks restTalks={restTalks} size={queue.length - 1} />
      </Row>
    </>
  );
};

export default OSProjector;
