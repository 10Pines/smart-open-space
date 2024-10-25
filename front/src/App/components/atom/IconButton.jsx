import React from 'react';
import Button from './Button';

/**
 * <Button
      autoWidth
      secondary
      blackAndWhite
      icon={<HaltIcon />}
      variant="circular"
    >
      Hola
    </Button>
 */

const IconButton = ({
  // children = 'Button',
  icon,
  secondary = false,
  blackAndWhite = false,
  ...props
}) => {
  // if (typeof children !== 'string') throw new Error('Children must be a string');
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
