//! This is an old component, used on the project but subject to change.
import React from 'react';
import PropTypes from 'prop-types';
import { Box, Text } from 'grommet';

const FormTitle = ({ children, icon }) => (
  <Box direction="row" gap="small">
    <Text size="large">{children}</Text>
    {icon}
  </Box>
);

FormTitle.propTypes = {
  children: PropTypes.node.isRequired,
  icon: PropTypes.node.isRequired,
};

export default FormTitle;
