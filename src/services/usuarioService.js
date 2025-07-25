import api from './api' // Seu arquivo api.js

const usuarioService = {
  // --- Funções que já tínhamos ---
  getUsuarios: async () => {
    const response = await api.get('/Usuario')
    return response.data
  },

  getUsuarioPorId: async (id) => {
    const response = await api.get(`/Usuario/${id}`)
    return response.data
  },

  registrarUsuario: async (dadosDoFormulario) => {
    const response = await api.post('/Usuario/registrar', dadosDoFormulario)
    return response.data
  },

  registrarAdmin: async (dadosDoFormulario) => {
    const response = await api.post('/Usuario/registrar-admin', dadosDoFormulario)
    return response.data
  },


  solicitarRedefinicaoSenha: async (email) => {
    const response = await api.post('/Usuario/recuperar-senha', { email: email })
    return response.data
  },

  redefinirSenha: async (dados) => {
    const response = await api.post('/Usuario/redefinir-senha', dados)
    return response.data
  }
}

export default usuarioService