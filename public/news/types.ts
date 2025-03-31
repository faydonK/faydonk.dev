export interface News {
  id: number;
  title: string;
  content: string;
  date: string;
}

export interface User {
  id: number;
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  error?: string;
}