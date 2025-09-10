/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type UndefinedInitialDataOptions,
  useQuery,
} from "@tanstack/react-query";
import axiosInstance from "../services/axios-instance";
import type { AxiosRequestConfig } from "axios";
import { errorToast } from "../utils/toast";

type OmitQuery = Omit<
  UndefinedInitialDataOptions<unknown, Error, unknown, ReadonlyArray<any>>,
  "queryKey"
>;

const useRESTQuery = (
  key: ReadonlyArray<any>,
  api: ApiConfig,
  config?: AxiosRequestConfig,
  options?: OmitQuery
) => {
  const getQuery = async (additionalOptions?: any) => {
    try {
      const { params, signal } = additionalOptions || {};

      const response = await axiosInstance({
        url: api.url,
        method: api.method || "GET",
        signal,
        params,
        ...config,
      });

      return response.data;
    } catch (error: any) {
      const message = error?.response?.data?.message || "Something went wrong.";

      if (error.code !== "ERR_CANCELED") errorToast(message);

      // Important: re-throw error for React Query
      throw {
        message,
        ...error.response?.data,
      };
    }
  };

  return useQuery<any, Error, any>({
    queryKey: key,
    queryFn: getQuery,
    retry: false, // Disable retry by default (can be overridden in `options`)
    refetchOnWindowFocus: false,
    ...options,
  });
};

export { useRESTQuery };
