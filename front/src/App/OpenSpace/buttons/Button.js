import React from 'react';
import { Button } from 'grommet';

const customTheme = {
  button: {
    borderRadius: '4px',
    whiteSpace: 'nowrap',
  },
};

function App({ label, onClick, icon = undefined }) {
  return (
    <Button
      style={customTheme.button}
      primary
      label={label}
      onClick={onClick}
      icon={icon}
    />
  );
}

export default App;
