import ButtonLoading from '#shared/ButtonLoading';
import { QueueIcon } from '#shared/icons';
import React from 'react';

export function QueueButton(props) {
  return (
    <ButtonLoading
      icon={<QueueIcon />}
      color={'transparent'}
      onClick={props.onClick}
      tooltipText={'Encolar'}
    />
  );
}
