import React, { useState } from 'react';
import { Box, Notification } from 'grommet';
import { usePushToLogin } from '#helpers/routes';
import UserCredentialsForm from '#shared/UserCredentialsForm';
import { sendRecoveryEmail } from '#api/user-client';

const RecoveryEmail = () => {
  const [visible, setVisible] = useState(false);
  const pushToLogin = usePushToLogin();

  const sendMail = ({ email }) => {
    return sendRecoveryEmail(email).then(() => {
      setVisible(true);
      // Return a promise that resolves after 3 seconds to delay the redirect
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 3000);
      });
    });
  };

  return (
    <Box>
      <UserCredentialsForm
        openSpaceId={0} // Required prop, using 0 as default
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
      
      {visible && (
        <Notification
          toast
          time={3000}
          title="Email de recuperación enviado correctamente"
          onClose={() => setVisible(false)}
        />
      )}
    </Box>
  );
};

export default RecoveryEmail;
