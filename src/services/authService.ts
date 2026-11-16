import axios from 'axios';
import { api } from './api';

export interface LoginDto {
    email: string;
    password: string;
}

export interface ForgotPasswordDto {
    email: string;
}

export type AuthenticatedUser = {
    id: number;
};

export async function loginUser(data: LoginDto) {
    try {
        const response = await api.post('/auth/login', data);
        
        if (typeof window !== 'undefined' && response.data.accessToken) {
            localStorage.setItem('@App:token', response.data.accessToken);
        }
        return response.data;
    
    }
    catch (error: unknown) {
        if (axios.isAxiosError(error)) throw error.response?.data || {message: 'Email ou senha incorretos'};
        throw {message: 'Email ou senha incorretos'};
    }
}

export async function getCurrentUser(): Promise<AuthenticatedUser> {
    const response = await api.get<AuthenticatedUser>('/users/me');
    return response.data;
}

export async function requestForgotPassword(data: ForgotPasswordDto) {
  try {
    const response = await api.post('/auth/forgot-password', data);
    return response.data;
  } 
    catch (error: unknown) {
    if (axios.isAxiosError(error)) throw error.response?.data || { message: 'Erro ao solicitar recuperação de senha' };
    throw { message: 'Erro ao solicitar recuperação de senha' };
  }
}

export interface RegisterDto {
    name: string;
    username: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

export async function registerUser(data: RegisterDto) {
    try {
        const response = await api.post('/auth/register', data);
        return response.data;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) throw error.response?.data || { message: 'Erro ao registrar usuário' };
        throw { message: 'Erro ao registrar usuário' };
    }
}
