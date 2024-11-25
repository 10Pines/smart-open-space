import ButtonLoading from '#shared/ButtonLoading';
import { ScheduleIcon } from '#shared/icons';
import React from 'react';

export function ActionButton({ onClick, tooltipText, icon, label }) {
  return (
    <ButtonLoading
      icon={icon}
      color={'transparent'}
      onClick={onClick}
      tooltipText={tooltipText}
      hoverIndicator={true}
      label={label}
      style={{fontWeight: "normal"}}
    />
  );
}
