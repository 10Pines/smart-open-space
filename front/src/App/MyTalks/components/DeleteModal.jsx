import { Box, Button, Layer, Text } from 'grommet';
import React from 'react';

export function DeleteModal({ onConfirmDelete, onEsc }) {
  return (
    <Layer onEsc={onEsc} onClickOutside={onEsc}>
      <Box pad="medium" gap="medium">
        <Text>¿Estás seguro que querés eliminar esta charla?</Text>
        <Box justify="around" direction="row" pad="small">
          <Button label="Si" onClick={onConfirmDelete} />
          <Button label="No" onClick={onEsc} />
        </Box>
      </Box>
    </Layer>
  );
}
