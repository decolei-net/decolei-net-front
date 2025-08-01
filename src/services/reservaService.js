import api from './api'; // Sua instância do Axios com o interceptor

const reservaService = {
  /**
   * [ADMIN/ATENDENTE] Busca TODAS as reservas cadastradas no sistema.
   * GET /api/Reserva
   */
  getTodasReservas: async () => {
    const response = await api.get('/Reserva');
    return response.data;
  },

  /**
   * [CLIENTE] Busca apenas as reservas do usuário logado.
   * GET /api/Reserva/minhas-reservas
   */
  getMinhasReservas: async () => {
    const response = await api.get('/Reserva/minhas-reservas');
    return response.data;
  },

  /**
   * Busca uma reserva específica por ID.
   * GET /api/Reserva/{id}
   */
  getReservaPorId: async (id) => {
    const response = await api.get(`/Reserva/${id}`);
    return response.data;
  },

  /**
   * Cria nova reserva para o usuário logado.
   * POST /api/Reserva
   */
  criarReserva: async (dadosDaReserva) => {
    const response = await api.post('/Reserva', dadosDaReserva);
    return response.data;
  },

  /**
   * Atualiza o status de uma reserva.
   * PUT /api/Reserva/{id}
   */
  atualizarStatusReserva: async (id, novoStatus) => {
    const response = await api.put(`/Reserva/${id}`, { status: novoStatus });
    return response.data;
  },

  /**
   * [ADMIN/ATENDENTE] Lista as reservas de um cliente específico pelo ID do usuário.
   * GET /api/Reserva/usuario/{usuarioId}
   */
  listarReservasPorUsuario: async (usuarioId) => {
    const response = await api.get(`/Reserva/usuario/${usuarioId}`);
    return response.data;
  }
};

export default reservaService;