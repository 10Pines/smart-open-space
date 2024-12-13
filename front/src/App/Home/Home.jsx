import React, { useCallback } from 'react';

import { useGetAllOpenSpaces } from '#api/os-client';
import { useUser } from '#helpers/useAuth';
import {ChatIcon, OpenSpaceIcon, UserIcon} from '#shared/icons';
import MainHeader from '#shared/MainHeader';
import MyGrid from '#shared/MyGrid';
import Spinner from '#shared/Spinner';
import { RedirectToLogin, usePushToNewOS } from '#helpers/routes';

import EmptyOpenSpaces from './EmptyOpenSpaces';
import OpenSpace from './OpenSpace';
import { deleteOS } from '#api/os-client';
import TimeCard from "#components/molecule/TimeCard.jsx";

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

  if (openSpaces && openSpaces.length > 0) {
    console.log("OS:", openSpaces[1]);
  }

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
              <>
            {/*<OpenSpace deleteOS={() => deleteOpenSpace(os.id)} key={os.id} {...os} />*/}
            <TimeCard
                id={os.id}
            time={{
            start: os.startDate,
            end: os.endDate,
          }}
            dates={os.dates}
          title={os.name}
          description={os.description}
            author={os.organizer}
          footerDescription={{
            items: [
              {
                icon: <UserIcon />,
                text: "3 oradores",
              },
              {
                icon: <ChatIcon />,
                text: `${os.amountOfTalks} ${os.amountOfTalks === 1 ? "charla postulada" : "charlas postuladas"}`,
              },
            ],
          }}
        />
              </>
          ))}
        </MyGrid>
      )}
    </>
  );
};

export default () => (useUser() ? <Home /> : <RedirectToLogin />);
