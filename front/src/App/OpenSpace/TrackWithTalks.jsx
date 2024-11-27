import {Box, Button, Heading, Text} from 'grommet';
import TalksGrid from './TalksGrid';
import React, {useState} from 'react';
import * as PropTypes from 'prop-types';
import {Bold, FormDown, FormUp} from "grommet-icons";

export function TrackWithTalks({
  talks,
  reloadTalks,
  track,
  activeVoting,
  showSpeakerName,
}) {
  let byTrack = (talk) => talk.track?.id === track.id;
  const talksFromTrack = talks.filter(byTrack);
  const [openTrackInfo, setOpenTrackInfo] = useState(false);


  return (
    <>
      {talksFromTrack.length > 0 && (
        <Box direction={"column"}>
          <Box direction={"row"}
               align={"center"}
               justify={"between"}
               margin={{top: "medium"}}
               gap={"large"}
               onClick={() => setOpenTrackInfo((prevState) => !prevState)}
               style={{
                 outline: "none",
                 backgroundColor: "#F4F4F4",
                 borderTopRightRadius: "5px",
                 borderTopLeftRadius: "5px"
          }}>
            <Heading color={"dark-3"} size={"1.5rem"} margin={{bottom: "xxsmall", top: "xxsmall", left: "small"}}> {track.name} </Heading>
            <Button icon={openTrackInfo ? <FormUp size={"medium"}/> : <FormDown size={"medium"}/>}/>
          </Box>
          <Box width="100%"
               height="8px"
               background={track.color}
               style={{
                 borderBottomRightRadius: "5px",
                 borderBottomLeftRadius: "5px"
               }}/>
          {openTrackInfo &&
            <Box direction={"column"}>
              <Text margin={{left: "small", right: "small", top:"xsmall"}}>{track.description}</Text>
              <TalksGrid
                talks={talksFromTrack}
                reloadTalks={reloadTalks}
                activeVoting={activeVoting}
                showSpeakerName={showSpeakerName}
              />
            </Box>}
        </Box>
      )}
    </>
  );
}

TrackWithTalks.propTypes = {
  track: PropTypes.object.isRequired,
};
