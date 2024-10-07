import React from 'react';
import PropTypes from 'prop-types';

import preparationImg from '#assets/preparation.svg';
import EmptyData from '#shared/EmptyData';

const EmptyOpenSpaces = ({ onClick }) => (
  <EmptyData
    buttonText="Cargar OpenSpace"
    img={preparationImg}
    onClick={onClick}
    text="Cargá tu primer Open Space y aprovecha toda la inteligencia de Smart-OS"
  />
);
EmptyOpenSpaces.propTypes = { onClick: PropTypes.func.isRequired };

export default EmptyOpenSpaces;
