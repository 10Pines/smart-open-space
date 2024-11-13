import { useState } from 'react';
import { Box, Card as GrommetCard, Text } from 'grommet';
import Input from '../atom/Input';
import customTheme from '#app/theme.js';
import ColorPicker from '../atom/ColorPicker';

const generateUniqueId = (length = 8, prefix = '') =>
  prefix +
  Math.random()
    .toString(36)
    .substring(2, 2 + length);

const TrackForm = ({
  track = {
    color: undefined,
    name: '',
    description: '',
  },
  onChange = (newTrack) => {},
}) => {
  const { color, name, description } = track;

  const setColor = (newColor) => {
    onChange({
      ...track,
      color: newColor,
    });
  };

  const setName = (newName) => {
    onChange({
      ...track,
      name: newName,
    });
  };

  const setDescription = (newDescription) => {
    onChange({
      ...track,
      description: newDescription,
    });
  };

  return (
    <GrommetCard
      direction={'row'}
      width={{
        width: 'fit-content',
        min: '250px',
      }}
    >
      <Box
        width={'40px'}
        background={color ?? 'primary'}
        style={{
          transition: 'background-color 0.3s ease-in-out',
        }}
      ></Box>
      <Box
        direction={'column'}
        gap={'12px'}
        style={{ padding: '10px 10px 10px 10px', borderRadius: '10px' }}
      >
        <Box direction="row" gap="medium" align="center">
          <Text
            size="small"
            margin={{
              left: 'xsmall',
            }}
          >
            Color:
          </Text>
          <ColorPicker
            id={generateUniqueId(8, 'track-form-')}
            value={color}
            onChange={setColor}
          />
        </Box>
        <Input
          label={'Nombre del Track'}
          placeholder={'Ingrese el nombre del track'}
          value={name}
          onChange={setName}
        />
        <Input
          label={'Descripción'}
          placeholder={'Describa el track'}
          value={description}
          onChange={setDescription}
        />
      </Box>
    </GrommetCard>
  );
};

export default TrackForm;
