/* eslint-disable @typescript-eslint/no-explicit-any */
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";
import axiosInstance from "../services/axios-instance";
import type { AxiosRequestConfig } from "axios";
import { errorToast, successToast } from "..//utils/toast";

type OmitQuery = Omit<
  UseMutationOptions<any, Error, any, unknown>,
  "mutationKey" | "mutationFn"
>;

const useRESTMutation = (
  key: ReadonlyArray<any>,
  api: ApiConfig,
  config?: AxiosRequestConfig,
  signal?: AbortSignal,
  options?: OmitQuery
) => {
  const mutateQuery = async (variables: any, additionalOptions?: any) => {
    try {
      const { params } = additionalOptions || {};

      const response = await axiosInstance({
        url: api.url,
        method: api.method || "POST", // Default method is POST
        data: variables,
        signal,
        params,
        ...config,
      });

      const message = response?.data?.message;

      message && successToast(message);

      return response.data;
    } catch (error: any) {
      // Extract custom message or fallback
      const message = error?.response?.data?.message || "Something went wrong.";

      errorToast(message);

      // Important: re-throw error for React Query
      throw {
        message,
        ...error.response?.data, // passing more fields if API sends them
      };
    }
  };

  return useMutation<any, Error, any>({
    mutationKey: key,
    mutationFn: mutateQuery,
    retry: false, // Disable retry by default (can be overridden in `options`)
    ...options,
  });
};

export { useRESTMutation };
