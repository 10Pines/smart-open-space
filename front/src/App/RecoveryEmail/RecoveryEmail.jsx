import React from 'react';
import { usePushToLogin } from '#helpers/routes';
import UserCredentialsForm from '#shared/UserCredentialsForm';
import { sendRecoveryEmail } from '#api/user-client';

const RecoveryEmail = () => {
  const sendMail = ({ email }) => sendRecoveryEmail(email);
  const pushToLogin = usePushToLogin();

  return (
    <UserCredentialsForm
      data={{
        title: 'Restablecer contraseña',
        primaryLabel: 'Mandar mail de recuperación',
        action: sendMail,
        secondaryLabel: 'Volver a login',
        onSecondary: pushToLogin,
      }}
      hideFields={{
        hideName: true,
        hidePassword: true,
        hideConfirmPassword: true,
      }}
    />
  );
};

export default RecoveryEmail;
