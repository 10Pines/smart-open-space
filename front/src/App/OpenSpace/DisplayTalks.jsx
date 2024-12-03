import { RedirectToRoot, usePushToNewTalk } from '#helpers/routes';
import EmptyTalk from '../MyTalks/EmptyTalk';
import { Heading } from 'grommet';
import { TrackWithTalks } from './TrackWithTalks';
import TalksGrid from './TalksGrid';
import React from 'react';
import {useGetAssignedSlots, useGetTalks} from '#api/os-client';
import Spinner from '#shared/Spinner';
import {getAssignedTalks} from "#helpers/talkUtils.js";

export function DisplayTalks({
  amountOfTalks,
  activeCallForPapers,
  tracks,
  activeVoting,
  showSpeakerName,
}) {
  const { data: talks, isPending, isRejected, reload: reloadTalks } = useGetTalks();
  const  {
    data: assignedSlots,
    isPending: areAssignedSlotsPending,
    isRejected: assignedSlotsRejected,
  } = useGetAssignedSlots();
  const pushToNewTalk = usePushToNewTalk();
  const shouldDisplayEmptyTalk = amountOfTalks === 0 && activeCallForPapers;
  const shouldDisplayTrackWithTalks = tracks.length > 0 && amountOfTalks > 0;
  let talksWithoutTrack = [];
  if (isPending || areAssignedSlotsPending) return <Spinner />;
  if (isRejected || assignedSlotsRejected) return <RedirectToRoot />;
  if (shouldDisplayEmptyTalk) {
    return <EmptyTalk onClick={pushToNewTalk} />;
  }
  const assignedTalks = getAssignedTalks(talks, assignedSlots);

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
            assignedTalks={assignedTalks}
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
          assignedTalks={assignedTalks}
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
