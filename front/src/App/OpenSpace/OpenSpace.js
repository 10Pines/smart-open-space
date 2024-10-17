import React, { useState } from 'react';
import { Box } from 'grommet';

import { activateQueue, finishQueue, useGetOpenSpace } from '#api/os-client';
import { useQueue } from '#api/sockets-client';
import { useUser } from '#helpers/useAuth';
import {
  RedirectToRoot,
  usePushToSchedule,
  usePushToEditOS,
  usePushToMyTalks,
  usePushToProjector,
  usePushToRoot,
  usePushToLoginFromOpenSpace,
} from '#helpers/routes';
import { ScheduleIcon } from '#shared/icons';
import MainHeader from '#shared/MainHeader';
import Spinner from '#shared/Spinner';
import { QueryForm } from './QueryForm';
import { DisplayTalks } from './DisplayTalks';
import useSize from '#helpers/useSize';
import { getControlButtons } from '#helpers/getControlButtons';
import ControlButtons from './buttons/ControlButtons';

const OpenSpace = () => {
  const user = useUser();
  const size = useSize();
  const [showQuery, setShowQuery] = useState(false);
  const { data = {}, isPending, isRejected, setData } = useGetOpenSpace();
  const queue = useQueue();
  const pushHandlers = {
    pushToSchedule: usePushToSchedule(data.id),
    pushToEditOS: usePushToEditOS(data.id),
    pushToMyTalks: usePushToMyTalks(),
    pushToProjector: usePushToProjector(),
    pushToRoot: usePushToRoot(),
    pushToLogin: usePushToLoginFromOpenSpace(data.id),
  };

  if (isPending) return <Spinner />;
  if (isRejected) return <RedirectToRoot />;

  const amTheOrganizer = user && data.organizer?.id === user.id;
  const apiHandlers = {
    doFinishQueue: () => finishQueue(data.id).then(setData),
    handleActivateQueue: () => activateQueue(data.id).then(setData),
  };

  const controlButtons = getControlButtons({
    amTheOrganizer,
    user,
    queue,
    setShowQuery,
    id: data.id,
    setData,
    ...pushHandlers,
    ...apiHandlers,
    ...data,
  });

  return (
    <>
      <Box>
        <MainHeader>
          <MainHeader.Title label={`Tablero de control: ${data.name}`} />
        </MainHeader>
        <ControlButtons controlButtons={controlButtons} size={size} />
      </Box>

      <Box>
        <MainHeader>
          <MainHeader.Title label={data.name} />
          <MainHeader.Description description={data.description} />
          {data.dates && (
            <MainHeader.Button
              margin={{ top: 'medium' }}
              color="accent-1"
              icon={<ScheduleIcon />}
              label="Agenda"
              onClick={pushHandlers.pushToSchedule}
            />
          )}
        </MainHeader>
      </Box>

      <Box>
        <MainHeader.Tracks tracks={data.tracks} />
        {data.finishedQueue && <MainHeader.SubTitle label="Marketplace finalizado" />}
      </Box>

      <Box margin={{ bottom: 'medium' }}>
        <DisplayTalks
          amountOfTalks={data.amountOfTalks}
          activeCallForPapers={data.isActiveCallForPapers}
          tracks={data.tracks}
          activeVoting={data.isActiveVoting}
          showSpeakerName={data.showSpeakerName}
        />
      </Box>

      {showQuery && (
        <QueryForm
          title="¿Seguro?"
          subTitle={`Queda${queue.length > 1 ? 'n' : ''} ${queue.length} en la cola`}
          onExit={() => setShowQuery(false)}
          onSubmit={apiHandlers.doFinishQueue}
        />
      )}
    </>
  );
};

export default OpenSpace;
