import { Box, Text } from 'grommet';
import React from 'react';
import PropTypes from 'prop-types';

export const OtherSlot = ({ description }) => (
  <Box background={{ color: 'accent-1', opacity: 'medium' }} pad="medium" round="small">
    <Text alignSelf="center" color="dark-1">
      {description}
    </Text>
  </Box>
);
OtherSlot.propTypes = { description: PropTypes.string.isRequired };
