import axios from "axios";
import qs from "qs";


const instance = axios.create({
  // baseURL: 'api',
  baseURL: process.env.NODE_ENV === 'production' ? '' : 'api',
  timeout: 5000,
});

instance.interceptors.request.use((config) => {
  config.data = qs.stringify(config.data)
  return config;
});

instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.log(error)
    return new Promise(() => {});
  }
);

export default instance;
