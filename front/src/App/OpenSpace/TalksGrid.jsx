import React from 'react';
import MyGrid from '#shared/MyGrid';
import Talk from './Talk/Talk.jsx';
import { Vote } from './Vote';

const TalksGrid = ({ talks, reloadTalks, activeVoting, assignedTalks, showSpeakerName }) => {
  return (
    <MyGrid>
      {talks.map((talk) => {
        const room = assignedTalks.find(assignedTalk => assignedTalk.id === talk.id);
        return (
          <Talk key={talk.id} talk={talk} showSpeakerName={showSpeakerName} room={room}>
            <Vote talk={talk} reloadTalks={reloadTalks} activeVoting={activeVoting}/>
          </Talk>
        )
      })}
    </MyGrid>
  );
};

export default TalksGrid;
