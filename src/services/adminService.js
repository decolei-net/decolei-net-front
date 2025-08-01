// Função para pegar o token de autenticação do localStorage
const getToken = () => localStorage.getItem('token');

// URL base do seu AdminController.
const API_BASE_URL = 'http://localhost:5245/api/Admin';

// Função para fazer requisições autenticadas
const fetchFromApi = async (endpoint) => {
  const token = getToken();
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Falha na requisição para: ${endpoint}`);
  }

  return response.json();
};

/**
 * Busca a lista completa de todas as reservas.
 * Endpoint: GET /api/Admin/reservas
 */
export const getAllReservas = () => {
  return fetchFromApi('/reservas');
};

/**
 * Busca a lista completa de todos os usuários.
 * Endpoint: GET /api/Admin/usuarios
 */
export const getAllUsuarios = () => {
  return fetchFromApi('/usuarios');
};