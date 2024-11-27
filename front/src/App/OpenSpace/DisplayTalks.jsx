import { RedirectToRoot, usePushToNewTalk } from '#helpers/routes';
import EmptyTalk from '../MyTalks/EmptyTalk';
import {Box, Button, Heading, Text} from 'grommet';
import { TrackWithTalks } from './TrackWithTalks';
import TalksGrid from './TalksGrid';
import React, {useState} from 'react';
import { useGetTalks } from '#api/os-client';
import Spinner from '#shared/Spinner';
import {FormDown, FormUp} from "grommet-icons";

export function DisplayTalks({
  amountOfTalks,
  activeCallForPapers,
  tracks,
  activeVoting,
  showSpeakerName,
}) {
  const [openTalksWithouTrack, setOpenTalksWithouTrack] = useState(false);
  const { data: talks, isPending, isRejected, reload: reloadTalks } = useGetTalks();
  const pushToNewTalk = usePushToNewTalk();
  const shouldDisplayEmptyTalk = amountOfTalks === 0 && activeCallForPapers;
  const shouldDisplayTrackWithTalks = tracks.length > 0 && amountOfTalks > 0;
  let talksWithoutTrack = [];
  if (isPending) return <Spinner />;
  if (isRejected) return <RedirectToRoot />;
  if (shouldDisplayEmptyTalk) {
    return <EmptyTalk onClick={pushToNewTalk} />;
  }

  if (shouldDisplayTrackWithTalks) {
    talksWithoutTrack = talks.filter((talk) => !talk.track);
    return (
      <>
        {tracks.map((track, index) => (
          <TrackWithTalks
            key={index}
            talks={talks}
            reloadTalks={reloadTalks}
            track={track}
            activeVoting={activeVoting}
            showSpeakerName={showSpeakerName}
          />
        ))}
        {talksWithoutTrack.length > 0 && (
          <Box direction={"column"}>
            <Box direction={"row"}
                 align={"center"}
                 justify={"between"}
                 margin={{top: "medium"}}
                 gap={"large"}
                 onClick={() => setOpenTalksWithouTrack((prevState) => !prevState)}
                 style={{
                   outline: "none",
                   backgroundColor: "#F4F4F4",
                   borderTopRightRadius: "5px",
                   borderTopLeftRadius: "5px"
                 }}>
              <Heading color={"dark-3"} size={"1.5rem"} margin={{bottom: "xxsmall", top: "xxsmall", left: "small"}}> Charlas sin track </Heading>
              <Button icon={openTalksWithouTrack ? <FormUp size={"medium"}/> : <FormDown size={"medium"}/>}/>
            </Box>
            <Box width="100%"
                 height="8px"
                 background={"gray"}
                 style={{
                   borderBottomRightRadius: "5px",
                   borderBottomLeftRadius: "5px"
                 }}/>
            {openTalksWithouTrack &&
              <TalksGrid
                talks={talksWithoutTrack}
                reloadTalks={reloadTalks}
                activeVoting={activeVoting}
                showSpeakerName={showSpeakerName}
              />}
          </Box>
        )}
      </>
    );
  }

  return (
    <>
      { talks.length > 0 &&
      <Box direction={"column"}>
        <Box direction={"row"}
             align={"center"}
             justify={"between"}
             margin={{top: "medium"}}
             gap={"large"}
             onClick={() => setOpenTalksWithouTrack((prevState) => !prevState)}
             style={{
               outline: "none",
               backgroundColor: "#F4F4F4",
               borderTopRightRadius: "5px",
               borderTopLeftRadius: "5px"
             }}>
          <Heading color={"dark-3"} size={"1.5rem"} margin={{bottom: "xxsmall", top: "xxsmall", left: "small"}}> Charlas sin track </Heading>
          <Button icon={openTalksWithouTrack ? <FormUp size={"medium"}/> : <FormDown size={"medium"}/>}/>
        </Box>
        <Box width="100%"
             height="8px"
             background={"gray"}
             style={{
               borderBottomRightRadius: "5px",
               borderBottomLeftRadius: "5px"
             }}/>
        {openTalksWithouTrack &&
          <TalksGrid
            talks={talksWithoutTrack}
            reloadTalks={reloadTalks}
            activeVoting={activeVoting}
            showSpeakerName={showSpeakerName}
          />}
      </Box>
      }
    </>
  );
}
