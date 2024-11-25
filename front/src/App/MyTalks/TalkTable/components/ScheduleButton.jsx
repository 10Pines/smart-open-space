import ButtonLoading from '#shared/ButtonLoading.jsx';
import React from 'react';

export function ScheduleButton({ onClick, tooltipText, icon, label }) {
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
