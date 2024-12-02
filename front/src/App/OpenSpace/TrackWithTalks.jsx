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
  selectedTrack,
  setSelectedTrack,
}) {
  let byTrack = (talk) => talk.track?.id === track.id;
  const talksFromTrack = talks.filter(byTrack);
  const [openTrackInfo, setOpenTrackInfo] = useState(true);


  return (
    <>
        <TrackDropdown
          title={track.name}
          color={track.color}
          openTalks={openTrackInfo} toggleDropdown={() => setOpenTrackInfo((prevState) => !prevState)}
          selectedTrack={selectedTrack}
          setSelectedTrack={setSelectedTrack}
        >
            <Box direction={"column"}>
              <Text margin={{left: "small", right: "small", top:"xsmall"}} color={"dark-2"}>{track.description}</Text>
              {talksFromTrack.length > 0 ?
                <TalksGrid
                  talks={talksFromTrack}
                  reloadTalks={reloadTalks}
                  activeVoting={activeVoting}
                  showSpeakerName={showSpeakerName}
              /> :
              <Text margin={{left: "small", right: "small", top:"xsmall"}} color={"dark-3"} size={"1rem"}>Todavía no hay charlas de este eje temático</Text>
              }
            </Box>
        </TrackDropdown>

    </>
  );
}

TrackWithTalks.propTypes = {
  track: PropTypes.object.isRequired,
};
