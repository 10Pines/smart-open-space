import React from 'react';

import { createTalk, useGetOpenSpace } from '#api/os-client';
import { useUser } from '#helpers/useAuth';
import Spinner, { TinySpinner } from '#shared/Spinner';
import { RedirectToRoot, usePushToMyTalks } from '#helpers/routes';
import { TalkForm } from './TalkForm';

const NewTalk = () => {
  const user = useUser();
  const { data: openSpace, isPending, isRejected } = useGetOpenSpace();
  const pushToMyTalks = usePushToMyTalks();

  if (isPending) return <Spinner />;
  if (isRejected) return <RedirectToRoot />;

  const subtitle = isPending ? <TinySpinner /> : openSpace.name;
  const amTheOrganizer = user && openSpace.organizer.id === user.id;

  if (!user || isRejected) return <RedirectToRoot />;
  if (openSpace && openSpace.finishedQueue) return <RedirectToRoot />;

  const onSubmit = ({ name, description, meetingLink, track, documents, speakerName }) =>
    createTalk(openSpace.id, {
      name,
      description,
      meetingLink,
      documents,
      trackId: track && track.id,
      speakerName: speakerName,
    }).then(pushToMyTalks);

  return (
    <TalkForm
      onSubmit={onSubmit}
      openSpace={openSpace}
      subtitle={subtitle}
      title={'Nueva charla'}
      amTheOrganizer={amTheOrganizer}
    />
  );
};

export default NewTalk;
