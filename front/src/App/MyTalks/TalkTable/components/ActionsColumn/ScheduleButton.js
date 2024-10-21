import ButtonLoading from '#shared/ButtonLoading';
import { ScheduleIcon } from '#shared/icons';
import React from 'react';

export function ScheduleButton(props) {
  return (
    <ButtonLoading
      icon={<ScheduleIcon />}
      color={'transparent'}
      onClick={props.onClick}
      tooltipText={'Agendar'}
    />
  );
}
