import { AxiosHeaders, type InternalAxiosRequestConfig } from "axios";

const setAxiosHeader = (
  config: InternalAxiosRequestConfig<unknown>
): InternalAxiosRequestConfig<unknown> => {
  (config.headers as AxiosHeaders)
    .set("Content-Type", "application/json")
    .set("Accept", "application/json")
    .set("Access-Control-Allow-Origin", "*")
  return config;
};

export default setAxiosHeader;
