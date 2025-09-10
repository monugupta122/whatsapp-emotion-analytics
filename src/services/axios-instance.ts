import Axios from "axios";
import setAxiosHeader from "../utils/setAxiosHeader";

const baseUrl = import.meta.env.VITE_WEBHOOK_URL;

const axiosInstance = Axios.create({
  baseURL: baseUrl
});

axiosInstance.interceptors.request.use(
  async (config) => {
    config = setAxiosHeader(config);

    // Convert signal to CancelToken
    if (config.signal) {
      const source = Axios.CancelToken.source();
      config.cancelToken = source.token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
