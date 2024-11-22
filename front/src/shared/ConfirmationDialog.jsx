import React from 'react';
import { Box, Button, Layer, Text } from 'grommet';
import PropTypes from 'prop-types';

const ConfirmationDialog = ({
  message = '¿Estás seguro de que deseas continuar con esta operación?',
  onConfirm = () => {},
  onCancel = () => {},
  isOpen = false,
  buttonLabels = { confirm: 'Sí', cancel: 'No' },
  confirmationButtonProps = {},
  cancelButtonProps = {}
}) => {
  if (!isOpen) return null;

  return (
    <Layer onEsc={onCancel} onClickOutside={onCancel} style={{borderRadius: "6px"}}>
      <Box pad="medium" gap="medium">
        <Text>{message}</Text>
        <Box justify="around" direction="row" pad="small">
          <Button label={buttonLabels.confirm} onClick={onConfirm} style={confirmationButtonProps} />
          <Button label={buttonLabels.cancel} onClick={onCancel} style={cancelButtonProps} />
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
