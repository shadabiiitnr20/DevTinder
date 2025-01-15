import axios from 'axios';

//Update the base URL to match your API server in deployment
export const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api/',
  withCredentials: true,
});
