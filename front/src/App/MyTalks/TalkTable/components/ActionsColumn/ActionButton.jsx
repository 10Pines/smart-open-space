import ButtonLoading from '#shared/ButtonLoading';
import { ScheduleIcon } from '#shared/icons';
import React from 'react';

export function ActionButton({ onClick, tooltipText, icon }) {
  return (
    <ButtonLoading
      icon={icon}
      color={'transparent'}
      onClick={onClick}
      tooltipText={tooltipText}
    />
  );
}
