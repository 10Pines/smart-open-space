import { Button } from 'grommet';
import { AddIcon } from '#shared/icons';
import React from 'react';

export const PlusButton = ({
  conditionToDisable,
  onChange,
  value,
  item,
  initialItem,
  setItem,
  ...props
}) => {
  return (
    <Button
      icon={<AddIcon />}
      disabled={conditionToDisable}
      onClick={() => {
        if (conditionToDisable) return;
        onChange({ value: [...value, item] });
        setItem(initialItem);
      }}
      {...props}
    />
  );
};
