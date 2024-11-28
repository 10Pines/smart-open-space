import { RedirectToRoot, usePushToNewTalk } from '#helpers/routes';
import EmptyTalk from '../MyTalks/EmptyTalk';
import { TrackWithTalks } from './TrackWithTalks';
import TalksGrid from './TalksGrid';
import React, {useState} from 'react';
import { useGetTalks } from '#api/os-client';
import Spinner from '#shared/Spinner';
import TrackDropdown from "#app/OpenSpace/TrackDropdown.jsx";
import {TALKS_WITHOUT_TRACKS_TITLE} from "#shared/constants.js";

export function DisplayTalks({
  amountOfTalks,
  activeCallForPapers,
  tracks,
  activeVoting,
  showSpeakerName,
  selectedTrack,
  setSelectedTrack,
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
          selectedTrack={selectedTrack}
          setSelectedTrack={setSelectedTrack}
        />
      ))}
      {talksWithoutTrack.length > 0 && (
        <TrackDropdown
          color={"dark-3"}
          title={TALKS_WITHOUT_TRACKS_TITLE}
          openTalks={openTalksWithouTrack}
          toggleDropdown={() => setOpenTalksWithouTrack((prevState) => !prevState)}
          selectedTrack={selectedTrack}
          setSelectedTrack={setSelectedTrack}
        >
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
