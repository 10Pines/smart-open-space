import { Box, Button, Text } from 'grommet';

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

  const DSButtons = () => (
    <Box direction="row" gap="small">
      {/* Botones */}
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
            {Component && <Component />}
          </DesignSystemSection>
        ))}
      </Box>
    </Box>
  );
};

export default DesignSystem;
