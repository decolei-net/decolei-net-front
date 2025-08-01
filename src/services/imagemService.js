import api from './api'; // Importa a nossa instância configurada do Axios

/**
 * Faz o upload de uma imagem e a associa a um pacote de viagem.
 * @param {number} pacoteId - O ID do pacote ao qual a imagem será associada.
 * @param {File} file - O arquivo de imagem selecionado pelo usuário.
 * @returns {Promise<object>} - Os dados da imagem criada (ex: { id, url }).
 */
const uploadImagem = async (pacoteId, file) => {
  // FormData é o formato padrão para enviar arquivos em requisições HTTP.
  const formData = new FormData();
  
  // O nome 'file' aqui DEVE ser o mesmo do parâmetro no controller C#: [FromForm] IFormFile file
  formData.append('file', file);

  try {
    // A requisição POST é feita para o endpoint que criamos, passando o pacoteId na URL
    // e o arquivo dentro do FormData.
    const response = await api.post(`/Imagens/upload/${pacoteId}`, formData, {
      headers: {
        // Para uploads de arquivo, o header Content-Type é multipart/form-data.
        // O Axios geralmente define isso automaticamente quando passamos um FormData.
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao fazer upload da imagem:', error.response?.data || error.message);
    throw error.response?.data || new Error('Falha no upload da imagem.');
  }
};

/**
 * Deleta uma imagem específica pelo seu ID.
 * @param {number} imagemId - O ID da imagem a ser deletada.
 * @returns {Promise<object>} - A mensagem de sucesso do backend.
 */
const deletarImagem = async (imagemId) => {
  try {
    // Requisição DELETE para o endpoint que criamos, passando o ID da imagem na URL.
    const response = await api.delete(`/Imagens/${imagemId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar a imagem:', error.response?.data || error.message);
    throw error.response?.data || new Error('Falha ao deletar a imagem.');
  }
};

const imagemService = {
  uploadImagem,
  deletarImagem,
};

export default imagemService;