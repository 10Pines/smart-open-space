import React from 'react';

import {Button} from 'grommet';
import PropTypes from 'prop-types';
import Card from '#shared/Card.jsx';
import { usePushToTalk } from '#helpers/routes.jsx';
import { useParams } from 'react-router-dom';
import TalkTitle from "#app/OpenSpace/Talk/TalkTitle.jsx";
import TalkData from "#app/OpenSpace/Talk/TalkData.jsx";

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
      <Card pad={{top: "small", left: 'medium', right: "medium", bottom: 0}} key={id} borderColor={color} gap={"xsmall"} justify={false} backgroundColor={color} style={{width: "288px", height: "330px", borderRadius: "5px"}}>
        <TalkTitle name={name} track={track} pushToTalk={pushToTalk} />
        <TalkData talkLink={talkLink} room={room} showSpeakerName={showSpeakerName} realSpeakerName={realSpeakerName} >
            {children}
        </TalkData>
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
