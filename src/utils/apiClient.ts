import { ApiResponse, PaginatedResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  token?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', headers = {}, body, token } = options;

    const config: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    };

    // Add authentication token if provided
    if (token) {
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${token}`,
      };
    }

    // Add body for POST/PUT requests
    if (body && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        // Handle different error status codes
        if (response.status === 401) {
          throw new Error('Authentication required');
        }
        if (response.status === 403) {
          throw new Error('Access denied');
        }
        if (response.status === 404) {
          throw new Error('Resource not found');
        }
        if (response.status >= 500) {
          throw new Error('Server error');
        }

        // Try to get error message from response
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || errorData.message || 'Request failed');
        } catch {
          throw new Error(`Request failed with status ${response.status}`);
        }
      }

      // Handle empty responses
      if (response.status === 204) {
        return {} as T;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API request failed: ${method} ${endpoint}`, error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(username: string, password: string): Promise<ApiResponse<{ user: any; token: string }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: { username, password }
    });
  }

  async register(userData: any): Promise<ApiResponse<{ user: any }>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: userData
    });
  }

  async logout(): Promise<ApiResponse<{}>> {
    return this.request('/auth/logout', {
      method: 'POST'
    });
  }

  async getCurrentUser(token: string): Promise<ApiResponse<any>> {
    return this.request('/auth/me', {
      token
    });
  }

  // Game endpoints
  async getGames(params?: { limit?: number; cursor?: string; status?: string }): Promise<ApiResponse<PaginatedResponse<any>>> {
    const queryString = params ? '?' + new URLSearchParams(params as any).toString() : '';
    return this.request(`/games${queryString}`);
  }

  async getGame(id: string): Promise<ApiResponse<any>> {
    return this.request(`/games/${id}`);
  }

  async createGame(gameData: any, token: string): Promise<ApiResponse<any>> {
    return this.request('/games', {
      method: 'POST',
      body: gameData,
      token
    });
  }

  async updateGame(id: string, gameData: any, token: string): Promise<ApiResponse<any>> {
    return this.request(`/games/${id}`, {
      method: 'PUT',
      body: gameData,
      token
    });
  }

  async deleteGame(id: string, token: string): Promise<ApiResponse<{}>> {
    return this.request(`/games/${id}`, {
      method: 'DELETE',
      token
    });
  }

  // Square endpoints
  async getGameSquares(gameId: string): Promise<ApiResponse<any[]>> {
    return this.request(`/games/${gameId}/squares`);
  }

  async requestSquare(gameId: string, row: number, col: number, token: string): Promise<ApiResponse<any>> {
    return this.request(`/games/${gameId}/squares/request`, {
      method: 'POST',
      body: { row, col },
      token
    });
  }

  async cancelSquareRequest(gameId: string, squareId: string, token: string): Promise<ApiResponse<{}>> {
    return this.request(`/games/${gameId}/squares/${squareId}/cancel`, {
      method: 'DELETE',
      token
    });
  }

  // Square request management (admin)
  async getSquareRequests(gameId?: string, token?: string): Promise<ApiResponse<any[]>> {
    const endpoint = gameId ? `/games/${gameId}/requests` : '/requests';
    return this.request(endpoint, { token });
  }

  async approveSquareRequest(requestId: string, token: string): Promise<ApiResponse<any>> {
    return this.request(`/requests/${requestId}/approve`, {
      method: 'POST',
      token
    });
  }

  async rejectSquareRequest(requestId: string, reason: string, token: string): Promise<ApiResponse<{}>> {
    return this.request(`/requests/${requestId}/reject`, {
      method: 'POST',
      body: { reason },
      token
    });
  }

  async removeSquareFromPlayer(gameId: string, squareId: string, token: string): Promise<ApiResponse<{}>> {
    return this.request(`/games/${gameId}/squares/${squareId}/remove`, {
      method: 'DELETE',
      token
    });
  }

  // Game management (admin)
  async assignNumbers(gameId: string, token: string): Promise<ApiResponse<any>> {
    return this.request(`/games/${gameId}/assign-numbers`, {
      method: 'POST',
      token
    });
  }

  async updateGameStatus(gameId: string, status: string, token: string): Promise<ApiResponse<any>> {
    return this.request(`/games/${gameId}/status`, {
      method: 'PUT',
      body: { status },
      token
    });
  }

  async updateGameScores(gameId: string, scores: any, token: string): Promise<ApiResponse<any>> {
    return this.request(`/games/${gameId}/scores`, {
      method: 'PUT',
      body: { scores },
      token
    });
  }

  // User management
  async getUserSquares(userId: string, token: string): Promise<ApiResponse<any[]>> {
    return this.request(`/users/${userId}/squares`, { token });
  }

  async getUserRequests(userId: string, token: string): Promise<ApiResponse<any[]>> {
    return this.request(`/users/${userId}/requests`, { token });
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;