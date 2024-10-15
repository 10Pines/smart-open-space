import React from 'react';
import { Button } from 'grommet';

const customTheme = {
  button: {
    borderRadius: '4px',
  },
};

function App({ label, showIf = true, onClick }) {
  return showIf ? (
    <Button style={customTheme.button} primary label={label} onClick={onClick} />
  ) : null;
}

export default App;
