import React from 'react';

import { Box } from 'grommet';
import PropTypes from 'prop-types';

import MyProps from '#helpers/MyProps';

const Card = ({ borderColor, borderSide = 'top', children, backgroundColor, justify = true, ...props }) => (
  <Box
    background={backgroundColor ? backgroundColor : "light-1"}
    border={{ color: borderColor, size: 'medium', side: borderSide, style: 'outset' }}
    elevation="small"
    pad="medium"
    round
    justify={justify && "between"}
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
