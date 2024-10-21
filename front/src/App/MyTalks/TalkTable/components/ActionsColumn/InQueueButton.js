import ButtonLoading from '#shared/ButtonLoading';
import { InProgress } from 'grommet-icons';
import React from 'react';

export function InQueueButton(props) {
  return (
    <ButtonLoading
      icon={<InProgress />}
      color={'transparent'}
      onClick={props.onClick}
      tooltipText={'Esperando turno'}
      disabled
    />
  );
}
