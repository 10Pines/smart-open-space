import React from 'react';

import { createTalk, useGetOpenSpace } from '#api/os-client';
import { useUser } from '#helpers/useAuth';
import { TinySpinner } from '#shared/Spinner';
import { RedirectToRoot, usePushToMyTalks } from '#helpers/routes';
import { TalkForm } from './TalkForm';

const NewTalk = () => {
  const user = useUser();
  const { data: openSpace, isPending, isRejected } = useGetOpenSpace();
  const subtitle = isPending ? <TinySpinner /> : openSpace.name;
  const pushToMyTalks = usePushToMyTalks();

  if (!user || isRejected) return <RedirectToRoot />;
  if (openSpace && openSpace.finishedQueue) return <RedirectToRoot />;

  const onSubmit = ({ name, description, meetingLink, track, documents }) =>
    createTalk(openSpace.id, {
      name,
      description,
      meetingLink,
      documents,
      trackId: track && track.id,
    }).then(pushToMyTalks);

  return (
    <TalkForm
      onSubmit={onSubmit}
      openSpace={openSpace}
      subtitle={subtitle}
      title={'Nueva charla'}
    />
  );
};

export default NewTalk;
