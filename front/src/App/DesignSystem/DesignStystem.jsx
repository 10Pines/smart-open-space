import React from 'react';
import { Box, Text } from 'grommet';
import Button from '#components/atom/Button';
import {
  AddIcon,
  FacebookIcon,
  GoogleIcon,
  HaltIcon,
  InstagramIcon,
  NotesIcon,
} from '#shared/icons';
import SocialNetworkButton from '../components/atom/SocialNetworkButton';

const DesignSystem = () => {
  const DesignSystemSection = ({ title, children }) => (
    <Box
      background={{
        color: 'light-1',
      }}
      direction="column"
      pad="small"
      round="small"
    >
      <Text as={'h2'} size="xlarge" margin="none">
        {title}
      </Text>
      <Box
        height={{ min: '5rem' }}
        margin={{
          top: 'small',
        }}
      >
        {children}
      </Box>
    </Box>
  );

  // TODO: Extraer componente
  const Divider = ({ horizontal = false, margin }) =>
    !horizontal ? (
      <Box
        background={{
          color: 'light-4',
        }}
        width="1px"
        margin={{
          horizontal: margin ?? 'medium',
        }}
      />
    ) : (
      <Box
        background={{
          color: 'light-4',
        }}
        height="1px"
        width={'100%'}
        margin={{
          vertical: margin ?? 'medium',
        }}
      />
    );

  const DSButtons = (props) => (
    <Box direction="row" gap="small" {...props}>
      <Box direction="column" style={{ flex: 1 }} gap="1rem">
        <Button>Nuevo +</Button>
        <Button loading>Nuevo +</Button>
        <Button secondary>Nuevo +</Button>
        <Button blackAndWhite>Nuevo +</Button>
        <Button blackAndWhite secondary>
          Nuevo +
        </Button>
      </Box>
      <Divider />
      <Box direction="column" style={{ flex: 1 }} align="center">
        <Box direction="row" gap="1rem" justify="center" flex="grow" align="center" wrap>
          <SocialNetworkButton icon={<GoogleIcon />}>Google</SocialNetworkButton>
          <SocialNetworkButton icon={<FacebookIcon />}>Facebook</SocialNetworkButton>
          <SocialNetworkButton icon={<InstagramIcon />}>Instagram</SocialNetworkButton>
          <SocialNetworkButton icon={<InstagramIcon />} disabled>
            Instagram
          </SocialNetworkButton>
          <SocialNetworkButton icon={<InstagramIcon />} loading />
        </Box>
        <Divider horizontal margin={0} />
        <Box direction="row" gap="1rem" justify="center" flex="grow" align="center" wrap>
          <Button
            autoWidth
            secondary
            blackAndWhite
            icon={<HaltIcon />}
            variant="circular"
          >
            Hola
          </Button>
          <Button
            autoWidth
            secondary
            blackAndWhite
            icon={<HaltIcon />}
            variant="circular"
            loading
          ></Button>
          <Button autoWidth blackAndWhite icon={<NotesIcon />} variant="circular" />
          <Button
            autoWidth
            blackAndWhite
            icon={<NotesIcon />}
            variant="circular"
            loading
          />
          <Button autoWidth blackAndWhite icon={<AddIcon />} variant="circular" />
          <Button autoWidth icon={<AddIcon />} variant="circular" />
          <Button autoWidth icon={<AddIcon />} variant="circular" loading />
        </Box>
      </Box>
    </Box>
  );

  const DSInputs = () => (
    <Box direction="row" gap="small">
      {/* Inputs y Selects */}
    </Box>
  );

  const DSComponents = () => (
    <Box direction="row" gap="small">
      {/* Componentes */}
    </Box>
  );

  const DSColors = () => (
    <Box direction="row" gap="small">
      {/* Colores */}
    </Box>
  );

  const DSTypography = () => (
    <Box direction="row" gap="small">
      {/* Tipografias */}
    </Box>
  );

  const sections = [
    { title: 'Colores', Component: DSColors },
    { title: 'Tipografía', Component: DSTypography },
    { title: 'Botones', Component: DSButtons },
    { title: 'Inputs', Component: DSInputs },
    { title: 'Componentes', Component: DSComponents },
  ];

  return (
    <Box
      margin={{
        bottom: 'medium',
      }}
    >
      <Text as={'h1'} size="xxlarge">
        Design System
      </Text>

      <Box direction="column" gap="1rem">
        {sections.map(({ title, Component }) => (
          <DesignSystemSection title={title}>
            {Component && <Component pad="1rem" />}
          </DesignSystemSection>
        ))}
      </Box>
    </Box>
  );
};

export default DesignSystem;
