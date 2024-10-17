import React from 'react';
import { Grid, Box } from 'grommet';
import Button from './Button';

const ControlButtons = ({ controlButtons, size, withIcons = false }) => {
  console.info('Recibo controlButtons', controlButtons);

  const buttonCategories = controlButtons.reduce((acc, button) => {
    if (!acc[button.category]) {
      acc[button.category] = [];
    }
    acc[button.category].push(button);
    return acc;
  }, {});

  const buttonCategoriesArray = Object.entries(buttonCategories).map(
    ([category, buttons]) => ({ category, buttons })
  );

  const buttonStyle = {
    minWidth: '150px',
    width: '100%',
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  };

  return (
    <Grid
      columns={{
        count: size === 'small' ? 1 : 3,
        size: size === 'small' ? 'auto' : '1/3',
      }}
      gap="1rem"
      responsive
    >
      {buttonCategoriesArray.map(({ category, buttons }) => (
        <Box key={category} gap="1rem">
          {buttons.map(({ label, onClick, icon }) => (
            <Button
              key={label}
              label={label}
              onClick={onClick}
              style={buttonStyle}
              icon={withIcons ? icon : undefined}
            />
          ))}
        </Box>
      ))}
    </Grid>
  );
};

export default ControlButtons;
