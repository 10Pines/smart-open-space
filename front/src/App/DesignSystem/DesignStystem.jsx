import React from 'react';
import { Box, Text } from 'grommet';
import {
  AddIcon, ClockIcon,
  FacebookIcon,
  GoogleIcon,
  HaltIcon,
  InstagramIcon,
  NotesIcon, UserIcon,
} from '#shared/icons';
import Input from "../components/atom/Input.jsx";
import Button from "../components/atom/Button.jsx";
import {FormSearch, View} from "grommet-icons";

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
      <Box direction="column" flex="grow" gap="1rem">
        <Button>Nuevo +</Button>
        <Button loading>Nuevo +</Button>
        <Button secondary>Nuevo +</Button>
        <Button blackAndWhite>Nuevo +</Button>
        <Button blackAndWhite secondary>
          Nuevo +
        </Button>
      </Box>
      <Divider />
      <Box direction="column" flex="grow" align="center">
        <Box direction="row" gap="1rem" justify="center" flex="grow" align="center">
          <Button
            variant="square"
            autoWidth
            secondary
            blackAndWhite
            icon={<GoogleIcon />}
            width={{
              min: '150px',
            }}
          >
            Google
          </Button>
          <Button
            variant="square"
            autoWidth
            secondary
            blackAndWhite
            icon={<FacebookIcon />}
            width={{
              min: '150px',
            }}
          >
            Facebook
          </Button>
          <Button
            variant="square"
            autoWidth
            secondary
            blackAndWhite
            icon={<InstagramIcon />}
            width={{
              min: '150px',
            }}
          >
            Instagram
          </Button>
          <Button
            variant="square"
            autoWidth
            secondary
            blackAndWhite
            icon={<InstagramIcon />}
            width={{
              min: '150px',
            }}
            loading
          />
        </Box>
        <Divider horizontal margin={0} />
        <Box direction="row" gap="1rem" justify="center" flex="grow" align="center">
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
    <Box direction="column" gap="small">
      <Input>
        Input...
      </Input>
      <Input icon={<FormSearch color={'primary'}/>}>
        Buscar...
      </Input>
      <Input icon={<UserIcon color={'primary'}/>}>
        Usuario...
      </Input>
      <Input icon={<View color={'primary'}/>}>
        Contraseña...
      </Input>
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
