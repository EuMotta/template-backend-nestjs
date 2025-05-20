export interface ApiResponseData<T> {
  error?: boolean;
  message: string;
  data?: T | null;
}
