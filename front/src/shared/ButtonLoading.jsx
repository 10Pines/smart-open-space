import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'grommet';
import MyProps from '#helpers/MyProps';
import useLoading from '#helpers/useLoading';
import { TinySpinner } from '#shared/Spinner';

const ButtonLoading = ({ disabled = false, icon, onClick, ...props }) => {
  const [loading, withLoading] = useLoading();
  return (
    <Button
      disabled={disabled || loading}
      icon={loading ? <TinySpinner /> : icon}
      onClick={withLoading(onClick)}
      primary
      {...props}
    />
  );
};
ButtonLoading.propTypes = {
  disabled: PropTypes.bool,
  icon: MyProps.children,
  onClick: PropTypes.func.isRequired,
};

export default ButtonLoading;
