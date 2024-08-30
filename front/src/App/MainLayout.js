import React from 'react';
import { Box, Grid } from 'grommet';

import MyProps from '#helpers/MyProps';
import useSize from '#helpers/useSize';
import Footer from './Footer';

const areasThree = [
  ['headerL', 'header', 'headerR'],
  ['l', 'main', 'r'],
  ['l', 'footer', 'r'],
];

const layouts = {
  small: {
    areas: [['header'], ['main'], ['footer']],
    columns: ['flex'],
    pad: { horizontal: 'medium' },
  },
  medium: { areas: areasThree, columns: ['flex', 'large', 'flex'] },
  large: { areas: areasThree, columns: ['flex', 'xlarge', 'flex'] },
};

const useMainLayout = () => layouts[useSize()];

const BoxBrand = ({ children, ...props }) => (
  <Box background="brand" {...props}>
    {children}
  </Box>
);
BoxBrand.propTypes = { children: MyProps.children };

const MainLayout = ({ children, header }) => {
  const { areas, columns, pad } = useMainLayout();

  return (
    <Box>
      <Box fill background="light-3" overflow="auto">
        <Grid areas={areas} columns={columns} fill rows={['xxsmall', 'flex']}>
          <BoxBrand gridArea="headerL" className={'header'} />
          <BoxBrand gridArea="headerR" className={'header'} />
          <BoxBrand gridArea="header" pad={pad} className={'header'}>
            {header}
          </BoxBrand>
          <Box as="main" gridArea="main" pad={pad} style={{ minHeight: '92vh' }}>
            <div>{children}</div>
          </Box>
          <Box gridArea="footer" fill background="light-3" overflow="visible" pad={pad}>
            <Footer />
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};
MainLayout.propTypes = {
  children: MyProps.children.isRequired,
  header: MyProps.children.isRequired,
};

export default MainLayout;
