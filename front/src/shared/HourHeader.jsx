import React from 'react';
import { Box, Grid } from 'grommet';
import PropTypes from 'prop-types';

const Dots = ({ gridArea }) => (
  <Box
    alignSelf="center"
    border={{ size: 'xsmall', style: 'dashed' }}
    gridArea={gridArea}
  />
);
Dots.propTypes = {
  gridArea: PropTypes.string.isRequired,
};

const HourHeader = ({ hour }) => (
  <Grid
    areas={[['left', 'main', 'right']]}
    columns={['flex', 'xsmall', 'flex']}
    rows={['xxsmall']}
  >
    <Dots gridArea="left" />
    <Box align="center" alignSelf="center" gridArea="main" flex>
      {`${hour} hs`}
    </Box>
    <Dots gridArea="right" />
  </Grid>
);
HourHeader.propTypes = {
  hour: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default HourHeader;
