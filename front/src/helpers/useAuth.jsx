import React, { useContext, useEffect } from 'react';
import useLocalStorage from './useLocalStorage.jsx';
import * as userClient from './api/user-client';
import LogRocket from 'logrocket';

const localStorageKey = '__smartopenspace_user__';

const AuthContext = React.createContext();

const AuthProvider = (props) => {
  const [user, setUser] = useLocalStorage(localStorageKey, null);

  useEffect(() => {
    const { email = '', id = '-1', name = '' } = user || {};
    LogRocket.identify(id, { name, email });
  }, [user]);

  const handleUserResponse = (user) => {
    setUser(user);
    return user;
  };

  const login = (userData) => userClient.login(userData).then(handleUserResponse);

  const register = (userData) => userClient.register(userData).then(handleUserResponse);

  const logout = () => {
    setUser(null);
    return Promise.resolve();
  };

  return <AuthContext.Provider value={{ user, login, logout, register }} {...props} />;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(`useAuth debe usarse dentro de AuthProvider`);
  }
  return context;
};

const getUser = () => JSON.parse(window.localStorage.getItem(localStorageKey));

const useUser = () => useAuth().user;

export { AuthProvider, useUser, getUser };
export default useAuth;
