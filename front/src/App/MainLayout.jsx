import React from 'react';
import { Box, Grid } from 'grommet';

import MyProps from '#helpers/MyProps';
import useSize from '#helpers/useSize';
import Footer from './Footer';
import { getLayoutGeneralPadding } from '#helpers/layoutUtils';

const areasThree = [
  ['headerL', 'header', 'headerR'],
  ['l', 'main', 'r'],
  ['footerL', 'footer', 'footerR'],
];

const layouts = {
  small: {
    areas: [['header'], ['main'], ['footer']],
    columns: ['flex'],
    pad: { horizontal: 'medium' },
  },
  medium: { areas: areasThree, columns: ['xsmall', 'flex', 'xsmall'] },
  large: { areas: areasThree, columns: ['xsmall', 'flex', 'xsmall'] },
};

const useMainLayout = () => layouts[useSize()];

const BoxBrand = ({ children, ...props }) => (
  <Box background="brand" {...props}>
    {children}
  </Box>
);
BoxBrand.propTypes = { children: MyProps.children };

const MainLayout = ({ children, header }) => {
  const { areas, columns } = useMainLayout();

  const pad = getLayoutGeneralPadding(useSize());

  // ! POR AHORA
  const NavBar = () => {
    return (
      <Box as="header" pad={pad}>
        {header}
      </Box>
    );
  };

  return (
    <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <NavBar />
      {/* //TODO: Make the next box customizable, as a color or an img */}
      <Box
        as="section"
        height={{ min: 'calc((100vh - 100px) / 2)' }}
        background={{ color: 'primary', opacity: '35%' }}
      />
      <Box
        as="div"
        background="background"
        pad={{
          horizontal: pad.horizontal,
        }}
        style={{ flex: 1 }}
        margin={{
          bottom: '2rem',
        }}
      >
        <Box
          as="main"
          background="background"
          margin={{
            top: 'calc(-1 * ((100vh - 100px) / 4))',
          }}
          pad={pad}
          round="xsmall"
        >
          {children}
        </Box>
      </Box>
      <Footer />
    </Box>
  );
};
MainLayout.propTypes = {
  children: MyProps.children.isRequired,
  header: MyProps.children.isRequired,
};

export default MainLayout;
