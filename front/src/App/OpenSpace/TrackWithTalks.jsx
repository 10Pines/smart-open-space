import {Box, Text} from 'grommet';
import TalksGrid from './TalksGrid';
import React, {useState} from 'react';
import * as PropTypes from 'prop-types';
import TrackDropdown from "#app/OpenSpace/TrackDropdown.jsx";

export function TrackWithTalks({
  talks,
  reloadTalks,
  track,
  activeVoting,
  showSpeakerName,
}) {
  let byTrack = (talk) => talk.track?.id === track.id;
  const talksFromTrack = talks.filter(byTrack);
  const [openTrackInfo, setOpenTrackInfo] = useState(true);


  return (
    <>
      {talksFromTrack.length > 0 && (
        <TrackDropdown title={track.name} color={track.color} openTalks={openTrackInfo} toggleDropdown={() => setOpenTrackInfo((prevState) => !prevState)}>
            <Box direction={"column"}>
              <Text margin={{left: "small", right: "small", top:"xsmall"}} color={"dark-2"}>{track.description}</Text>
              <TalksGrid
                talks={talksFromTrack}
                reloadTalks={reloadTalks}
                activeVoting={activeVoting}
                showSpeakerName={showSpeakerName}
              />
            </Box>
        </TrackDropdown>
      )}
    </>
  );
}

TrackWithTalks.propTypes = {
  track: PropTypes.object.isRequired,
};
