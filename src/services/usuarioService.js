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


  /**
   * Solicita o envio do link de recuperação de senha para o e-mail do usuário.
   * Corresponde ao método [HttpPost("recuperar-senha")] no UsuarioController.
   * @param {string} email O e-mail do usuário que esqueceu a senha.
   */
  solicitarRedefinicaoSenha: async (email) => {
    // A API espera um objeto com a propriedade "email"
    const response = await api.post('/Usuario/recuperar-senha', { email: email })
    return response.data
  },

  /**
   * Efetivamente redefine a senha do usuário usando o token recebido por e-mail.
   * Corresponde ao método [HttpPost("redefinir-senha")] no UsuarioController.
   * @param {object} dados Contém o email, o token e a nova senha.
   * Ex: { email: 'user@teste.com', token: 'seu_token_aqui', novaSenha: 'NovaSenha@123' }
   */
  redefinirSenha: async (dados) => {
    const response = await api.post('/Usuario/redefinir-senha', dados)
    return response.data
  }
}

export default usuarioService