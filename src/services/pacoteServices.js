import api from './api' // Importa a instância do Axios configurada

const pacoteService = {

  getPacotes: async (filtros = {}) => {
    // O Axios se encarrega de transformar o objeto 'filtros' em query parameters na URL
    // Ex: /api/Pacotes?destino=Praia&precoMax=2000
    const response = await api.get('/Pacotes', { params: filtros })
    return response.data
  },

  getPacotePorId: async (id) => {
    const response = await api.get(`/Pacotes/${id}`)
    return response.data
  },

  criarPacote: async (dadosDoPacote) => {
    // O interceptor do api.js irá adicionar o token de autorização automaticamente
    const response = await api.post('/Pacotes', dadosDoPacote)
    return response.data
  },

  atualizarPacote: async (id, dadosDoPacote) => {
    const response = await api.put(`/Pacotes/${id}`, dadosDoPacote)
    return response.data
  },

  excluirPacote: async (id) => {
    const response = await api.delete(`/Pacotes/${id}`)
    return response.data
  }
}

export default pacoteService