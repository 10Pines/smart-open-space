import { useUser } from '#helpers/useAuth';
import { editTalk, useGetOpenSpace, useGetTalk } from '#api/os-client';
import Spinner from '#shared/Spinner';
import { RedirectToRoot, usePushToMyTalks } from '#helpers/routes';
import { TalkForm } from './TalkForm';
import React from 'react';

const EditTalk = () => {
  const user = useUser();
  const {
    data: talk,
    isPending: isTalkPending,
    isRejected: isTalkRejected,
  } = useGetTalk();
  const { data: openSpace, isPending, isRejected } = useGetOpenSpace();
  const pushToMyTalks = usePushToMyTalks();

  if (isTalkPending) return <Spinner />;
  if (!user || isRejected || isTalkRejected) return <RedirectToRoot />;

  const onSubmit = ({ name, description, meetingLink, track, documents }) => {
    editTalk(openSpace.id, talk.id, {
      name,
      description,
      meetingLink,
      trackId: track && track.id,
      documents,
    }).then(pushToMyTalks);
  };
  return (
    <TalkForm
      initialValues={talk}
      onSubmit={onSubmit}
      openSpace={openSpace}
    />
  );
};

export default EditTalk;
