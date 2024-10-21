import ButtonLoading from '#shared/ButtonLoading';
import { TransactionIcon } from '#shared/icons';
import React from 'react';

export function RescheduleButton(props) {
  return (
    <ButtonLoading
      icon={<TransactionIcon />}
      color={'transparent'}
      onClick={props.onClick}
      tooltipText={'Reagendar'}
    />
  );
}
