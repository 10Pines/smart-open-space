import { startCallForPapers, toggleShowSpeakerName, toggleVoting } from './api/os-client';

export const getControlButtons = ({
  amTheOrganizer,
  user,
  pendingQueue,
  activeQueue,
  ...props
}) => [
  ...(amTheOrganizer ? getOrganizerButtons(props) : []),
  ...(user ? getUserButtons(props) : []),
  ...(pendingQueue || activeQueue ? getQueueButtons(props) : []),
];

const getOrganizerButtons = ({
  isActiveCallForPapers,
  isActiveVoting,
  showSpeakerName,
  pushToEditOS,
  pushToMyTalks,
  id,
  setData,
}) => [
  {
    label: 'Editar',
    onClick: pushToEditOS,
  },
  {
    label: isActiveCallForPapers ? 'Cerrar convocatoria' : 'Abrir convocatoria',
    onClick: () => startCallForPapers(id).then(setData),
  },
  {
    label: isActiveVoting ? 'Cerrar votación' : 'Abrir votación',
    onClick: () => toggleVoting(id).then(setData),
  },
  {
    label: showSpeakerName ? 'No Mostrar Speaker' : 'Mostrar Speaker',
    onClick: () => toggleShowSpeakerName(id).then(setData),
  },
  {
    label: 'Gestionar Charlas',
    onClick: pushToMyTalks,
  },
];

const getUserButtons = ({ pushToMyTalks, pushToProjector }) => [
  {
    label: 'Mis charlas',
    onClick: pushToMyTalks,
  },
  {
    label: 'Proyector',
    onClick: pushToProjector,
  },
];

const getQueueButtons = ({
  pendingQueue,
  activeQueue,
  queue,
  setShowQuery,
  doFinishQueue,
  activateQueue,
}) => [
  {
    label: pendingQueue ? 'Finalizar MarketPlace' : 'Abrir MarketPlace',
    onClick: () =>
      handleMarketplaceQueueState({
        pendingQueue,
        activeQueue,
        queue,
        setShowQuery,
        doFinishQueue,
        activateQueue,
      }),
  },
];

const handleMarketplaceQueueState = async ({
  pendingQueue,
  activeQueue,
  queue,
  setShowQuery,
  doFinishQueue,
  activateQueue,
}) => {
  if (pendingQueue) {
    return activateQueue();
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
