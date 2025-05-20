import { ApiResponseData } from 'src/interfaces/api';

export function createApiResponse({
  error = false,
  message,
  data = null,
}): ApiResponseData<any> {
  return {
    error: error,
    message,
    data: error ? null : data,
  };
}
