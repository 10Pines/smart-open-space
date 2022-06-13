import { RedirectToRoot, usePushToNewTalk } from '#helpers/routes';
import EmptyTalk from '../MyTalks/EmptyTalk';
import { TrackWithTalks } from './TrackWithTalks';
import TalksGrid from './TalksGrid';
import React from 'react';
import { useGetTalks } from '#api/os-client';
import Spinner from '#shared/Spinner';

export function DisplayTalks({ amountOfTalks, activeCallForPapers, tracks }) {
  const { data: talks, isPending, isRejected, reload: reloadTalks } = useGetTalks();
  const pushToNewTalk = usePushToNewTalk();
  const shouldDisplayEmptyTalk = amountOfTalks === 0 && activeCallForPapers;
  const shouldDisplayTrackWithTalks = tracks.length > 0 && amountOfTalks > 0;
  if (isPending) return <Spinner />;
  if (isRejected) return <RedirectToRoot />;
  if (shouldDisplayEmptyTalk) {
    return <EmptyTalk onClick={pushToNewTalk} />;
  }

  if (shouldDisplayTrackWithTalks) {
    return tracks.map((track) => (
      <TrackWithTalks talks={talks} reloadTalks={reloadTalks} track={track} />
    ));
  }

  return <TalksGrid talks={talks} reloadTalks={reloadTalks} />;
}
