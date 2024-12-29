import React, { useContext, useEffect } from 'react';
import useBrowserStorage from './useBrowserStorage.jsx';
import * as userClient from './api/user-client';
import LogRocket from 'logrocket';
import { API_CONST } from '#statics/apiConstants';
import { getLocalStorage } from './browserStorage.js';


const {
  STORAGE_AUTH_USER_KEY,
  STORAGE_AUTH_JWT_KEY,
} = API_CONST;

const AuthContext = React.createContext();

const AuthProvider = (props) => {
  const [user, setUser] = useBrowserStorage(STORAGE_AUTH_USER_KEY, null);
  const [token, setToken] = useBrowserStorage(STORAGE_AUTH_JWT_KEY, null);

  useEffect(() => {
    const { email = '', id = '-1', name = '' } = user || {};
    LogRocket.identify(id, { name, email });
  }, [user]);

  const handleUserResponse = (user) => {
    setUser(user);
    setToken(user.token);
    return user;
  };

  const handleResetUser = () => {
    setUser(null);
    setToken(null);
  };

  const login = (userData) => userClient.login(userData).then(handleUserResponse);

  const register = (userData) => userClient.register(userData).then(handleUserResponse);

  const logout = () => userClient.logout().finally(handleResetUser);

  return <AuthContext.Provider value={{ user, token, login, logout, register }} {...props} />;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth debe usarse dentro de AuthProvider`);
  }
  return context;
};

const getUser = () => getLocalStorage(STORAGE_AUTH_USER_KEY, null);

const getToken = () => getLocalStorage(STORAGE_AUTH_JWT_KEY, null);

const useToken = () => useAuth().token;

const useUser = () => {
  const { user, token } = useAuth();
  const existInStorage = getToken() && getUser();
  return (token && user && existInStorage) ? user : null;
};

const handleResetAuth = () => useAuth().handleResetUser();

export { AuthProvider, useUser, getUser, getToken, useToken, handleResetAuth };
export default useAuth;
