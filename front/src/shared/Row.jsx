import React from 'react';

import { Box } from 'grommet';
import MyProps from '#helpers/MyProps';

const Row = ({ children, ...props }) => (
  <Box align="center" direction="row" gap="small" {...props}>
    {children}
  </Box>
);
Row.propTypes = { children: MyProps.children };

export default Row;
