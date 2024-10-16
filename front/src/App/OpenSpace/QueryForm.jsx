import { Box, Layer } from 'grommet';
import Title from '#shared/Title';
import Detail from '#shared/Detail';
import MyForm from '#shared/MyForm';
import React from 'react';
import PropTypes from 'prop-types';

export const QueryForm = ({ title, subTitle, onExit, onSubmit }) => (
  <Layer onEsc={onExit} onClickOutside={onExit}>
    <Box pad="medium">
      <Box margin={{ vertical: 'medium' }}>
        <Title level="2" label={title} />
        <Detail size="large" text={subTitle} textAlign="center" />
      </Box>
      <MyForm
        onSecondary={onExit}
        onSubmit={(data) => {
          onExit();
          return onSubmit(data);
        }}
      />
    </Box>
  </Layer>
);
QueryForm.propTypes = {
  title: PropTypes.string.isRequired,
  subTitle: PropTypes.string.isRequired,
  onExit: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
