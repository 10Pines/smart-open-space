import React from 'react';

import { Grid } from 'grommet';
import MyProps from '#helpers/MyProps';

const MyGrid = ({ children, columns="250px" }) => (
  <Grid columns={columns} gap="medium" margin={{ vertical: 'medium' }}>
    {children}
  </Grid>
);
MyGrid.propTypes = { children: MyProps.children };

export default MyGrid;
