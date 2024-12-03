import React from 'react';

import {Avatar, Box, Button, Text} from 'grommet';
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

  console.log("ROOM:", room)
  return (
    <>
      <Card pad={{top: "medium", left: 'medium', right: "medium", bottom: 0}} key={id} borderColor={color} margin="xsmall" gap={"xsmall"} justify={false} backgroundColor={color} style={{width: "288px", height: "330px", borderRadius: "5px"}}>
        <Box align={"center"} height={"25px"}>
          {track && <Text>{track.name}</Text>}
        </Box>
        <Title style={{fontSize: "1.5rem", padding: 0, margin: 0, height: "100px", cursor: 'pointer', transition: 'text-decoration 0.2s ease',}}
               onClick={pushToTalk}
               onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
               onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
          {name}
        </Title>
        <Box gap={"small"} direction="column" width={"100%"} align={"center"} margin={{top: "medium"}}>
          <Box align={"center"} width={"100%"} height={"30px"}>
            {room && <Detail icon={HomeIcon} text={room.name} color={"dark-2"}/>}
          </Box>
          <Box align={"start"} width={"100%"} height={"30px"} margin={{bottom: "small"}}>
            {showSpeakerName &&
              <Box direction={"row"} gap={"small"} margin={{top: "medium"}}>
                <Avatar size="25px" src="https://cdn-icons-png.flaticon.com/512/149/149071.png" />
                <Text color={"dark-2"} size={"1.1rem"}>
                  {realSpeakerName}
                </Text>
              </Box>
            }
          </Box>
          <Box direction={"row"} gap={"small"}>
            {talkLink && <Button onClick={() => window.open(talkLink, '_blank')}/>}
            {children}
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
