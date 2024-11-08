import React from 'react';
import { Box, Text } from 'grommet';
import {
  AddIcon,
  ChatIcon,
  EditIcon,
  FacebookIcon,
  GoogleIcon,
  HaltIcon,
  InstagramIcon,
  NotesIcon,
  UserIcon,
} from '#shared/icons';
import Input from '../components/atom/Input.jsx';
import Button from '../components/atom/Button.jsx';
import { FormSearch, View } from 'grommet-icons';
import SelectDropdown from '../components/atom/SelectDropdown.jsx';
import SocialNetworkButton from '../components/atom/SocialNetworkButton';
import IconButton from '../components/atom/IconButton';
import AddElementBox from '../components/molecule/AddElementBox.jsx';
import DateTimeIndicator from '../components/atom/DateTimeIndicator.jsx';
import Card from '../components/molecule/Card.jsx';
import TimeCard from '../components/molecule/TimeCard.jsx';

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
          <IconButton icon={<HaltIcon />} secondary blackAndWhite />
          <IconButton icon={<HaltIcon />} secondary blackAndWhite loading />
          <IconButton icon={<NotesIcon />} blackAndWhite />
          <IconButton icon={<NotesIcon />} blackAndWhite loading />
          <IconButton icon={<AddIcon />} blackAndWhite />
          <IconButton icon={<AddIcon />} />
          <IconButton icon={<AddIcon />} loading />
        </Box>
      </Box>
    </Box>
  );

  const DSInputs = () => {
    const [input, setInput] = React.useState('');
    const [description, setDescription] = React.useState('');
    return (
      <Box direction="column" gap="small">
        <Input
          placeholder={'Input...'}
          label="Label del input"
          value={input}
          onChange={setInput}
        />
        <Input
          placeholder={'Descripcion'}
          label="Descripcion"
          value={description}
          onChange={setDescription}
          rows={3}
          multiline
        />
        <Input icon={<FormSearch color={'primary'} />} placeholder={'Buscar...'} />
        <Input icon={<UserIcon color={'primary'} />} placeholder={'Usuario...'} />
        <Input
          icon={<View color={'primary'} />}
          placeholder={'Contraseña...'}
          type="password"
        />
        <SelectDropdown />
      </Box>
    );
  };

  const DSComponents = () => (
    <Box direction="column" gap="medium">
      <Text>Add Element Box:</Text>
      <Box direction="row" gap="medium">
        <AddElementBox />
        <AddElementBox size="100px" />
        <AddElementBox
          size={{
            width: '150px',
            height: '220px',
          }}
          onClick={() => console.log('Clicked')}
        />
      </Box>

      <Text>Date Time Indicator:</Text>
      <Box direction="row" gap="medium">
        <DateTimeIndicator
          date={{
            start: new Date(new Date().setHours(10, 0, 0, 0)),
            end: new Date(new Date().setHours(15, 0, 0, 0)),
          }}
        />
        <DateTimeIndicator
          date={{
            start: new Date(2024, 3, 19, 16, 30, 0, 0),
            end: new Date(2024, 3, 19, 20, 0, 0, 0),
          }}
          width="150px"
          background="primary"
        />
      </Box>

      <Text>Card:</Text>
      <Box direction="row" gap="medium" wrap>
        <Box direction="column" gap="1rem">
          <Card title="Título de la Card" color="card-blue" showVotes />
          <Card title="Título de la Card" color="card-green" showVotes />
          <Card title="Título de la Card" color="card-yellow" showVotes />
          <Card title="Título de la Card" color="card-purple" showVotes />
          <Card title="Título de la Card" color="card-pink" showVotes />
        </Box>
        <Card
          title="Título de la Card"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        />
        <Card
          title="Título de la Card"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque tincidunt eleifend ultrices. Aenean quis nibh quis ante laoreet tempus. Proin condimentum pulvinar condimentum. Vivamus scelerisque finibus dui, eget euismod dui elementum id. Donec ullamcorper nibh ut nunc porttitor commodo. Cras tincidunt elit ullamcorper hendrerit porta. Phasellus vestibulum nibh at mauris pellentesque, et bibendum odio volutpat. Maecenas diam lectus, egestas non nulla id, mattis fringilla mi. Suspendisse potenti. Nulla in accumsan augue. Maecenas sit amet iaculis nibh. Integer scelerisque aliquet blandit. Ut euismod diam nec nulla laoreet, eget tempor ante facilisis."
          color="card-pink"
          showVotes
        />
        <Card
          title="Título de la Card"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          color="card-green"
          buttons={[
            {
              icon: HaltIcon,
              onClick: () => console.log('Clicked halt in card'),
              secondary: true,
              blackAndWhite: true,
            },
            {
              icon: EditIcon,
              onClick: () => console.log('Clicked edit in card'),
              blackAndWhite: true,
            },
            {
              icon: AddIcon,
              onClick: () => console.log('Clicked add in card'),
              blackAndWhite: true,
            },
          ]}
        />
      </Box>
      <Divider horizontal />
      <Box direction="row" gap="medium" wrap>
        <TimeCard
          time={{
            start: new Date(new Date().setHours(10, 0, 0, 0)),
            end: new Date(new Date().setHours(16, 0, 0, 0)),
          }}
          title="Título de la Card"
          description="Lorem ipsum dolor sit amet, consectetur adipiscing elit."
          footerDescription={{
            items: [
              {
                icon: <UserIcon />,
                text: '25 invitados',
              },
              {
                icon: <ChatIcon />,
                text: '21 charlas postuladas',
              },
            ],
          }}
        />
        <TimeCard
          time={{
            start: new Date(new Date().setHours(18, 0, 0, 0)),
            end: new Date(new Date().setHours(21, 0, 0, 0)),
          }}
          title="Título de la Card"
          showVotes
        />
      </Box>
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
