/**
 * API route handler with timeout and error handling
 * Prevents API routes from hanging and provides consistent error responses
 */

export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number = 8000,
  errorMessage: string = "Request timeout"
): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
  });

  return Promise.race([promise, timeout]);
}

export function withErrorHandler(handler: (req: Request) => Promise<Response>) {
  return async (req: Request) => {
    try {
      // Add timeout to the handler
      const response = await withTimeout(handler(req), 8000, "API request timeout");
      return response;
    } catch (error) {
      console.error('API Error:', error);

      if (error instanceof Error) {
        if (error.message === "API request timeout") {
          return new Response(
            JSON.stringify({ error: "Request timeout", message: "The request took too long to process" }),
            { status: 504, headers: { 'Content-Type': 'application/json' } }
          );
        }

        if (error.message.includes('NEXT_REDIRECT')) {
          // Let Next.js handle redirects
          throw error;
        }
      }

      return new Response(
        JSON.stringify({ error: "Internal server error", message: "An unexpected error occurred" }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
  };
}

export function createApiResponse<T>(data: T, status: number = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
}

export function createErrorResponse(message: string, status: number = 400, details?: any) {
  return new Response(
    JSON.stringify({ error: message, ...(details && { details }) }),
    {
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  );
}