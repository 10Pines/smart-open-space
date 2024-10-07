import React from 'react';
import { usePushToLogin } from '#helpers/routes';
import UserCredentialsForm from '#shared/UserCredentialsForm';
import { resetPassword } from '#api/user-client';
import { useLocation } from 'react-router-dom';

const RecoveryEmail = () => {
  const reset = ({ password }) => resetPassword(email, password, token);
  const email = new URLSearchParams(useLocation().search).get('email');
  const token = new URLSearchParams(useLocation().search).get('token');
  const pushToLogin = usePushToLogin();

  return (
    <UserCredentialsForm
      data={{
        title: 'Restablecer contraseña',
        primaryLabel: 'Ingresar nueva contraseña',
        action: reset,
        secondaryLabel: 'Volver a login',
        onSecondary: pushToLogin,
      }}
      hideFields={{
        hideName: true,
        hideEmail: true,
      }}
    />
  );
};

export default RecoveryEmail;
