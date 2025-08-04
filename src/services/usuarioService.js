import api from './api';

const usuarioService = {
  getUsuarios: async (filtros = {}) => {
    const params = new URLSearchParams(filtros);
    const response = await api.get(`/Usuario?${params.toString()}`);
    return response.data;
  },
  
  getUsuarioPorId: async (id) => {
    const response = await api.get(`/Usuario/${id}`);
    return response.data;
  },
  
  atualizarUsuarioPorAdmin: async (id, dados) => {
    const response = await api.put(`/Usuario/admin/atualizar/${id}`, dados);
    return response.data;
  },

  registrarUsuario: async (dadosDoFormulario) => {
    const response = await api.post('/Usuario/registrar', dadosDoFormulario);
    return response.data;
  },

  registrarAdmin: async (dadosDoFormulario) => {
    const response = await api.post('/Usuario/registrar-admin', dadosDoFormulario);
    return response.data;
  },

  solicitarRedefinicaoSenha: async (email) => {
    const response = await api.post('/Usuario/recuperar-senha', { email: email });
    return response.data;
  },

  redefinirSenha: async (dados) => {
    const response = await api.post('/Usuario/redefinir-senha', dados);
    return response.data;
  },

  deletarUsuario: async (id) => {
    const response = await api.delete(`/Usuario/admin/deletar/${id}`);
    return response.status;
  },
  
  /**
   * @description Envia uma requisição para atualizar o perfil do usuário logado.
   * O ID do usuário é obtido pelo token no backend.
   * @param {object} dados - Os dados do perfil a serem atualizados (e.g., { nomeCompleto, telefone, email }).
   * @returns {Promise<object>} Um objeto contendo a mensagem de sucesso e os dados do usuário atualizado.
   */
  atualizarMeuPerfil: async (dados) => {
    const response = await api.put('/Usuario/meu-perfil', dados);
    return response.data;
  },

  /**
   * @description Envia uma requisição para alterar a senha do usuário logado.
   * @param {object} dados - Os dados para a alteração de senha (e.g., { senhaAtual, novaSenha }).
   * @returns {Promise<object>} Um objeto contendo a mensagem de sucesso.
   */
  alterarSenha: async (dados) => {
    const response = await api.post('/Usuario/alterar-senha', dados);
    return response.data;
  },

  /**
   * @description Busca os dados do perfil do usuário logado no backend.
   * O ID do usuário é obtido pelo token no backend.
   * @returns {Promise<object>} Um objeto contendo os dados completos do usuário.
   */
  getMeuPerfil: async () => {
    const response = await api.get('/Usuario/meu-perfil');
    return response.data;
  },
};

export default usuarioService;
