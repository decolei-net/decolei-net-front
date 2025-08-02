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
  }
};

export default usuarioService;