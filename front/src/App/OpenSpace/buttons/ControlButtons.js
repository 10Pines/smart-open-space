import React from 'react';
import { Grid, Box } from 'grommet';
import Button from './Button';

const ControlButtons = ({ controlButtons, size, withIcons = false }) => {
  console.info('Recibo controlButtons', controlButtons);

  // Separar los botones por categoría
  const generalButtons = controlButtons.filter((button) => button.category === 'general');
  const stateChangeButtons = controlButtons.filter(
    (button) => button.category === 'action'
  );
  const managementButtons = controlButtons.filter(
    (button) => button.category === 'management'
  );

  return (
    <Grid
      columns={{
        count: size === 'small' ? 1 : 3,
        size: size === 'small' ? 'auto' : '1/3',
      }}
      gap="1rem"
      responsive
    >
      <Box gap="1rem">
        {generalButtons.map(({ label, onClick, icon }) => (
          <Button
            key={label}
            label={label}
            onClick={onClick}
            style={{ minWidth: '150px', width: '100%' }}
            icon={withIcons ? icon : undefined}
          />
        ))}
      </Box>
      <Box gap="1rem">
        {stateChangeButtons.map(({ label, onClick, icon }) => (
          <Button
            key={label}
            label={label}
            onClick={onClick}
            style={{ minWidth: '150px', width: '100%' }}
            icon={withIcons ? icon : undefined}
          />
        ))}
      </Box>
      <Box gap="1rem">
        {managementButtons.map(({ label, onClick, icon }) => (
          <Button
            key={label}
            label={label}
            onClick={onClick}
            style={{ minWidth: '150px', width: '100%' }}
            icon={withIcons ? icon : undefined}
          />
        ))}
      </Box>
    </Grid>
  );
};

export default ControlButtons;
