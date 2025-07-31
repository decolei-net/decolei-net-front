import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

// Carregamento inicial do localStorage (esta parte está correta)
const token = localStorage.getItem('token');
const userJSON = localStorage.getItem('user');
let user = null;
try {
  user = userJSON ? JSON.parse(userJSON) : null;
} catch (e) {
  console.error('Erro ao fazer parse do usuário do localStorage', e);
}

const initialState = {
  token: token || null,
  user: user,
  role: user?.role || null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { token } = action.payload;
      const decodedToken = jwtDecode(token);

      // ✅ A CORREÇÃO PRINCIPAL ESTÁ AQUI ✅
      // Usamos os nomes completos das claims para extrair os dados.
      // A notação de colchetes é necessária por causa dos caracteres especiais (:/.) nos nomes.
      const userRole = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      const userEmail =
        decodedToken['http://schemas.microsoft.com/ws/2005/05/identity/claims/emailaddress'];
      const userId =
        decodedToken['http://schemas.microsoft.com/ws/2005/05/identity/claims/nameidentifier'];
      const userName = decodedToken['NomeCompleto'];

      // Monta o objeto 'user' com os dados corretos
      const userData = {
        id: userId,
        email: userEmail,
        nomeCompleto: userName,
        role: userRole,
      };

      state.token = token;
      state.user = userData;
      state.role = userRole;

      // Salva o token e o objeto 'user' CORRETO no localStorage
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

export const { loginSuccess, logout } = authSlice.actions;

export default authSlice.reducer;
