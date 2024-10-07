import React from 'react';

import { Button } from 'grommet';
import { AddIcon } from '#shared/icons';

const ButtonNew = (props) => (
  <Button label="Nuevo" icon={<AddIcon />} primary {...props} />
);

export default ButtonNew;
