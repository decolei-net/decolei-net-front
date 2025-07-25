import api from './api' // Importa a instância do Axios configurada

const pacoteService = {
  /**
   * Busca todos os pacotes de viagem, com a opção de aplicar filtros.
   * Corresponde ao método [HttpGet] no PacotesController.
   * @param {object} filtros - Um objeto opcional com os filtros. 
   * Ex: { destino: 'Praia', precoMax: 2000 }
   * @returns {Promise<Array>} Uma lista de pacotes.
   */
  getPacotes: async (filtros = {}) => {
    // O Axios se encarrega de transformar o objeto 'filtros' em query parameters na URL
    // Ex: /api/Pacotes?destino=Praia&precoMax=2000
    const response = await api.get('/Pacotes', { params: filtros })
    return response.data
  },

  /**
   * Busca um pacote de viagem específico pelo seu ID.
   * Corresponde ao método [HttpGet("{id}")] no PacotesController.
   * @param {number} id - O ID do pacote a ser buscado.
   * @returns {Promise<object>} O pacote encontrado.
   */
  getPacotePorId: async (id) => {
    const response = await api.get(`/Pacotes/${id}`)
    return response.data
  },

  /**
   * Cria um novo pacote de viagem. Requer autenticação de ADMIN.
   * Corresponde ao método [HttpPost] no PacotesController.
   * @param {object} dadosDoPacote - Os dados do novo pacote.
   * @returns {Promise<object>} O pacote recém-criado.
   */
  criarPacote: async (dadosDoPacote) => {
    // O interceptor do api.js irá adicionar o token de autorização automaticamente
    const response = await api.post('/Pacotes', dadosDoPacote)
    return response.data
  },

  /**
   * Atualiza um pacote de viagem existente. Requer autenticação de ADMIN.
   * Corresponde ao método [HttpPut("{id}")] no PacotesController.
   * @param {number} id - O ID do pacote a ser atualizado.
   * @param {object} dadosDoPacote - Os dados a serem atualizados.
   * @returns {Promise<object>} A resposta de sucesso da API.
   */
  atualizarPacote: async (id, dadosDoPacote) => {
    const response = await api.put(`/Pacotes/${id}`, dadosDoPacote)
    return response.data
  },

  /**
   * Exclui um pacote de viagem. Requer autenticação de ADMIN.
   * Corresponde ao método [HttpDelete("{id}")] no PacotesController.
   * @param {number} id - O ID do pacote a ser excluído.
   * @returns {Promise<object>} A resposta de sucesso da API.
   */
  excluirPacote: async (id) => {
    const response = await api.delete(`/Pacotes/${id}`)
    return response.data
  }
}

export default pacoteService