import { toast } from 'react-toastify';
import { 
  getLocalStorage, setLocalStorage, 
  getSessionStorage, setSessionStorage 
} from '#helpers/browserStorage.js';
import { API_CONST } from '#statics/apiConstants.js';
import { ERROR_MESSAGES } from '#statics/messages.js';

const {
  INTERNAL_SESSION_ID_KEY, 
  INTERNAL_SESSION_ID_HEADER,
  AUTH_HEADER,
  AUTH_TOKEN_PREFIX,
  STORAGE_AUTH_JWT_KEY,
  STORAGE_AUTH_USER_KEY,
} = API_CONST;

const {
  INVALID_AUTH_SESSION
} = ERROR_MESSAGES;

const doFetch = (method) => async (endpoint, body) => {
  const jwtToken = getLocalStorage(STORAGE_AUTH_JWT_KEY, '') || '';
  const config = {
    method,
    headers: { 
      'content-type': 'application/json',
      [INTERNAL_SESSION_ID_HEADER]: getRequestSessionId(),
      [AUTH_HEADER]: `${AUTH_TOKEN_PREFIX} ${jwtToken}`,
    },
    body: JSON.stringify(body),
  };
  try {
    const response = await window.fetch(`${import.meta.env.VITE_API_URL}/${endpoint}`, config);
    const jsonResponse = await response.json();
    const resMessage = jsonResponse.message || 'Error inesperado';
    if (!response.ok) {
      if(response.status === 401) {
        resetUserSessionStorage();
        console.error('response status 401', resMessage);
        throw new Error(INVALID_AUTH_SESSION);
      }
      throw new Error(resMessage);
    }
    return jsonResponse;
  } catch (e) {
    console.error(e);
    // const errorMsg = err.response ? err.response.data.message : 'Oops, ocurrió un error!';
    toast.error(e.message, { position: toast.POSITION.TOP_CENTER });
    throw new Error(e.message);
  }
};

const resetUserSessionStorage = () => {
  setLocalStorage(STORAGE_AUTH_USER_KEY, null);
  setLocalStorage(STORAGE_AUTH_JWT_KEY, null);
};

const getRequestSessionId = () => {
    const value = getSessionStorage(INTERNAL_SESSION_ID_KEY);
    if (!value) {
        const generatedValue = crypto.randomUUID();
        setSessionStorage(INTERNAL_SESSION_ID_KEY, generatedValue);
        return generatedValue;
    }
    return value;
};

const get = doFetch('GET');
const put = doFetch('PUT');
const post = doFetch('POST');
const remove = doFetch('DELETE');

export { get, put, post, remove };
