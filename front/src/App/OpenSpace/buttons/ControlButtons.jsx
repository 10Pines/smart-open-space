import React, {useState} from 'react';
import {Grid, Box, Text, Notification, Tip, Button as GrommetButton} from 'grommet';
import Button from '../../components/atom/Button.jsx';
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
            setNotificationMessage(newData.isActiveVoting ? "Se abrió la votación de charlas" : "Se cerró la votación de charlas")
          }
        )} checked={data.isActiveVoting}/>
        <Text>{'Abrir votación'}</Text>
      </Box>

      <Box direction={"row"} gap="xsmall">
        <Switch onChange={() => toggleShowSpeakerName(data.id).then(newData => {
          setData(newData)
          setVisible(true)
          setNotificationMessage(newData.showSpeakerName ? "Se muestra el nombre de los speakers en las charlas" : "Se ocultó el nombre de los speakers en las charlas")
        })} checked={data.showSpeakerName} />
        <Text>{'Mostrar Speaker'}</Text>
      </Box>

      <Button onClick={pushHandlers.pushToMyTalks} label={"Gestionar charlas"} icon={<TalkIcon/>} style={{width:'20rem'}}/>

      <Box direction={"row"} gap="xsmall">
        <Switch onChange={() => {
          startCallForPapers(data.id).then(newData => {
            setData(newData)
            setVisible(true)
            setNotificationMessage(newData.isActiveCallForPapers ? "Convocatoria abierta para agregar charlas" : "Convocatoria cerrada: no se pueden agregar charlas")
            }
          )
        }} checked={data.isActiveCallForPapers} />
        <Text>Abrir convocatoria</Text>
      </Box>

      <Box direction={"row"} gap="xsmall" align={"center"}>
        <Tip content={data.finishedQueue ? "El marketplace se puede iniciar una única vez" : ""}>
          <Box>
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
              )} checked={data.activeQueue} disabled={data.finishedQueue}/>
            </Box>
        </Tip>
        <Text>{(data.finishedQueue) ? "Marketplace finalizado" : "Abrir marketplace"}</Text>
        {data.activeQueue && <GrommetButton onClick={pushHandlers.pushToProjector} size={'small'} label={"Proyector"} icon={<VideoIcon />} margin={{left: 'small'}} style={{backgroundColor: "#ffebb4", border: "solid 1px #ffebb4"}}/>}
      </Box>
      {visible && (
        <Notification
          toast
          time={3000}
          title={notificationMessage}
          onClose={() => setVisible(false)}
        />
      )}
    </Grid>
  );
};

export default ControlButtons;
