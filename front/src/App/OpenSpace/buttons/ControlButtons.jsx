import React, {useState} from 'react';
import {Grid, Box, Text} from 'grommet';
import Button from './Button';
import Switch from "react-switch";

const ControlButtons = ({ controlButtons, size, withIcons = false }) => {
  const buttonCategories = controlButtons.reduce((acc, button) => {
    if (!acc[button.category]) {
      acc[button.category] = [];
    }
    acc[button.category].push(button);
    return acc;
  }, {});

  // Filtrar categorías que no tienen ningún botón
  const filteredButtonCategoriesArray = Object.entries(buttonCategories)
    .filter(([, buttons]) => buttons.length > 0)
    .map(([category, buttons]) => ({ category, buttons }));

  const buttonStyle = {
    minWidth: '150px',
    width: '100%',
    height: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  };
  const [handleBiscuitChange, setHandleBiscuitChange] = useState(false);
  const changeHandleBiscuit = () => {setHandleBiscuitChange(!handleBiscuitChange);};

  return (
    <Grid
      columns={{
        count: size === 'small' ? 1 : filteredButtonCategoriesArray.length,
        size: size === 'small' ? 'auto' : '1/' + filteredButtonCategoriesArray.length,
      }}
      gap="1rem"
      responsive
    >
      <Button label={"Gestionar charlas"}/>
      <Button label={"Gestionar Participantes"}/>
      <Box direction={"row"} gap="xsmall">
        <Switch onChange={changeHandleBiscuit} checked={handleBiscuitChange} />
        <Text>Abrir convocatoria</Text>
      </Box>
      <Box direction={"row"} gap="xsmall">
        <Switch onChange={changeHandleBiscuit} checked={handleBiscuitChange} />
        <Text>Abrir convocatoria</Text>
      </Box>
      <Box direction={"row"} gap="xsmall">
        <Switch onChange={changeHandleBiscuit} checked={handleBiscuitChange} />
        <Text>Abrir convocatoria</Text>
      </Box>


      {/*{filteredButtonCategoriesArray.map(({ category, buttons }) => (
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
      ))}*/}
    </Grid>
  );
};

export default ControlButtons;
