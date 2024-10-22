import { Box, Button, Collapsible, TextInput } from 'grommet';
import { DownIcon, UpIcon } from '#shared/icons';
import React, { useState } from 'react';
import ListWithRemoveButton from '#shared/ListWithRemoveButton';
import { TextAreaWithCharacterCounter } from '#shared/TextAreaWithCharacterCounter';
import RowBetween from '#shared/RowBetween';
import { PlusButton } from '#shared/PlusButton';
import { ColorPicker } from '#shared/ColorPicker';

const Tracks = ({ value, onChange }) => {
  // TODO: workaround due to an issue with actual grommet version and Select bug using JSX components
  // TODO: Delete this objects and use direct hex color string when it's fixed
  const colors = allColors;
  let initialTrack = { name: '', description: '', color: colors[0].hex };
  const [track, setTrack] = useState(initialTrack);
  const [isOpen, setIsOpen] = useState(false);
  const hasNoTrackName = track.name.trim().length < 1;

  return (
    <Box>
      <Button
        alignSelf="center"
        icon={isOpen ? <UpIcon /> : <DownIcon />}
        onClick={() => setIsOpen(!isOpen)}
      />
      <Collapsible open={isOpen}>
        <Box justify="around" direction="column" height="small">
          <RowBetween>
            <TextInput
              onChange={(event) => setTrack({ ...track, name: event.target.value })}
              placeholder="Nombre de track"
              value={track.name}
            />
            <ColorPicker
              colors={colors}
              initialColor={track.color}
              setColor={(color) => setTrack({ ...track, color: color })}
            />
          </RowBetween>
          <Box>
            <TextAreaWithCharacterCounter
              placeholder="Descripción"
              value={track.description}
              maxLength={500}
              onChange={(event) =>
                setTrack({ ...track, description: event.target.value })
              }
            />
          </Box>
        </Box>
        <PlusButton
          conditionToDisable={hasNoTrackName}
          onChange={onChange}
          value={value}
          item={track}
          initialItem={initialTrack}
          setItem={setTrack}
          alignSelf="end"
        />
      </Collapsible>
      <ListWithRemoveButton items={value} onChange={onChange} />
    </Box>
  );
};

const allColors = [
  {
    hex: '#ddaecc',
    name: 'Rosa',
  },
  {
    hex: '#88d2f2',
    name: 'Celeste',
  },
  {
    hex: '#d0c9e1',
    name: 'Lavanda',
  },
  {
    hex: '#fab29e',
    name: 'Salmon',
  },
  {
    hex: '#fbf7b8',
    name: 'Amarillo',
  },
  {
    hex: '#a2d0b7',
    name: 'Turquesa',
  },
  {
    hex: '#aea3c9',
    name: 'Lila oscuro',
  },
  {
    hex: '#93b7dc',
    name: 'Celeste oscuro',
  },
  {
    hex: '#c1867b',
    name: 'Marrón claro',
  },
  {
    hex: '#e2edd4',
    name: 'Verde claro',
  },
];

export default Tracks;
