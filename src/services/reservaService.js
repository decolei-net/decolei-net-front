import api from './api' // Importa a instância do Axios

const reservaService = {
  /**
   * (ADMIN/ATENDENTE) Busca TODAS as reservas do sistema.
   * Corresponde ao método [HttpGet] no ReservaController.
   * Requer token de ADMIN ou ATENDENTE.
   * @returns {Promise<Array>} Uma lista com todas as reservas.
   */
  getTodasReservas: async () => {
    // O interceptor do Axios cuidará da autorização
    const response = await api.get('/Reserva')
    return response.data
  },

  /**
   * (CLIENTE) Busca apenas as reservas do usuário logado.
   * Corresponde ao método [HttpGet("minhas-reservas")] no ReservaController.
   * Requer qualquer token de usuário autenticado.
   * @returns {Promise<Array>} Uma lista com as reservas do usuário.
   */
  getMinhasReservas: async () => {
    const response = await api.get('/Reserva/minhas-reservas')
    return response.data
  },

  /**
   * Busca uma reserva específica pelo seu ID.
   * A API validará se o usuário logado pode ou não ver esta reserva.
   * Corresponde ao método [HttpGet("{id}")] no ReservaController.
   * @param {number} id - O ID da reserva a ser buscada.
   * @returns {Promise<object>} Os detalhes da reserva encontrada.
   */
  getReservaPorId: async (id) => {
    const response = await api.get(`/Reserva/${id}`)
    return response.data
  },

  /**
   * Cria uma nova reserva para o usuário logado.
   * Corresponde ao método [HttpPost] no ReservaController.
   * @param {object} dadosDaReserva - Objeto com o ID do pacote e a lista de viajantes.
   * Ex: { pacoteViagemId: 123, viajantes: [{ nome: 'Fulano', documento: '123456' }] }
   * @returns {Promise<object>} A reserva recém-criada.
   */
  criarReserva: async (dadosDaReserva) => {
    const response = await api.post('/Reserva', dadosDaReserva)
    return response.data
  },

  /**
   * (ADMIN/ATENDENTE) Atualiza o status de uma reserva existente.
   * Corresponde ao método [HttpPut("{id}")] no ReservaController.
   * @param {number} id - O ID da reserva a ser atualizada.
   * @param {string} novoStatus - O novo status da reserva (ex: "CONFIRMADO", "CANCELADO").
   * @returns {Promise<void>} Não retorna conteúdo em caso de sucesso.
   */
  atualizarStatusReserva: async (id, novoStatus) => {
    // A API espera um objeto { status: "SEU_STATUS_AQUI" }
    const response = await api.put(`/Reserva/${id}`, { status: novoStatus })
    return response.data
  }
}

export default reservaService