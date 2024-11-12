import React from 'react';

import { Box, Button, Menu, Text, Image, Avatar } from 'grommet';
import PropTypes from 'prop-types';

import logo from '#assets/logo.svg';
import useAuth, { useUser } from '#helpers/useAuth';
import useLoading from '#helpers/useLoading';
import useSize from '#helpers/useSize';
import { DownIcon, MenuIcon } from '#shared/icons';
import Row from '#shared/Row';
import RowBetween from '#shared/RowBetween';
import { useInRegister, usePushToLogin, usePushToRoot } from '#helpers/routes';
import { TinySpinner } from '#shared/Spinner';
import { getLayoutGeneralPadding } from '#helpers/layoutUtils';

const SmallMenu = ({ color }) => (
  <Box pad={getLayoutGeneralPadding(useSize())}>
    <MenuIcon color={color} />
  </Box>
);
SmallMenu.propTypes = { color: PropTypes.string.isRequired };

const LargeMenu = ({ color, name, pad }) => {
  const textSize = '16px';

  return (
    <Row gap="small" pad={pad}>
      <Box>
        <Avatar size="30px" src="https://cdn-icons-png.flaticon.com/512/149/149071.png" />
      </Box>
      <Row gap="xxsmall">
        <Text color={color} size={textSize}>
          {name}
        </Text>
        <DownIcon color={color} size={textSize} />
      </Row>
    </Row>
  );
};
LargeMenu.propTypes = {
  color: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  pad: PropTypes.string.isRequired,
};

const LogoSmall = () => (
  <Box background="accent-1" height="xxsmall" pad="xxsmall" round="large" width="xxsmall">
    <Image fit="contain" src={logo} />
  </Box>
);

const HomeButton = ({ onClick }) => (
  <Button
    label={
      <Text color="black" size="20px" weight="bolder">
        {useSize() === 'small' ? 'SOS' : 'Smart Open Spaces'}
      </Text>
    }
    onClick={onClick}
    plain
  />
);
HomeButton.propTypes = { onClick: PropTypes.func.isRequired };

const MyMenu = ({ user }) => {
  const [loading, withLoading] = useLoading();
  const pushToLogin = usePushToLogin();
  const isSmall = useSize() === 'small';
  const { logout } = useAuth();
  if (loading) return <TinySpinner color="light-1" size="large" />;
  const menuItems = [
    {
      label: <Text color="status-error">Cerrar sesión</Text>,
      onClick: withLoading(() => logout().then(pushToLogin)),
    },
  ];
  return (
    <Menu plain items={menuItems} size="medium">
      {({ drop, hover }) => {
        const color = 'black';
        return isSmall && !drop ? (
          <SmallMenu color={color} />
        ) : (
          <LargeMenu color={color} name={user.name} />
        );
      }}
    </Menu>
  );
};
MyMenu.propTypes = {
  user: PropTypes.shape({ name: PropTypes.string.isRequired }).isRequired,
};

const Header = () => {
  const pushToRoot = usePushToRoot();
  const pushToLogin = usePushToLogin();
  const user = useUser();

  return (
    <RowBetween as="header" fill>
      <HomeButton onClick={pushToRoot} />
      {user ? (
        <MyMenu user={user} />
      ) : (
        <Button label="Ingresar" onClick={pushToLogin} />
      )}
    </RowBetween>
  );
};

export default Header;
