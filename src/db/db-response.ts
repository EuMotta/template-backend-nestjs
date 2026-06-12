import { ApiResponseData } from 'src/interfaces/api';

export function createApiResponse<T>({
  error = false,
  message,
  data = null,
}: {
  error?: boolean;
  message: string;
  data?: T | null;
}): ApiResponseData<T> {
  return {
    error: error,
    message,
    data: error ? null : data,
  };
}
