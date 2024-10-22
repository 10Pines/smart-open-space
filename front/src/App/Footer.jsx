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
      {show && <ProjectHistory close={() => setShow(false)} />}
      <div style={{ textAlign: 'center', alignItems: 'center' }}>
        <a href="https://www.10pines.com/" target="_blank" rel="noopener noreferrer">
          <img
            src={logo10PinesWhite}
            width="130px"
            alt="10Pines Logo"
            style={{ paddingRight: '2rem', cursor: 'pointer' }}
          />
        </a>
        <a href="https://www.unq.edu.ar/" target="_blank" rel="noopener noreferrer">
          <img
            src={logoUnquiWhite}
            width="130px"
            alt="UNQ logo"
            style={{ cursor: 'pointer' }}
          />
        </a>
      </div>
    </Box>
  );
};

export default Footer;
