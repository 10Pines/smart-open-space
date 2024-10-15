import { startCallForPapers, toggleShowSpeakerName, toggleVoting } from './api/os-client';

export const getControlButtons = ({
  amTheOrganizer,
  isActiveCallForPapers,
  isActiveVoting,
  showSpeakerName,
  user,
  pendingQueue,
  activeQueue,
  queue,
  setShowQuery,
  doFinishQueue,
  handleActivateQueue,
  pushToEditOS,
  pushToMyTalks,
  pushToProjector,
  id,
  setData,
}) => [
  {
    label: 'Editar',
    showIf: amTheOrganizer,
    onClick: pushToEditOS,
  },
  {
    label: isActiveCallForPapers ? 'Cerrar convocatoria' : 'Abrir convocatoria',
    showIf: amTheOrganizer,
    onClick: () => startCallForPapers(id).then(setData),
  },
  {
    label: isActiveVoting ? 'Cerrar votación' : 'Abrir votación',
    showIf: amTheOrganizer,
    onClick: () => toggleVoting(id).then(setData),
  },
  {
    label: showSpeakerName ? 'No Mostrar Speaker' : 'Mostrar Speaker',
    showIf: amTheOrganizer,
    onClick: () => toggleShowSpeakerName(id).then(setData),
  },
  {
    label: amTheOrganizer ? 'Gestionar Charlas' : 'Mis charlas',
    showIf: user,
    onClick: pushToMyTalks,
  },
  {
    label: 'Proyector',
    showIf: user,
    onClick: pushToProjector,
  },
  {
    label: pendingQueue
      ? 'Finalizar MarketPlace'
      : activeQueue
      ? 'Abrir MarketPlace'
      : null,
    showIf: pendingQueue || activeQueue,
    onClick: pendingQueue
      ? handleActivateQueue
      : activeQueue
      ? () => {
          if (queue && queue.length > 0) {
            setShowQuery(true);
            return Promise.resolve();
          }
          return doFinishQueue();
        }
      : undefined,
  },
];
