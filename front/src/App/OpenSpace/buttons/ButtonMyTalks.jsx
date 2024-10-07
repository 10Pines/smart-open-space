import MainHeader from '#shared/MainHeader';
import { TalkIcon } from '#shared/icons';
import { usePushToMyTalks } from '#helpers/routes';
import React from 'react';
import PropTypes from 'prop-types';

export const ButtonMyTalks = ({ amTheOrganizer }) => (
  <MainHeader.Button
    color="accent-1"
    icon={<TalkIcon />}
    label={amTheOrganizer ? 'Gestionar Charlas' : 'Mis charlas'}
    onClick={usePushToMyTalks()}
  />
);
ButtonMyTalks.propTypes = { amTheOrganizer: PropTypes.bool.isRequired };
