import axios from 'axios';

const api = axios.create({
  baseURL: 'http://vps27998.publiccloud.com.br/admin/api/',
});

export default api;