import React from 'react';

import {Box, Button, Text} from 'grommet';
import PropTypes from 'prop-types';

import Card from '#shared/Card';
import Detail from '#shared/Detail';
import { HomeIcon, UserIcon } from '#shared/icons';
import Title from '#shared/Title';
import { usePushToTalk } from '#helpers/routes';
import { useParams } from 'react-router-dom';

const ButtonMoreInfo = ({ onClick }) => (
  <Button
    alignSelf="center"
    color="accent-3"
    label="Mas Info"
    onClick={onClick}
    primary
  />
);
ButtonMoreInfo.propTypes = { onClick: PropTypes.func.isRequired };

const ButtonGoToLink = ({ onClick }) => (
  <Button
    alignSelf="center"
    color="accent-4"
    label="Ir a reunion"
    onClick={onClick}
    primary
  />
);

const Talk = ({
  talk: { id, name, speaker, meetingLink, track, speakerName },
  room,
  children,
  showSpeakerName,
}) => {
  const realSpeakerName = speakerName || speaker.name;
  const pushToTalk = usePushToTalk(
    useParams().id,
    id,
    showSpeakerName ? realSpeakerName : null
  );

  const color = track ? track.color : 'gray';
  const talkLink = meetingLink || room?.link;
  console.log("Track", track)
  return (
    <>
      <Card key={id} borderColor={color} margin="xsmall" gap="small" backgroundColor={color} style={{width: "288px", height: "330px"}}>
        {children}
        {track && <Text>{track.name}</Text>}
        <Title>{name}</Title>
        <Box gap="medium">
          {showSpeakerName && <Detail icon={UserIcon} text={realSpeakerName} />}
          {room && <Detail icon={HomeIcon} text={room.name} />}
          {/*<ButtonMoreInfo onClick={() => pushToTalk()} />*/}
          {talkLink && <ButtonGoToLink onClick={() => window.open(talkLink, '_blank')} />}
          <Box direction={"row"}>

          </Box>
        </Box>
      </Card>
    </>
  );
};
Talk.propTypes = {
  room: PropTypes.shape(),
  talk: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    speaker: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
  }).isRequired,
};

export default Talk;
