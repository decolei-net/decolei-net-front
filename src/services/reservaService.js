import api from './api' // Sua instância do Axios com o interceptor

const reservaService = {
  /**
   * [ADMIN/ATENDENTE] Busca TODAS as reservas cadastradas no sistema.
   * Corresponde ao endpoint: GET /api/Reserva
   */
  getTodasReservas: async () => {
    const response = await api.get('/Reserva')
    return response.data
  },

  /**
   * [CLIENTE] Busca apenas as reservas pertencentes ao usuário que está logado.
   * Corresponde ao endpoint: GET /api/Reserva/minhas-reservas
   */
  getMinhasReservas: async () => {
    const response = await api.get('/Reserva/minhas-reservas')
    return response.data
  },

  /**
   * Busca os detalhes de uma reserva específica pelo ID.
   * A API vai verificar se o usuário logado tem permissão para ver esta reserva.
   * Corresponde ao endpoint: GET /api/Reserva/{id}
   * @param {number} id O ID da reserva.
   */
  getReservaPorId: async (id) => {
    const response = await api.get(`/Reserva/${id}`)
    return response.data
  },

  /**
   * Cria uma nova reserva para o usuário logado.
   * Corresponde ao endpoint: POST /api/Reserva
   * @param {object} dadosDaReserva Contém o ID do pacote e a lista de viajantes.
   * Ex: { pacoteViagemId: 1, viajantes: [{ nome: '...', documento: '...' }] }
   */
  criarReserva: async (dadosDaReserva) => {
    const response = await api.post('/Reserva', dadosDaReserva)
    return response.data
  },

  /**
   * [ADMIN/ATENDENTE] Atualiza o status de uma reserva.
   * Corresponde ao endpoint: PUT /api/Reserva/{id}
   * @param {number} id O ID da reserva a ser atualizada.
   * @param {string} novoStatus O novo status (ex: "CONFIRMADO", "CANCELADO").
   */
  atualizarStatusReserva: async (id, novoStatus) => {
    // A API espera um objeto no formato do UpdateReservaDto: { status: "..." }
    const response = await api.put(`/Reserva/${id}`, { status: novoStatus })
    return response.data // Geralmente retorna NoContent (204), então a resposta pode ser vazia.
  }
}

export default reservaService