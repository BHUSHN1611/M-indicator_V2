export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "") {
    this.baseUrl = baseUrl;
  }

  async get<T>(endpoint: string, headers: Record<string, string> = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      });

      if (!response.ok) {
        return {
          data: null,
          error: `HTTP Error: ${response.status} ${response.statusText}`,
          status: response.status,
        };
      }

      const data = (await response.json()) as T;
      return { data, error: null, status: response.status };
    } catch (err) {
      return {
        data: null,
        error: err instanceof Error ? err.message : "Unknown network error",
        status: 0,
      };
    }
  }
}

export const apiClient = new ApiClient();
