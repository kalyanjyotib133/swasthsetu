import { apiRequest } from "./queryClient";
import type { User, AuthResponse } from "@/types/health";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  role?: string;
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await apiRequest("POST", "/api/auth/login", credentials);
  const data = await response.json();
  
  // Store token in localStorage
  if (data.token) {
    localStorage.setItem("auth_token", data.token);
  }
  
  return data;
}

export async function register(userData: RegisterData): Promise<AuthResponse> {
  const response = await apiRequest("POST", "/api/auth/register", userData);
  const data = await response.json();
  
  // Store token in localStorage
  if (data.token) {
    localStorage.setItem("auth_token", data.token);
  }
  
  return data;
}

export function logout(): void {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_data");
}

export function getAuthToken(): string | null {
  return localStorage.getItem("auth_token");
}

export function getCurrentUser(): User | null {
  const userData = localStorage.getItem("user_data");
  return userData ? JSON.parse(userData) : null;
}

export function setCurrentUser(user: User): void {
  localStorage.setItem("user_data", JSON.stringify(user));
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

// Add auth header to requests
export function getAuthHeaders(): Record<string, string> {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
