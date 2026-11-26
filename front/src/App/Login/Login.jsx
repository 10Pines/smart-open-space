import React from 'react';
import { Anchor } from 'grommet';
import { useLocation } from 'react-router-dom';

import useAuth from '#helpers/useAuth';
import {
  usePushToRegister,
  usePushToRegisterFromOpenSpace,
  usePushToRecoveryEmail,
} from '#helpers/routes';
import UserCredentialsForm from '#shared/UserCredentialsForm';

const Login = () => {
  const { state } = useLocation();
  const returnToOpenSpace = hasOpenSpaceId(state);
  const openSpaceId = state?.openSpaceId;
  const pushToRegisterAndThenGoToRoot = usePushToRegister();
  const pushToRecoverPassword = usePushToRecoveryEmail();
  const pushToRegisterAndThenGoToOpenSpace = usePushToRegisterFromOpenSpace(openSpaceId);

  const pushToRegister = returnToOpenSpace
    ? pushToRegisterAndThenGoToOpenSpace
    : pushToRegisterAndThenGoToRoot;

  const { login } = useAuth();

  return (
    <>
      <UserCredentialsForm
        returnToOpenSpace={returnToOpenSpace}
        openSpaceId={openSpaceId}
        data={{
          title: 'Iniciar sesión',
          secondaryLabel: 'Registrarse',
          onSecondary: pushToRegister,
          primaryLabel: 'Ingresar',
          action: login,
        }}
        hideFields={{
          hideName: true,
          hideConfirmPassword: true,
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

export default Login;
