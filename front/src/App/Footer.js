import React from 'react';
import { Anchor, Box } from 'grommet';
import ProjectHistory from '#shared/ProjectHistory';
import logo10PinesWhite from '#assets/10Pines-logo-white.png';
import logoUnquiWhite from '#assets/unqui-logo-white.png';

const Footer = () => {
  const [show, setShow] = React.useState();
  return (
    <Box direction="row" justify="between" align="center">
      <Anchor label="Historia" onClick={() => setShow(true)} color="white" />
      {show && <ProjectHistory />}
      <div style={{ textAlign: 'center', alignItems: 'center' }}>
        <img
          src={logo10PinesWhite}
          width="130px"
          alt="10Pines Logo"
          style={{ paddingRight: '2rem' }}
        />
        <img src={logoUnquiWhite} width="130px" alt="UNQ logo" />
      </div>
    </Box>
  );
};

export default Footer;
