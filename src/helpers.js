import { fileServerURL } from '.'

export const post = async (path, data = '') => {
  const response = await fetch(`${fileServerURL}/${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response;
};

export const deleteReq = async (path, data = '') => {
  const response = await fetch(`${fileServerURL}/${path}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  return response;
};