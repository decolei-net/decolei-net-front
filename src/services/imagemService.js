import api from './api';

// Faz o upload de um arquivo de IMAGEM e associa a um pacote.
const uploadImagem = async (pacoteId, file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post(`/Imagens/upload/${pacoteId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Erro no upload da imagem:', error.response?.data || error.message);
    throw error;
  }
};

// Adiciona um link de VÍDEO e associa a um pacote.
const addVideo = async (pacoteId, urlVideo) => {
  try {
    const response = await api.post(`/Imagens/add-video/${pacoteId}`, { url: urlVideo });
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar vídeo:', error.response?.data || error.message);
    throw error;
  }
};

// Busca TODAS as mídias (imagens e vídeos) de um pacote.
const getAllMidiaPorPacote = async (pacoteId) => {
    try {
        const response = await api.get(`/Imagens/all/${pacoteId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar todas as mídias do pacote:', error.response?.data || error.message);
        throw error;
    }
};

// Busca apenas os VÍDEOS de um pacote.
const getVideosPorPacote = async (pacoteId) => {
    try {
        const response = await api.get(`/Imagens/videos/${pacoteId}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar vídeos do pacote:', error.response?.data || error.message);
        throw error;
    }
};

// Deleta qualquer item de MÍDIA pelo seu ID.
const deletarMidia = async (midiaId) => {
  try {
    const response = await api.delete(`/Imagens/${midiaId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar mídia:', error.response?.data || error.message);
    throw error;
  }
};

const midiaService = {
  uploadImagem,
  addVideo,
  getAllMidiaPorPacote, // Função adicionada
  getVideosPorPacote,
  deletarMidia,
};

export default midiaService;