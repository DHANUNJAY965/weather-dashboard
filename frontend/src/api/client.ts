import { API_BASE_URL } from '../constants/api';
import { ApiErrorResponse } from '../types/weather.types';

export class ApiError extends Error {}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, { signal });
  const body = (await response.json()) as { success: true; data: T } | ApiErrorResponse;

  if (!response.ok || !body.success) {
    const message = !body.success ? body.message : 'Something went wrong. Please try again.';
    throw new ApiError(message);
  }

  return body.data;
}
