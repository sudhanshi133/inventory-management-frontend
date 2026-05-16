import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  username: string;
  fullName: string;
  email: string;
  message: string;
}

export interface ForgotPasswordRequest {
  username: string;
}

export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
}

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<{ message: string; resetToken: string }> => {
    const response = await axios.post(`${API_URL}/forgot-password`, data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    const response = await axios.post(`${API_URL}/reset-password`, data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axios.post(`${API_URL}/logout`);
    localStorage.removeItem('user');
  },
};

