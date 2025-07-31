import api from './api'; // Sua instância do Axios já configurada

const avaliacaoService = {
  /**
   * Envia uma nova avaliação para um pacote.
   * (RECOMENDADO: Este endpoint deve exigir autenticação no backend).
   * Corresponde a: POST /avaliacoes
   * @param {object} dadosAvaliacao - Contém ID do pacote, ID do usuário (inseguro!), nota e comentário.
   */
  criarAvaliacao: async (dadosAvaliacao) => {
    // Se você aplicar a correção de segurança, o backend pegará o ID do usuário do token.
    const response = await api.post('/avaliacoes', dadosAvaliacao);
    return response.data;
  },

  getMinhasAvaliacoes: async () => {
    const response = await api.get('/avaliacoes/minhas-avaliacoes');
    return response.data;
  },

  /**
   * Busca todas as avaliações que já foram APROVADAS para um pacote.
   * Endpoint público.
   * Corresponde a: GET /avaliacoes/pacote/{id}
   * @param {number} idPacote - O ID do pacote de viagem.
   */
  getAvaliacoesPorPacote: async (idPacote) => {
    const response = await api.get(`/avaliacoes/pacote/${idPacote}`);
    return response.data;
  },

  /**
   * [ADMIN] Busca todas as avaliações que estão pendentes de moderação.
   * (RECOMENDADO: Este endpoint deve exigir autenticação de Admin no backend).
   * Corresponde a: GET /avaliacoes/pendentes
   */
  getAvaliacoesPendentes: async () => {
    const response = await api.get('/avaliacoes/pendentes');
    return response.data;
  },

  /**
   * [ADMIN] Aprova ou Rejeita uma avaliação.
   * Corresponde ao novo endpoint unificado: PUT /avaliacoes/{id}
   * @param {number} idAvaliacao - O ID da avaliação a ser moderada.
   * @param {string} acao - A ação a ser tomada. Deve ser 'aprovar' ou 'rejeitar'.
   */
  moderarAvaliacao: async (idAvaliacao, acao) => {
    // Monta o corpo da requisição como o DTO do backend espera: { "acao": "aprovar" }
    const dados = { acao: acao };
    const response = await api.put(`/avaliacoes/${idAvaliacao}`, dados);
    return response.data;
  },
};

export default avaliacaoService;
