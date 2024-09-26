import MainHeader from '#shared/MainHeader';
import { VideoIcon } from '#shared/icons';
import { usePushToProjector } from '#helpers/routes';
import React from 'react';

export const ButtonProjector = () => (
  <MainHeader.Button
    color="accent-1"
    icon={<VideoIcon />}
    label="Proyector"
    onClick={usePushToProjector()}
  />
);
