import React from 'react';
import PropTypes from 'prop-types';
import { Button, Tip } from 'grommet';
import MyProps from '#helpers/MyProps';
import useLoading from '#helpers/useLoading';
import { TinySpinner } from '#shared/Spinner';

const ButtonLoading = ({ disabled = false, icon, onClick, tooltipText, ...props }) => {
  const [loading, withLoading] = useLoading();

  return tooltipText ? (
    <Tip content={tooltipText}>
      <Button
        disabled={disabled || loading}
        icon={loading ? <TinySpinner /> : icon}
        onClick={withLoading(onClick)}
        primary
        {...props}
      />
    </Tip>
  ) : (
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
