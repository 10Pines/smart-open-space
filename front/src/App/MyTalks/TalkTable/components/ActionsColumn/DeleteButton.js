import ButtonLoading from '#shared/ButtonLoading';
import { DeleteIcon } from '#shared/icons';
import React from 'react';

export function DeleteButton(props) {
  return (
    <ButtonLoading
      icon={<DeleteIcon />}
      color={'transparent'}
      onClick={props.onClick}
      tooltipText={'Eliminar'}
    />
  );
}
