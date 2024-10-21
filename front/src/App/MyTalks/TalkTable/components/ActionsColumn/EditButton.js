import ButtonLoading from '#shared/ButtonLoading';
import { EditIcon } from '#shared/icons';
import React from 'react';

export function EditButton(props) {
  return (
    <ButtonLoading
      icon={<EditIcon />}
      color={'transparent'}
      onClick={props.onClick}
      tooltipText={'Editar'}
    />
  );
}
