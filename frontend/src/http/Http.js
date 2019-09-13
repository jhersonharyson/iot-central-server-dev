import axios from 'axios';

export default axios.create({
  baseURL: 'http://localhost:3001/api/v1/ws/',
  timeout: 1000
});
