import api from './api' // Importa a instância do Axios configurada

const pacoteService = {

  getPacotes: async (filtros = {}) => {
    const response = await api.get('/Pacotes', { params: filtros })
    return response.data
  },

  getPacotePorId: async (id) => {
    const response = await api.get(`/Pacotes/${id}`)
    return response.data
  },

  criarPacote: async (dadosDoPacote) => {
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