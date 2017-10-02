import axios from 'axios';

const client = axios.create({
  baseURL: 'http://localhost:3002/',
  timeout: 15000,
});

export default client;
