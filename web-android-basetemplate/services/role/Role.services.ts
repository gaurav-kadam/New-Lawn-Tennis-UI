import api from '../api/api.service';

export const getRoles = async () => {
  console.log('GET ROLES API CALLED');

  const res = await api.get('/roles');

  console.log('GET ROLES API RESPONSE:', res.data);

  return res.data;
};