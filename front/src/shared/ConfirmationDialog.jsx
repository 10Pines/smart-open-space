import React from 'react';
import { Box, Button, Layer, Text } from 'grommet';
import PropTypes from 'prop-types';

const ConfirmationDialog = ({
  message = '¿Estás seguro de que deseas continuar con esta operación?',
  onConfirm = () => {},
  onCancel = () => {},
  isOpen = false,
  buttonLabels = { confirm: 'Sí', cancel: 'No' },
}) => {
  if (!isOpen) return null;

  return (
    <Layer onEsc={onCancel} onClickOutside={onCancel}>
      <Box pad="medium" gap="medium">
        <Text>{message}</Text>
        <Box justify="around" direction="row" pad="small">
          <Button label={buttonLabels.confirm} onClick={onConfirm} />
          <Button label={buttonLabels.cancel} onClick={onCancel} />
        </Box>
      </Box>
    </Layer>
  );
};

ConfirmationDialog.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default ConfirmationDialog;
