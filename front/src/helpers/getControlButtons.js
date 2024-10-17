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
import { Login } from 'grommet-icons';

export const getControlButtons = ({
  amTheOrganizer,
  user,
  pendingQueue,
  activeQueue,
  ...props
}) => {
  const buttonConfigs = [
    {
      condition: amTheOrganizer,
      getButtons: () => getOrganizerButtons(props),
    },
    {
      condition: user,
      getButtons: () => getUserButtons({ amTheOrganizer, ...props }),
    },
    {
      condition: amTheOrganizer,
      getButtons: () => getQueueButtons({ ...props, activeQueue, pendingQueue }),
    },
    {
      condition: !user,
      getButtons: () => getUnloggedButtons({ pushToLogin: props.pushToLogin }),
    },
  ];

  const buttons = buttonConfigs
    .filter(({ condition }) => condition)
    .flatMap(({ getButtons }) => getButtons());

  return sortButtonsByOrder(buttons);
};

const sortButtonsByOrder = (buttons) => {
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
  id,
  setData,
  setShowDeleteModal,
}) => [
  {
    label: 'Editar',
    onClick: pushToEditOS,
    icon: <EditIcon />,
    category: 'os',
    order: 1,
  },
  {
    label: 'Eliminar',
    onClick: () => setShowDeleteModal(true),
    icon: <DeleteIcon />,
    category: 'os',
    order: 2,
  },
  {
    label: isActiveCallForPapers ? 'Cerrar convocatoria' : 'Abrir convocatoria',
    onClick: () => startCallForPapers(id).then(setData),
    icon: getLockIcon(isActiveCallForPapers),
    category: 'convocatoria',
    order: 4,
  },
  {
    label: isActiveVoting ? 'Cerrar votación' : 'Abrir votación',
    onClick: () => toggleVoting(id).then(setData),
    icon: getLockIcon(isActiveVoting),
    category: 'convocatoria',
    order: 5,
  },
  {
    label: showSpeakerName ? 'No Mostrar Speaker' : 'Mostrar Speaker',
    onClick: () => toggleShowSpeakerName(id).then(setData),
    icon: getLockIcon(showSpeakerName),
    category: 'convocatoria',
    order: 6,
  },
  {
    label: 'Gestionar Charlas',
    onClick: pushToMyTalks,
    icon: <TalkIcon />,
    category: 'os',
    order: 3,
  },
];

const getUserButtons = ({ amTheOrganizer, pushToMyTalks }) =>
  [
    !amTheOrganizer && {
      label: 'Mis charlas',
      onClick: pushToMyTalks,
      icon: <TalkIcon />,
      category: 'os',
      order: 2,
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
    activeQueue && {
      label: 'Proyector',
      onClick: pushToProjector,
      icon: <VideoIcon />,
      category: 'marketplace',
      order: 8,
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
      category: 'marketplace',
      order: 7,
    },
  ].filter(Boolean);

const getUnloggedButtons = ({ pushToLogin }) => [
  {
    label: 'Iniciar sesión',
    onClick: pushToLogin,
    icon: <Login />,
    category: 'os',
    order: 1,
  },
];

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
