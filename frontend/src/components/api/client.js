import axios from 'axios';

const client = axios.create({
    baseURL: '/api/v1',
    withCredentials: true  // para enviar cookies httpOnly
});

export default client;