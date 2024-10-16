import React from 'react';
import {
  CartIcon,
  EditIcon,
  LockIcon,
  TalkIcon,
  UnlockIcon,
  VideoIcon,
} from '#shared/icons';
import { startCallForPapers, toggleShowSpeakerName, toggleVoting } from './api/os-client';

export const getControlButtons = ({
  amTheOrganizer,
  user,
  pendingQueue,
  activeQueue,
  ...props
}) => {
  return [
    ...(amTheOrganizer ? getOrganizerButtons(props) : []),
    ...(user ? getUserButtons({ amTheOrganizer, ...props }) : []),
    ...(amTheOrganizer ? getQueueButtons({ ...props, activeQueue, pendingQueue }) : []),
  ];
};

const getLockIcon = (isActive) => (isActive ? <LockIcon /> : <UnlockIcon />);

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
    icon: <EditIcon />,
  },
  {
    label: isActiveCallForPapers ? 'Cerrar convocatoria' : 'Abrir convocatoria',
    onClick: () => startCallForPapers(id).then(setData),
    icon: getLockIcon(isActiveCallForPapers),
  },
  {
    label: isActiveVoting ? 'Cerrar votación' : 'Abrir votación',
    onClick: () => toggleVoting(id).then(setData),
    icon: getLockIcon(isActiveVoting),
  },
  {
    label: showSpeakerName ? 'No Mostrar Speaker' : 'Mostrar Speaker',
    onClick: () => toggleShowSpeakerName(id).then(setData),
    icon: getLockIcon(showSpeakerName),
  },
  {
    label: 'Gestionar Charlas',
    onClick: pushToMyTalks,
    icon: <TalkIcon />,
  },
];

const getUserButtons = ({ amTheOrganizer, pushToMyTalks }) =>
  [
    !amTheOrganizer && {
      label: 'Mis charlas',
      onClick: pushToMyTalks,
      icon: <TalkIcon />,
    },
  ].filter(Boolean);

const getQueueButtons = ({
  pendingQueue,
  activeQueue,
  queue,
  setShowQuery,
  doFinishQueue,
  handleActivateQueue,
  pushToProjector,
}) =>
  [
    {
      label: 'Proyector',
      onClick: pushToProjector,
      icon: <VideoIcon />,
    },
    (pendingQueue || activeQueue) && {
      label: activeQueue ? 'Finalizar MarketPlace' : 'Abrir MarketPlace',
      onClick: () =>
        handleMarketplaceQueueState({
          pendingQueue,
          activeQueue,
          queue,
          setShowQuery,
          doFinishQueue,
          handleActivateQueue,
        }),
      icon: <CartIcon />,
    },
  ].filter(Boolean);

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
