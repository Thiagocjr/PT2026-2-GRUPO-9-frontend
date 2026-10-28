import { api } from './api';

export interface LoginDto {
    email: string;
    password: string;
}

export interface ForgotPasswordDto {
    email: string;
}

export async function loginUser(data: LoginDto) {
    try {
        const response = await api.post('/auth/login', data);
        
        if (response.data.acessToken) {
            localStorage.setItem('@App:token', response.data.acessToken);
        }
        return response.data;
    
    }
    catch (error: any) {
        throw error.response?.data || {message: 'Email ou senha incorretos'};
    }
}

