import React from 'react';
import { Anchor } from 'grommet';
import { useLocation } from 'react-router-dom';

import useAuth from '#helpers/useAuth';
import { usePushToRecoveryEmail, usePushToLogin } from '#helpers/routes';
import UserCredentialsForm from '#shared/UserCredentialsForm';

const Register = () => {
  const { state } = useLocation();
  const returnToOpenSpace = hasOpenSpaceId(state);
  const openSpaceId = state?.openSpaceId;
  const pushToRecoverPassword = usePushToRecoveryEmail();
  const pushToLogin = usePushToLogin();

  const { register } = useAuth();

  return (
    <>
      <UserCredentialsForm
        returnToOpenSpace={returnToOpenSpace}
        openSpaceId={openSpaceId}
        data={{
          title: 'Registrarse',
          primaryLabel: 'Registrarme',
          action: register,
          secondaryLabel: 'Volver a login',
          onSecondary: pushToLogin,
        }}
      />

      <Anchor
        color="dark-1"
        label={'Olvidaste tu contraseña?'}
        target="_blank"
        onClick={pushToRecoverPassword}
      />
    </>
  );
};

function hasOpenSpaceId(state) {
  return state && state.openSpaceId;
}

export default Register;
