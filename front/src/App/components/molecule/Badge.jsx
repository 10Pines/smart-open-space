import React from 'react';
import { Box } from 'grommet';
import IconButton from '../atom/IconButton';
import PropTypes from 'prop-types';

const Badge = ({
  icon,
  position,
  onClick,
  children,
  className,
  style,
  color,
  buttonProps = {
    size: 'xsmall',
  },
  ...props
}) => {
  const positionStyles = {
    'top-left': { top: '-10px', left: '-10px' },
    'top-right': { top: '-10px', right: '-10px' },
    'bottom-left': { bottom: '-10px', left: '-10px' },
    'bottom-right': { bottom: '-10px', right: '-10px' },
  };

  return (
    <Box
      className={className}
      style={{ position: 'relative', overflow: 'visible', ...style }}
      {...props}
    >
      {children}
      <IconButton
        icon={icon}
        onClick={onClick}
        plain
        style={{
          position: 'absolute',
          zIndex: 1,
          backgroundColor: color ?? '#FF4C4C',
          ...positionStyles[position],
        }}
        size={buttonProps.size}
      />
    </Box>
  );
};

Badge.propTypes = {
  position: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right']),
  icon: PropTypes.node,
  onClick: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
  buttonProps: PropTypes.object,
};

export default Badge;
