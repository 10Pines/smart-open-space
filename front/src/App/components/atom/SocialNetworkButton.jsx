import React from 'react';
import Button from './Button';

const SocialNetworkButton = ({ icon, children = 'SocialNetwork', ...props }) => {
  if (!icon) {
    throw new Error('Icon is required');
  }

  if (typeof children !== 'string') {
    throw new Error('Children must be a string');
  }

  return (
    <Button
      variant="square"
      autoWidth
      secondary
      blackAndWhite
      icon={icon}
      style={{
        minWidth: '150px',
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

export default SocialNetworkButton;
