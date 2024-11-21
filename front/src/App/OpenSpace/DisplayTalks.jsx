import { RedirectToRoot, usePushToNewTalk } from '#helpers/routes';
import EmptyTalk from '../MyTalks/EmptyTalk';
import { Heading } from 'grommet';
import { TrackWithTalks } from './TrackWithTalks';
import TalksGrid from './TalksGrid';
import React from 'react';
import { useGetTalks } from '#api/os-client';
import Spinner from '#shared/Spinner';

export function DisplayTalks({
  amountOfTalks,
  activeCallForPapers,
  tracks,
  activeVoting,
  showSpeakerName,
}) {
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
          <Heading color="gray" size="sm">
            Sin track
          </Heading>
        )}
        <TalksGrid
          talks={talksWithoutTrack}
          reloadTalks={reloadTalks}
          activeVoting={activeVoting}
          showSpeakerName={showSpeakerName}
        />
      </>
    );
  }

  return (
    <>
      { talks.length > 0 &&
        <Heading color="gray" size="sm">
          Sin track
        </Heading>
      }
      <TalksGrid
        talks={talks}
        reloadTalks={reloadTalks}
        activeVoting={activeVoting}
        showSpeakerName={showSpeakerName}
      />
    </>
  );
}
