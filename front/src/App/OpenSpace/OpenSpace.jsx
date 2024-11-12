import React, { useState } from 'react';
import {Box, Button, Text} from 'grommet';

import { activateQueue, deleteOS, finishQueue, useGetOpenSpace } from '#api/os-client';
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
import ConfirmationDialog from '#shared/ConfirmationDialog';

const OpenSpace = () => {
  const user = useUser();
  const size = useSize();
  const [showQuery, setShowQuery] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
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
    setShowDeleteModal,
    ...pushHandlers,
    ...apiHandlers,
    ...data,
  });

  return (
    <>
      { amTheOrganizer && <Box>
        <MainHeader>
          <MainHeader.Title label={`Tablero de control: ${data.name}`} />
        </MainHeader>
        <ControlButtons controlButtons={controlButtons} size={size} withIcons />
      </Box> }

      <Text as={'h1'}>{data.name}</Text>
      <Text as={'h2'}>{data.description}</Text>
      <Box direction={'row-responsive'} gap={'medium'}>
        {data.dates && (
          <Button
            margin={{ top: 'medium' }}
            color="accent-1"
            icon={<ScheduleIcon />}
            label="Agenda"
            onClick={pushHandlers.pushToSchedule}
          />
        )}
        { user && !amTheOrganizer &&
          <Button
              margin={{ top: 'medium' }}
              color="accent-1"
              label="Mis charlas"
            />
        }
        { !user &&
          <Box direction={'row'} gap={'medium'} style={{marginLeft: '5rem'}}>
            <Text>Es tu momento para agregar una charla!</Text>
            <Button label={"Participar"}/>
          </Box>
        }
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

      <ConfirmationDialog
        isOpen={showDeleteModal}
        message="¿Estás seguro de que deseas eliminar la convocatoria?"
        onConfirm={() => deleteOS(data.id).then(() => pushHandlers.pushToRoot())}
        onCancel={() => setShowDeleteModal(false)}
      />
    </>
  );
};

export default OpenSpace;
