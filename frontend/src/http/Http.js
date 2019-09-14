import axios from 'axios';

export default axios.create({
  baseURL: process.env.REACT_APP_API_URL //=http://localhost:3000//'http://localhost:3001/api/v1/ws/',
  //timeout: 10000
});
