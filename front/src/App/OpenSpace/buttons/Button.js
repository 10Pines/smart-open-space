import React from 'react';
import { Button } from 'grommet';

const customTheme = {
  button: {
    borderRadius: '4px',
  },
};

function App({ label, onClick }) {
  return <Button style={customTheme.button} primary label={label} onClick={onClick} />;
}

export default App;
