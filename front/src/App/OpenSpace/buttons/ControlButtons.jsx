import React, {useState} from 'react';
import { Box, Notification } from 'grommet';
import Button from '../../components/atom/Button.jsx';
import {startCallForPapers, toggleShowSpeakerName, toggleVoting} from "#api/os-client.js";
import {TalkIcon} from "#shared/icons.jsx";
import ControlSwitch from "#app/OpenSpace/buttons/ControlSwitch.jsx";
import MarketPlaceSwitch from "#app/OpenSpace/buttons/MarketPlaceSwitch.jsx";

const ControlButtons = ({ pushHandlers, apiHandlers, data, setData, setShowQuery, ...props }) => {
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
    <Box
      direction={"row-responsive"}
      gap={"10rem"}
      {...props}
    >
      <Box direction={"column"} gap={"medium"} margin={{bottom: "medium"}}>
        <ControlSwitch
          onChange={() => toggleVoting(data.id).then(newData => {
            setData(newData)
            setVisible(true)
            setNotificationMessage(newData.isActiveVoting ? "Se abrió la votación de charlas" : "Se cerró la votación de charlas")
          }
          )}
          checked={data.isActiveVoting}
          text={'Abrir votación'}
        />

        <ControlSwitch
          onChange={() => toggleShowSpeakerName(data.id).then(newData => {
            setData(newData)
            setVisible(true)
            setNotificationMessage(newData.showSpeakerName ? "Se muestra el nombre de los speakers en las charlas" : "Se ocultó el nombre de los speakers en las charlas")
          })}
          checked={data.showSpeakerName}
          text={'Mostrar Speaker'}
          />
      </Box>

      <Box direction={"column"} gap={"medium"} margin={{bottom: "medium"}}>
        <ControlSwitch
          onChange={() => {
            startCallForPapers(data.id).then(newData => {
                setData(newData)
                setVisible(true)
                setNotificationMessage(newData.isActiveCallForPapers ? "Convocatoria abierta para agregar charlas" : "Convocatoria cerrada: no se pueden agregar charlas")
              }
            )
          }}
          checked={data.isActiveCallForPapers}
          text={"Abrir convocatoria"}
        />

        <MarketPlaceSwitch
          onChange={() =>
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
            )}
          checked={data.activeQueue}
          disabled={data.finishedQueue}
          finishedQueue={data.finishedQueue}
          activeQueue={data.activeQueue}
          pushToProjector={pushHandlers.pushToProjector}
        />
      </Box>

      <Button onClick={pushHandlers.pushToMyTalks} label={"Gestionar charlas"} icon={<TalkIcon/>} margin={{bottom: "medium"}} style={{height: "3rem", width:'18rem', maxWidth: "80%"}}/>

      {visible && (
        <Notification
          toast
          time={3000}
          title={notificationMessage}
          onClose={() => setVisible(false)}
        />
      )}
    </Box>
  );
};

export default ControlButtons;
