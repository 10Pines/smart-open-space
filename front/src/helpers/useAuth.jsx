import React, { useContext } from 'react';
import useLocalStorage from './useLocalStorage';
import * as userClient from './api/user-client';

const localStorageKey = '__smartopenspace_user__';

const AuthContext = React.createContext();

const AuthProvider = (props) => {
  const [user, setUser] = useLocalStorage(localStorageKey, null);


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
