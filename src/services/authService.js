import api from './api'

const login = async(credentials) => {
    const response = await api.post('/Auth/Login', credentials);

    const { token } = response.data;

    if(token){
        localStorage.setItem('token', token)
    }

    return response.data;
}

const logout = () => {
    localStorage.removeItem('token');
}

export default {login, logout}