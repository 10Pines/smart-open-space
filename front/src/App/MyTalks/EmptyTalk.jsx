import React from 'react';

import PropTypes from 'prop-types';

import takingNotesImg from '#assets/taking_notes.svg';
import EmptyData from '#shared/EmptyData';

const EmptyTalk = ({ onClick }) => (
  <EmptyData
    buttonText="Cargar charla"
    img={takingNotesImg}
    onClick={onClick}
    text="Cargá tu charla para este Open Space"
  />
);
EmptyTalk.propTypes = { onClick: PropTypes.func.isRequired };

export default EmptyTalk;
