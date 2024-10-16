import React from 'react';
import { Grid } from 'grommet';
import Button from './Button';

const ControlButtons = ({ controlButtons, size }) => {
  console.info('Recibo controlButtons', controlButtons);
  return (
    <Grid
      columns={{
        count: size === 'small' ? 1 : 3,
        size: size === 'small' ? 'auto' : '1/3',
      }}
      gap="1rem"
      responsive
    >
      {controlButtons.map(({ label, onClick }) => (
        <Button
          key={label}
          label={label}
          onClick={onClick}
          style={{ minWidth: '150px', width: '100%' }}
        />
      ))}
    </Grid>
  );
};

export default ControlButtons;
