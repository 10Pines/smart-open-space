import { toast } from 'react-toastify';

const doFetch = (method) => async (endpoint, body) => {
  const config = {
    method,
    headers: { 'content-type': 'application/json' },
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

const get = doFetch('GET');
const put = doFetch('PUT');
const post = doFetch('POST');
const remove = doFetch('DELETE');

export { get, put, post, remove };
