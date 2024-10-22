import React from 'react';

import { Box, Button, Image, Paragraph } from 'grommet';
import PropTypes from 'prop-types';

const EmptyData = ({ buttonText, img, onClick = () => {}, text }) => (
  <Box align="center">
    <Box height="small">
      <Image fit="contain" src={img} />
    </Box>
    <Paragraph textAlign="center">{text}</Paragraph>
    {buttonText && (
      <Button color="accent-1" label={buttonText} primary onClick={onClick} />
    )}
  </Box>
);
EmptyData.propTypes = {
  buttonText: PropTypes.string,
  img: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  text: PropTypes.string.isRequired,
};

export default EmptyData;
