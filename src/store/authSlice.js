import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

// Carregamento inicial do estado a partir do localStorage
const token = localStorage.getItem('token');
const userJSON = localStorage.getItem('user');
let user = null;
try {
  user = userJSON ? JSON.parse(userJSON) : null;
} catch (error) {
  console.error('Erro ao analisar os dados do usuário do localStorage:', error);
  user = null;
}

// Estado inicial da aplicação
const initialState = {
  token: token || null,
  user: user,
  role: user?.role || null,
};

// Criação do slice de autenticação
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token } = action.payload;
      const decodedToken = jwtDecode(token);

      const userId =
        decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      const userEmail =
        decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
      const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      const userName = decodedToken['NomeCompleto']; // Claim customizada, nome simples

      // Monta o objeto de usuário completo com os dados corretos e validados.
      const userData = {
        id: userId,
        email: userEmail,
        nomeCompleto: userName,
        role: userRole,
      };

      // Atualiza o estado do Redux
      state.token = token;
      state.user = userData;
      state.role = userRole;

      // Salva os dados corretos e completos no localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
    },

    logout: (state) => {
      state.token = null;
      state.user = null;
      state.role = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
});

// Exportações
export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
