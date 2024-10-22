import React from 'react';

import { Box } from 'grommet';
import PropTypes from 'prop-types';

import MyProps from '#helpers/MyProps';

const Card = ({ borderColor, borderSide = 'top', children, ...props }) => (
  <Box
    background="light-1"
    border={{ color: borderColor, size: 'medium', side: borderSide, style: 'outset' }}
    elevation="small"
    pad="medium"
    round
    justify="between"
    {...props}
  >
    {children}
  </Box>
);
Card.propTypes = {
  borderColor: PropTypes.string,
  borderSide: PropTypes.string,
  children: MyProps.children.isRequired,
};

export default Card;
