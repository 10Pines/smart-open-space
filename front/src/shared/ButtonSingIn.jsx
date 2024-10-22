import MainHeader from '#shared/MainHeader';
import { UserAddIcon } from '#shared/icons';
import React from 'react';

export const ButtonSingIn = (props) => (
  <MainHeader.Button
    color="accent-3"
    icon={<UserAddIcon />}
    label="Ingresar"
    {...props}
  />
);
