import api from './api'; 

const avaliacaoService = {
  criarAvaliacao: async (dadosAvaliacao) => {
    // A rota correta é no plural, como no seu controller
    const response = await api.post('/avaliacoes', dadosAvaliacao);
    return response.data;
  },

  getMinhasAvaliacoes: async () => {
    // Rota corrigida para o plural
    const response = await api.get('/avaliacoes/minhas-avaliacoes');
    return response.data;
  },

  getAvaliacoesPorPacote: async (idPacote) => {
    // Rota corrigida para o plural
    const response = await api.get(`/avaliacoes/pacote/${idPacote}`);
    return response.data;
  },

  getAvaliacoesAprovadas: async (destino = '') => {
    const url = destino ? `/avaliacoes/aprovadas?destino=${destino}` : '/avaliacoes/aprovadas';
    const response = await api.get(url);
    return response.data;
  },

  getAvaliacoesPendentes: async (destino = '') => {
    const url = destino ? `/avaliacoes/pendentes?destino=${destino}` : '/avaliacoes/pendentes';
    const response = await api.get(url);
    return response.data;
  },

  moderarAvaliacao: async (idAvaliacao, acao) => {
    const dados = { acao: acao };
    // Rota corrigida para o plural
    const response = await api.put(`/avaliacoes/${idAvaliacao}`, dados);
    return response.data;
  },
};

export default avaliacaoService;