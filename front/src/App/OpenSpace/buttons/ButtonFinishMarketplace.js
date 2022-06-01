import MainHeader from '#shared/MainHeader';
import { CartIcon } from '#shared/icons';
import React from 'react';

export const ButtonFinishMarketplace = (props) => (
  <MainHeader.ButtonLoading
    color="neutral-4"
    icon={<CartIcon />}
    label="Finalizar Marketplace"
    {...props}
  />
);
