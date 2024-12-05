import React from 'react';

import { Text } from 'grommet';
import PropTypes from 'prop-types';

import MyProps from '#helpers/MyProps';
import Row from './Row';

const Detail = ({ children, icon: Icon, text, color, ...props }) => (
  <Row gap="xsmall" justify="center">
    {Icon && <Icon color={color || "dark-5"} />}
    <Text color={color || "dark-5"} {...props}>
      {text}
      {children}
    </Text>
  </Row>
);
Detail.propTypes = {
  children: MyProps.children,
  icon: PropTypes.object,
  text: PropTypes.string,
};

export default Detail;
