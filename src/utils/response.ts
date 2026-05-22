export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errors?: any[];
}

export const successResponse = <T>(
  data?: T,
  message?: string
): ApiResponse<T> => {
  return {
    status: 'success',
    message,
    data,
  };
};

export const errorResponse = (
  message: string,
  errors?: any[]
): ApiResponse => {
  return {
    status: 'error',
    message,
    errors,
  };
};