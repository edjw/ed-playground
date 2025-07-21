import { useAuthStore } from "@/stores/auth";

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || "/.netlify/functions";
  }

  async makeAuthenticatedRequest(endpoint: string, options: RequestInit = {}) {
    const authStore = useAuthStore();
    const token = await authStore.getAccessToken();

    if (!token) {
      throw new Error("No access token available");
    }

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async checkAuth() {
    return this.makeAuthenticatedRequest("/auth-check", {
      method: "POST",
    });
  }
}

export const api = new ApiService();