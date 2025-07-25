import api from './api' // Sua instância configurada do Axios

const pagamentoService = {
  /**
   * [ADMIN] Obtém o status de um pagamento específico.
   * Corresponde ao endpoint: GET /pagamentos/status/{id}
   * @param {number} id O ID do pagamento.
   */
  obterStatusPagamento: async (id) => {
    // O interceptor cuidará da autorização
    const response = await api.get(`/pagamentos/status/${id}`)
    return response.data
  },

  /**
   * [CLIENTE/ADMIN] Inicia o processo de pagamento para uma reserva.
   * Corresponde ao endpoint: POST /pagamentos
   * @param {object} dadosPagamento Os dados necessários para o pagamento, conforme esperado pelo seu PagamentoEntradaDTO.
   * Ex: { reservaId: 1, tipoPagamento: 'CARTAO_CREDITO', dadosCartao: {...} }
   */
  criarPagamento: async (dadosPagamento) => {
    const response = await api.post('/pagamentos', dadosPagamento)
    return response.data
  },

  /**
   * [ADMIN] Atualiza manualmente o status de um pagamento.
   * Corresponde ao endpoint: PUT /pagamentos/{id}
   * @param {number} id O ID do pagamento a ser atualizado.
   * @param {string} novoStatus O novo status do pagamento (ex: "APROVADO", "RECUSADO").
   */
  atualizarStatusPagamento: async (id, novoStatus) => {
    const response = await api.put(`/pagamentos/${id}`, { status: novoStatus })
    return response.data
  }
}

export default pagamentoService