import React from 'react';
import Button from './Button';

const IconButton = ({ icon, secondary = false, blackAndWhite = false, ...props }) => {
  if (!icon) throw new Error('Icon is required');

  return (
    <Button
      primary={!secondary}
      secondary={secondary}
      blackAndWhite={blackAndWhite}
      icon={icon}
      variant="circular"
      {...props}
    />
  );
};

export default IconButton;
