const apiConfig = {
  getWebhook: { endpoint: "", method: "GET" },
};

export const useApi = (
  action: keyof typeof apiConfig,
  params?: Record<string, string>
): ApiConfig => {
  const { endpoint, method } = apiConfig[action];

  const resolvedEndpoint = params
    ? Object.keys(params).reduce(
        (url, param) => url.replace(`:${param}`, params[param]),
        endpoint
      )
    : endpoint;

  return { url: resolvedEndpoint, method };
};
