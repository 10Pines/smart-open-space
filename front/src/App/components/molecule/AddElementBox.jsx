import React from 'react';
import { Box } from 'grommet';
import IconButton from '../atom/IconButton';
import { AddIcon } from '#shared/icons';
import PropTypes from 'prop-types';

const AddElementBox = ({ onClick, size = '200px' }) => {
  const [isHovering, setIsHovering] = React.useState(false);

  return (
    <Box
      height={size.height ?? size}
      width={size.width ?? size}
      border={{ color: 'primary', size: 'medium', style: 'dashed' }}
      round="small"
      align="center"
      justify="center"
      style={{ cursor: 'pointer' }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={onClick}
      focusIndicator={false}
    >
      <IconButton size="small" icon={<AddIcon size="1rem" />} logicHover={isHovering} />
    </Box>
  );
};

AddElementBox.propTypes = {
  onClick: PropTypes.func,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({ width: PropTypes.string, height: PropTypes.string }),
  ]),
};

export default AddElementBox;
