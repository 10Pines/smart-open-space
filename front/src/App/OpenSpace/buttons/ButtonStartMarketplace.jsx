import MainHeader from '#shared/MainHeader';
import { CartIcon } from '#shared/icons';
import React from 'react';

export const ButtonStartMarketplace = (props) => (
  <MainHeader.ButtonLoading
    color="accent-4"
    icon={<CartIcon />}
    label="Iniciar Marketplace"
    {...props}
  />
);
