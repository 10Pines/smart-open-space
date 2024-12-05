import React from 'react';

import {Avatar, Box, Button, Text, Tip} from 'grommet';
import PropTypes from 'prop-types';
import HeadphonesIcon from "../../assets/headphones.png"
import Card from '#shared/Card';
import Detail from '#shared/Detail';
import {HomeIcon} from '#shared/icons';
import Title from '#shared/Title';
import { usePushToTalk } from '#helpers/routes';
import { useParams } from 'react-router-dom';

const ButtonMoreInfo = ({ onClick }) => (
  <Button
    alignSelf="center"
    color="accent-3"
    label="Más Info"
    onClick={onClick}
    primary
  />
);
ButtonMoreInfo.propTypes = { onClick: PropTypes.func.isRequired };

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

  const color = track ? track.color : '#e4e4e4';
  const talkLink = meetingLink || room?.link;

  return (
    <>
      <Card pad={{top: "small", left: 'medium', right: "medium", bottom: 0}} key={id} borderColor={color} margin="xsmall" gap={"xsmall"} justify={false} backgroundColor={color} style={{width: "288px", height: "330px", borderRadius: "5px"}}>
        <Box align={"center"} height={"35px"} width={"100%"}>
          {track && <Text textAlign={"center"} style={{ fontStyle: 'italic', lineHeight: "1rem", fontSize: "16px" }}>{track.name}</Text>}
        </Box>
        <Title style={{fontSize: "1.3rem", padding: 0, margin: 0, maxHeight: "120px", height: "120px", cursor: 'pointer', transition: 'text-decoration 0.2s ease', textWrap: "wrap"}}
               truncate
               onClick={pushToTalk}
               onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
               onMouseLeave={(e) => e.target.style.textDecoration = 'none'}>
          {name}
        </Title>
        <Box gap={"small"} direction="column" width={"100%"} align={"center"} margin={{top: "10px"}}>
          <Box direction={"column"} gap={"15px"} align={"center"} width={"100%"} height={"25px"}>
            {room &&
              <Detail icon={HomeIcon} text={room.name} color={"dark-2"}/>
            }
          </Box>
          <Box align={"start"} width={"100%"} height={"35px"} margin={{top: "5px"}}>
            {showSpeakerName &&
              <Box direction={"row"} gap={"small"}>
                <Avatar size="25px" src="https://cdn-icons-png.flaticon.com/512/149/149071.png"/>
                <Text color={"dark-2"} size={"1.1rem"}>
                  {realSpeakerName}
                </Text>
              </Box>
            }
          </Box>
          <Box direction={"row"} gap={"medium"} width={"100%"} justify={"end"} margin={{top: "10px"}}>
            <Tip content={"Ir a la reunión"}>
              <Box>
                {talkLink && <Avatar style={{border: "solid 1px gray", padding: "3px"}} size={"30px"} src={HeadphonesIcon} onClick={() => window.open(talkLink, '_blank')}/>}
              </Box>
            </Tip>
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
