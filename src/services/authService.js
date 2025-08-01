import api from './api'

const login = async(credentials) => {
    const response = await api.post('/Usuario/login', credentials);

    const { token } = response.data;

    if(token){
        localStorage.setItem('token', token)
    }

    return response.data;
}

const logout = () => {
    localStorage.removeItem('token');
}

const forgotPassword = async ({ email }) =>{
    const response = await api.post('/Usuario/recuperar-senha', { email });
    return response.data;
}

const resetPassword = async ({ email, token, novaSenha }) => {
    const response = await api.post('/Usuario/redefinir-senha', { email, token, novaSenha });
    return response.data;
};

export default {login, logout, forgotPassword, resetPassword}