import { toast } from 'react-toastify';
import {  getSessionStorage, setSessionStorage } from '#helpers/browserStorage.js';
import { API_CONST } from '#statics/apiConstants.js';

const {INTERNAL_SESSION_ID_KEY, INTERNAL_SESSION_ID_HEADER} = API_CONST;

const doFetch = (method) => async (endpoint, body) => {
  const config = {
    method,
    headers: { 
      'content-type': 'application/json',
      [INTERNAL_SESSION_ID_HEADER]: getRequestSessionId(),
    },
    body: JSON.stringify(body),
  };
  try {
    const response = await window.fetch(`${import.meta.env.VITE_API_URL}/${endpoint}`, config);
    const jsonResponse = await response.json();
    if (!response.ok) {
      throw new Error(jsonResponse.message);
    }
    return jsonResponse;
  } catch (e) {
    console.error(e);
    // const errorMsg = err.response ? err.response.data.message : 'Oops, ocurrió un error!';
    toast.error(e.message, { position: toast.POSITION.TOP_CENTER });
    throw new Error(e.message);
  }
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
