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
   * Atualiza a lista de viajantes de uma reserva e recalcula seu valor total.
   * @param {number} reservaId - O ID da reserva a ser atualizada.
   * @param {Array<object>} viajantes - A lista de acompanhantes [{ nome, documento }].
   * @returns {Promise<object>} A reserva atualizada retornada pela API.
   */
  atualizarViajantes: async (reservaId, viajantes) => {
    // A API espera um array de ViajanteDto no corpo da requisição.
    // O nome do endpoint deve bater exatamente com o que foi definido no backend.
    const response = await api.put(`/Reserva/${reservaId}/viajantes`, viajantes);
    return response.data;
  },

  /**
   * Atualiza o status de uma reserva.
   * PUT /api/Reserva/{id}
   */
  atualizarStatusReserva: async (id, novoStatus) => {
    // A API espera um objeto no formato do UpdateReservaDto: { status: "..." }
    const response = await api.put(`/Reserva/${id}`, { status: novoStatus });
    return response.data; // Geralmente retorna NoContent (204), então a resposta pode ser vazia.
  },

  listarReservasPorUsuario: async (usuarioId) => {
    const response = await api.get(`/Reserva/usuario/${usuarioId}`);
    return response.data;
  },

  /**
   * [ADMIN/ATENDENTE] Exporta todas as reservas em um arquivo PDF.
   * GET /api/relatorios/reservas/pdf
   */
  exportarReservasPdf: async () => {
    try {
      const response = await api.get('/relatorios/reservas/pdf', {
        responseType: 'blob', // Importante para que o Axios trate a resposta como um arquivo binário
      });
      return response.data;
    } catch (error) {
      console.error('Erro ao exportar reservas:', error);
      throw error;
    }
  },
};

export default reservaService;
