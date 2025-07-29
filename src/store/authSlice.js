// src/store/authSlice.js

import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode'; // <-- IMPORTE A NOVA BIBLIOTECA

const token = localStorage.getItem('token');
// Carregamos o usuário do localStorage também
const user = localStorage.getItem('user'); 

const initialState = {
    token: token || null,
    // Se tiver um usuário salvo, usa ele, senão, null
    user: user ? JSON.parse(user) : null,
    // Adicionamos a role para acesso fácil
    role: user ? JSON.parse(user).role : null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState, 
    reducers: {
        loginSuccess: (state, action) => {
            const { token } = action.payload;
            // Decodifica o token para extrair as informações do usuário
            const decodedUser = jwtDecode(token);
            
            // O nome da claim de role no seu backend é:
            // "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            const userRole = decodedUser["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

            const userData = {
                id: decodedUser.nameid,
                email: decodedUser.email,
                nomeCompleto: decodedUser.NomeCompleto,
                role: userRole
            };

            state.token = token;
            state.user = userData;
            state.role = userRole; // Armazena a role separadamente também
            
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            state.role = null;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },
});

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;