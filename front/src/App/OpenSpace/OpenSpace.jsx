import React, {useState} from 'react';
import {Box, Button, Text, Tip} from 'grommet';

import {activateQueue, deleteOS, finishQueue, useGetOpenSpace, useGetTalks} from '#api/os-client';
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
import {ChatIcon, DeleteIcon, EditIcon, ScheduleIcon} from '#shared/icons';
import MainHeader from '#shared/MainHeader';
import Spinner from '#shared/Spinner';
import { QueryForm } from './QueryForm';
import { DisplayTalks } from './DisplayTalks';
import useSize from '#helpers/useSize';
import ControlButtons from './buttons/ControlButtons';
import ConfirmationDialog from '#shared/ConfirmationDialog';

const OpenSpace = () => {
  const user = useUser();
  const size = useSize();
  const [showQuery, setShowQuery] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);

  const { data = {}, isPending, isRejected, setData } = useGetOpenSpace();
  const { data: talks } = useGetTalks();
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

  return (
    <>
      { amTheOrganizer && <Box margin={{bottom: "large", top: "medium"}}>
        <MainHeader.Title label={"Tablero de control"} />
        <ControlButtons pushHandlers={pushHandlers} size={size} data={data} apiHandlers={apiHandlers} setData={setData} setShowQuery={setShowQuery} margin={{top: "medium"}}/>
      </Box> }

      <MainHeader.Title label={data.name}>
        {amTheOrganizer &&
          <Box direction={"row"}>
            <Tip content={"Editar"}>
              <Button
                size={"medium"}
                margin={{ left: 'medium' }}
                color="accent-5"
                icon={<EditIcon />}
                onClick={pushHandlers.pushToEditOS}
                />
            </Tip>
            <Tip content={"Eliminar"}>
              <Button
                size={"medium"}
                margin={{ left: 'medium' }}
                color="accent-5"
                icon={<DeleteIcon />}
                onClick={() => setShowDeleteModal(true)}
              />
            </Tip>
          </Box>
        }
      </MainHeader.Title>

      {data.description && <MainHeader.Description description={data.description}/>}

      <Box direction={'row-responsive'} gap={'medium'} justify={!user ? "between" : undefined} margin={{top: "small", bottom: "small"}}>
        { data.dates && (
          <MainHeader.Button
            margin={{ top: 'medium' }}
            color="accent-1"
            icon={<ScheduleIcon />}
            label="Agenda"
            onClick={pushHandlers.pushToSchedule}
            style={{width:'10rem'}}
          />
        )}
        { user && !amTheOrganizer &&
          <MainHeader.Button
            margin={{ top: 'medium' }}
            color="accent-5"
            icon={<ChatIcon />}
            label="Mis charlas"
            onClick={pushHandlers.pushToMyTalks}
            style={{borderColor:"#7D4CDBFF"}}
          />
        }
        { !user &&
          <Box gap={"xxsmall"} align={'center'}>
            <Text weight={"bold"}>Es tu oportunidad para hablar de ese tema</Text>
            <MainHeader.Button
              color="accent-3"
              icon={<ChatIcon />}
              label="Proponé una charla!"
              onClick={pushHandlers.pushToLogin}
            />
          </Box>
        }
      </Box>

      <Box margin={{top: "medium"}}>
        <MainHeader.Tracks tracks={data.tracks} talks={talks} setSelectedTrack={setSelectedTrack} />
      </Box>

      <Box margin={{ bottom: 'medium' }}>
        <DisplayTalks
          amountOfTalks={data.amountOfTalks}
          activeCallForPapers={data.isActiveCallForPapers}
          tracks={data.tracks}
          activeVoting={data.isActiveVoting}
          showSpeakerName={data.showSpeakerName}
          selectedTrack={selectedTrack}
          setSelectedTrack={setSelectedTrack}
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
        buttonLabels = {{ confirm: 'Eliminar', cancel: 'Cancelar' }}
        confirmationButtonProps={{backgroundColor: "#c84b4b", border: "solid 1px #D32F2F", color: "white"}}
      />
    </>
  );
};

export default OpenSpace;
