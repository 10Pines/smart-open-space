import { get, post } from './api-client';
import { setLocalStorage } from '#helpers/browserStorage.js';
import { getUserPayloadFromJwt } from '#helpers/jwt';
import { API_ENDPOINTS_CONST, API_CONST } from '#statics/apiConstants';

const {
  AUTH_ENDPOINT,
} = API_ENDPOINTS_CONST;

const {
  STORAGE_AUTH_JWT_KEY
} = API_CONST;

const handleExtractUserDataFromJwtAndSaveJwt = (res) => {
  const userPayload = getUserPayloadFromJwt(res.token);
  setLocalStorage(STORAGE_AUTH_JWT_KEY, res.token)
  return userPayload;
}

const handleClearUserLocalStorage = () => {
  setLocalStorage(STORAGE_AUTH_JWT_KEY, null);
}

const identify = (email) => get(`user/identify/${email}/`).then((r) => r.data);

const login = (userData) => post(`${AUTH_ENDPOINT}/login`, userData).then(handleExtractUserDataFromJwtAndSaveJwt);

const register = (userData) => post(`${AUTH_ENDPOINT}/register`, userData).then(handleExtractUserDataFromJwtAndSaveJwt);

const logout = () => post(`${AUTH_ENDPOINT}/logout`).then(handleClearUserLocalStorage);

const logoutAllSessions = () => post(`${AUTH_ENDPOINT}/logout/all`).then(handleClearUserLocalStorage);

const sendRecoveryEmail = (email) => post(`user/recovery`, { email });

const resetPassword = (email, password, token) =>
  post('user/reset', { email, password, resetToken: token });

export { identify, login, register, sendRecoveryEmail, resetPassword, logout, logoutAllSessions };
