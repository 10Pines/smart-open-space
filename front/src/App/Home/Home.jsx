import React, { useCallback } from 'react';

import { useGetAllOpenSpaces } from '#api/os-client';
import { useUser } from '#helpers/useAuth';
import { OpenSpaceIcon } from '#shared/icons';
import MainHeader from '#shared/MainHeader';
import MyGrid from '#shared/MyGrid';
import Spinner from '#shared/Spinner';
import { RedirectToLogin, usePushToNewOS } from '#helpers/routes';

import EmptyOpenSpaces from './EmptyOpenSpaces';
import OpenSpace from './OpenSpace';
import { deleteOS } from '#api/os-client';

const Home = () => {
  const pushToNewOS = usePushToNewOS();
  const deleteOpenSpace = (osID) =>
    deleteOS(osID).then(() => {
      reload();
    });

  const { data: openSpaces, isPending, reload: reloadOpenSpaces } = useGetAllOpenSpaces();
  const reload = useCallback(() => {
    reloadOpenSpaces();
  }, [reloadOpenSpaces]);

  return (
    <>
      <MainHeader>
        <MainHeader.Title icon={OpenSpaceIcon} label="Mis Open Spaces" />
        <MainHeader.Buttons>
          {openSpaces && openSpaces.length > 0 && (
            <MainHeader.ButtonNew onClick={pushToNewOS} />
          )}
        </MainHeader.Buttons>
      </MainHeader>
      {isPending || !openSpaces ? (
        <Spinner />
      ) : openSpaces.length === 0 ? (
        <EmptyOpenSpaces onClick={pushToNewOS} />
      ) : (
        <MyGrid>
          {openSpaces.map((os) => (
            <OpenSpace deleteOS={() => deleteOpenSpace(os.id)} key={os.id} {...os} />
          ))}
        </MyGrid>
      )}
    </>
  );
};

export default () => (useUser() ? <Home /> : <RedirectToLogin />);
