import React, {useState} from 'react';
import {Grid, Box, Text, Button as GrommetButton, Notification} from 'grommet';
import Button from './Button';
import Switch from "react-switch";
import {startCallForPapers, toggleShowSpeakerName, toggleVoting} from "#api/os-client.js";
import {TalkIcon, VideoIcon} from "#shared/icons.jsx";

const ControlButtons = ({ pushHandlers, apiHandlers, data, setData, size, setShowQuery }) => {
  const [visible, setVisible] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const handleMarketplaceQueueState = async ({
     pendingQueue,
     activeQueue,
     queue,
     setShowQuery,
     doFinishQueue,
     handleActivateQueue,
   }) => {
    if (pendingQueue) {
      return handleActivateQueue();
    }

    if (activeQueue) {
      return await determineQueueAction({ queue, setShowQuery, doFinishQueue });
    }
  };

  const determineQueueAction = async ({ queue, setShowQuery, doFinishQueue }) => {
    if (queue && queue.length > 0) {
      setShowQuery(true);
      return Promise.resolve();
    }
    return doFinishQueue();
  };

  return (
    <Grid
      columns={{
        count: size === 'small' ? 1 : 3,
        size: size === 'small' ? 'auto' : '1/' + '3',
      }}
      gap="1rem"
      responsive
    >
      <Box direction={"row"} gap="xsmall">
        <Switch onChange={() => toggleVoting(data.id).then(newData => {
            setData(newData)
            setVisible(true)
            setNotificationMessage(newData.isActiveVoting ? "Se abrio la votación de charlas" : "Se cerró la votación de charlas")
          }
        )} checked={data.isActiveVoting}/>
        <Text>{'Abrir votación'}</Text>
      </Box>

      <Box direction={"row"} gap="xsmall">
        <Switch onChange={() => toggleShowSpeakerName(data.id).then(newData => {
          setData(newData)
          setVisible(true)
          setNotificationMessage(newData.showSpeakerName ? "Se muestra el nombre de los speakers en las charlas" : "No se muestra el nombre de los speakers en las charlas")
        })} checked={data.showSpeakerName} />
        <Text>{'Mostrar Speaker'}</Text>
      </Box>

      <Button onClick={pushHandlers.pushToMyTalks} label={"Gestionar charlas"} icon={<TalkIcon/>}/>

      <Box direction={"row"} gap="xsmall">
        <Switch onChange={() => {
          startCallForPapers(data.id).then(newData => {
            setData(newData)
            setVisible(true)
            setNotificationMessage(newData.isActiveCallForPapers ? "Convocatoria abierta" : "Convocatoria cerrada")
            }
          )
        }} checked={data.isActiveCallForPapers} />
        <Text>Abrir convocatoria</Text>
      </Box>

      <Box direction={"row"} gap="xsmall">
        <Switch onChange={() =>
          handleMarketplaceQueueState({
            pendingQueue: data.pendingQueue,
            activeQueue: data.activeQueue ,
            queue: data.queue,
            setShowQuery,
            doFinishQueue: apiHandlers.doFinishQueue,
            handleActivateQueue: apiHandlers.handleActivateQueue,
          }).then(() =>
            {
              setVisible(true)
              setNotificationMessage(data.activeQueue ? "Se cerró el marketplace" : "Se inició el marketplace" )
            }
          )} checked={data.activeQueue} disabled={!data.pendingQueue && !data.activeQueue}/>
        <Text>{(!data.pendingQueue && !data.activeQueue) ? "Marketplace finalizado" : "Abrir marketplace"}</Text>
        {data.activeQueue && <GrommetButton onClick={pushHandlers.pushToProjector} size={'small'} label={"Proyector"} icon={<VideoIcon />} margin={{left: 'small'}}/>}
      </Box>
      {visible && (
        <Notification
          toast
          title={notificationMessage}
          message="descripción"
          onClose={() => setVisible(false)}
        />
      )}
    </Grid>
  );
};

export default ControlButtons;
