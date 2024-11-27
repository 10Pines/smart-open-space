import { RedirectToRoot, usePushToNewTalk } from '#helpers/routes';
import EmptyTalk from '../MyTalks/EmptyTalk';
import {Box, Button, Heading, Text} from 'grommet';
import { TrackWithTalks } from './TrackWithTalks';
import TalksGrid from './TalksGrid';
import React, {useState} from 'react';
import { useGetTalks } from '#api/os-client';
import Spinner from '#shared/Spinner';
import {FormDown, FormUp} from "grommet-icons";
import TrackDropdown from "#app/OpenSpace/TrackDropdown.jsx";

export function DisplayTalks({
  amountOfTalks,
  activeCallForPapers,
  tracks,
  activeVoting,
  showSpeakerName,
}) {
  const [openTalksWithouTrack, setOpenTalksWithouTrack] = useState(true);
  const { data: talks, isPending, isRejected, reload: reloadTalks } = useGetTalks();
  const pushToNewTalk = usePushToNewTalk();
  const shouldDisplayEmptyTalk = amountOfTalks === 0 && activeCallForPapers;
  const shouldDisplayTrackWithTalks = tracks.length > 0 && amountOfTalks > 0;
  if (isPending) return <Spinner />;
  if (isRejected) return <RedirectToRoot />;
  if (shouldDisplayEmptyTalk) {
    return <EmptyTalk onClick={pushToNewTalk} />;
  }
  const talksWithoutTrack = talks.filter((talk) => !talk.track);

  return (
    <>
      {shouldDisplayTrackWithTalks && tracks.map((track, index) => (
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
        <TrackDropdown color={"dark-3"} title={"Charlas sin track"} openTalks={openTalksWithouTrack} toggleDropdown={() => setOpenTalksWithouTrack((prevState) => !prevState)}>
          <TalksGrid
            talks={talksWithoutTrack}
            reloadTalks={reloadTalks}
            activeVoting={activeVoting}
            showSpeakerName={showSpeakerName}
          />
        </TrackDropdown>
      )}
    </>
  );
}
