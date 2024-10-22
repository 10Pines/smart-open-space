import MainHeader from '#shared/MainHeader';
import { LockIcon, UnlockIcon } from '#shared/icons';
import { startCallForPapers } from '#api/os-client';
import React from 'react';

export const ButtonToSwitchCallForPapers = ({
  openSpaceID,
  setData,
  isActiveCallForPapers,
  ...props
}) => (
  <MainHeader.Button
    color="accent-4"
    icon={isActiveCallForPapers ? <LockIcon /> : <UnlockIcon />}
    label={isActiveCallForPapers ? 'Cerrar convocatoria' : 'Abrir convocatoria'}
    onClick={() => startCallForPapers(openSpaceID).then(setData)}
    {...props}
  />
);
