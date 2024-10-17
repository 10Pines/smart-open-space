import React from 'react';
import {
  CartIcon,
  DeleteIcon,
  EditIcon,
  LockIcon,
  TalkIcon,
  UnlockIcon,
  VideoIcon,
} from '#shared/icons';
import {
  deleteOS,
  startCallForPapers,
  toggleShowSpeakerName,
  toggleVoting,
} from './api/os-client';

export const getControlButtons = ({
  amTheOrganizer,
  user,
  pendingQueue,
  activeQueue,
  ...props
}) => {
  const buttons = [
    ...(amTheOrganizer ? getOrganizerButtons(props) : []),
    ...(user ? getUserButtons({ amTheOrganizer, ...props }) : []),
    ...(amTheOrganizer ? getQueueButtons({ ...props, activeQueue, pendingQueue }) : []),
  ];

  // Ordenar los botones según la propiedad "order" si está definida
  return buttons.sort((a, b) => {
    const orderA = a.order ?? Number.MAX_VALUE;
    const orderB = b.order ?? Number.MAX_VALUE;
    return orderA - orderB;
  });
};

const getLockIcon = (isActive) => (isActive ? <LockIcon /> : <UnlockIcon />);

const getOrganizerButtons = ({
  isActiveCallForPapers,
  isActiveVoting,
  showSpeakerName,
  pushToEditOS,
  pushToMyTalks,
  pushToRoot,
  id,
  setData,
}) => [
  {
    label: 'Editar',
    onClick: pushToEditOS,
    icon: <EditIcon />,
    category: 'general', // Categoría para la primera columna
    order: 1, // Orden personalizado
  },
  {
    label: 'Eliminar',
    onClick: () => deleteOS(id).then(() => pushToRoot()),
    icon: <DeleteIcon />,
    category: 'general', // Categoría para la primera columna
    order: 2, // Orden personalizado
  },
  {
    label: isActiveCallForPapers ? 'Cerrar convocatoria' : 'Abrir convocatoria',
    onClick: () => startCallForPapers(id).then(setData),
    icon: getLockIcon(isActiveCallForPapers),
    category: 'action', // Categoría para la segunda columna
    order: 4, // Orden personalizado
  },
  {
    label: isActiveVoting ? 'Cerrar votación' : 'Abrir votación',
    onClick: () => toggleVoting(id).then(setData),
    icon: getLockIcon(isActiveVoting),
    category: 'action', // Categoría para la segunda columna
    order: 5, // Orden personalizado
  },
  {
    label: showSpeakerName ? 'No Mostrar Speaker' : 'Mostrar Speaker',
    onClick: () => toggleShowSpeakerName(id).then(setData),
    icon: getLockIcon(showSpeakerName),
    category: 'general', // Categoría para la segunda columna
    order: 3, // Orden personalizado
  },
  {
    label: 'Gestionar Charlas',
    onClick: pushToMyTalks,
    icon: <TalkIcon />,
    category: 'management', // Categoría para la tercera columna
    order: 7, // Orden personalizado
  },
];

const getUserButtons = ({ amTheOrganizer, pushToMyTalks }) =>
  [
    !amTheOrganizer && {
      label: 'Mis charlas',
      onClick: pushToMyTalks,
      icon: <TalkIcon />,
      category: 'general', // Categoría para la primera columna
      order: 2, // Orden personalizado
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
      category: 'management', // Categoría para la primera columna
      order: 8, // Orden personalizado
    },
    (pendingQueue || activeQueue) && {
      label: activeQueue ? 'Finalizar MarketPlace' : 'Iniciar MarketPlace',
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
      category: 'action', // Categoría para la segunda columna
      order: 6, // Orden personalizado
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
