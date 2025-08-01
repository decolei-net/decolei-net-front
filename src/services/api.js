// aqui, sera a indicada a url base para a integração com o backend
// fazer a importação do axios; que é a biblioteca que vamos usar para fazer as requisições http
import axios from 'axios';

// ******** 1. ADICIONAMOS A EXPORTAÇÃO AQUI ********
// Esta linha torna a URL base acessível para outros arquivos, como o PacoteDetalhes.jsx.
export const API_BASE_URL = 'http://localhost:5245';

// 1 passo: definir a url base/endpoint para a integracao com o backend
const api = axios.create({
    // Usamos a constante para manter o código consistente
    baseURL: `${API_BASE_URL}/api`, // aq esta indicada a url  principal do projeto backend (pasta do projeto, arquivo http abrir no vs)
    headers: {
        "Content-Type": "application/json" // aqui estamos definindo o tipo de conteudo que vamos enviar e receber
    }
});

// 2 passo: precisamos definir um "interceptor" para que o token jwt seja obtido e adicionado ao header da requisição - Authorization
api.interceptors.request.use(
  //callback para interceptar token
  (config) => {
    // CORREÇÃO: O seu código usa 'token', vamos manter isso.
    const token = localStorage.getItem('token'); // aqui estamos pegando o token do localStorage"
    if (token) {
        config.headers.Authorization = `Bearer ${token}`; // aqui estamos adicionando o token ao header da requisição
    }
    return config;
    },

    (error) => Promise.reject(error)
);

export default api;