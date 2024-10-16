import React from 'react';

import MyProps from '#helpers/MyProps';
import Row from './Row';

const RowBetween = ({ children, ...props }) => (
  <Row justify="between" {...props}>
    {children}
  </Row>
);
RowBetween.propTypes = { children: MyProps.children.isRequired };

export default RowBetween;
