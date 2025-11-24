export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public backendMessage?: string,
    public errorType?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const fetchWithTimeout = async (
  url: string,
  options: RequestInit,
  timeout = 10000
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(
        'La solicitud tardó demasiado tiempo. Por favor, intente nuevamente.',
        408
      );
    }
    throw new ApiError(
      'Error de conexión. Verifique su internet e intente nuevamente.',
      0
    );
  }
};

export const handleApiResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    let errorMessage = `Error ${response.status}: `;
    let backendMessage = '';
    let errorType = 'unknown';

    try {
      const errorText = await response.text();
      console.log('Respuesta de error del backend:', errorText);

      if (errorText) {
        const errorData = JSON.parse(errorText);

        backendMessage = errorData.message || errorData.error || errorText;
        errorMessage = errorData.message || `Error ${response.status}`;

        if (errorData.message?.includes('ya está asignado')) {
          errorType = 'duplicate_assignment';
        } else if (errorData.message?.includes('IDs proporcionado')) {
          errorType = 'invalid_id';
        } else if (errorData.message?.includes('cantidad de preguntas')) {
          errorType = 'questions_count';
        } else if (errorData.message?.includes('aulas')) {
          errorType = 'classroom_error';
        } else if (response.status === 500) {
          errorType = 'server_error';
        }
      }
    } catch (parseError) {
      console.error('Error parseando respuesta de error:', parseError);
      errorMessage = 'Error procesando la respuesta del servidor';
      errorType = 'parse_error';
    }

    throw new ApiError(
      errorMessage,
      response.status,
      backendMessage,
      errorType
    );
  }

  return response.json();
};
