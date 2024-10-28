import React from 'react';
import { Anchor, Box } from 'grommet';
import ProjectHistory from '#shared/ProjectHistory';
import logo10PinesWhite from '#assets/10Pines-logo-white.png';
import logoUnquiWhite from '#assets/unqui-logo-white.png';
import logoSmartOpenSpace from '#assets/footer_logo.svg';
import useSize from '#helpers/useSize';

const Footer = () => {
  const [show, setShow] = React.useState();
  const isSmall = useSize() === 'small';

  return (
    <Box
      direction="row"
      justify="between"
      align="center"
      background="typography"
      height={{
        min: '120px',
      }}
      pad={{
        horizontal: 'large',
      }}
    >
      <div style={{ display: 'flex', flex: 1, alignItems: 'flex-start' }}>
        <img src={logoSmartOpenSpace} alt="Smart Open Space Footer Logo" height="80px" />
      </div>
      {!isSmall && (
        <Anchor
          label="Historia"
          onClick={() => setShow(true)}
          color="white"
          weight="normal"
          size="small"
        />
      )}
      {show && <ProjectHistory close={() => setShow(false)} />}
      <div
        style={{
          display: 'flex',
          flex: 1,
          ...(isSmall
            ? {
                flexDirection: 'column',
                alignItems: 'flex-end',
              }
            : {
                justifyContent: 'flex-end',
                gap: '2rem',
              }),
        }}
      >
        <a href="https://www.10pines.com/" target="_blank" rel="noopener noreferrer">
          <img
            src={logo10PinesWhite}
            width="130px"
            alt="10Pines Logo"
            style={{ cursor: 'pointer' }}
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
