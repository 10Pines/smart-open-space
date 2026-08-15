import React from 'react';

import PropTypes from 'prop-types';

import takingNotesImg from '#assets/taking_notes.svg';
import EmptyData from '#shared/EmptyData';

const EmptyTalk = ({ canAddTalk = true, onClick }) => {
  if (!canAddTalk) {
    return (
      <EmptyData
        img={takingNotesImg}
        text="No tienes charlas cargadas para este evento"
      />
    );
  }

  return (
    <EmptyData
      buttonText="Cargar charla"
      img={takingNotesImg}
      onClick={onClick}
      text="Cargá tu charla para este Open Space"
    />
  );
};

EmptyTalk.propTypes = {
  canAddTalk: PropTypes.bool,
  onClick: PropTypes.func,
};

export default EmptyTalk;
