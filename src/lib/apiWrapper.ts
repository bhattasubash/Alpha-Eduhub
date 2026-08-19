// API wrapper for force work mode
// Provides fallback responses when database operations fail

import { getMockData } from './mockData';

export async function safeApiCall<T>(
  apiCall: () => Promise<T>,
  fallbackData?: T,
  endpoint?: string
): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    console.log(`API call failed for ${endpoint || 'unknown endpoint'}, using fallback data`);
    
    // If specific fallback data is provided, use it
    if (fallbackData !== undefined) {
      return fallbackData;
    }
    
    // Otherwise try to get mock data
    if (endpoint) {
      const mockData = getMockData(endpoint);
      if (mockData) {
        return mockData as T;
      }
    }
    
    // Final fallback - return empty array or empty object
    return [] as unknown as T;
  }
}

export function createMockResponse(data: any, message = "Demo mode - using mock data") {
  return {
    success: true,
    data,
    message,
    demoMode: true
  };
}

export function createErrorResponse(error: string, status = 500) {
  return {
    success: false,
    error,
    demoMode: true,
    status
  };
}