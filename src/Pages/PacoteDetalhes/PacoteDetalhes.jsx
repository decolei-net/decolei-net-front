import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import pacoteService from '../../services/pacoteServices'; 

// Não precisamos mais importar logoImage aqui, pois a navbar está no ClienteLayout
// import logoImage from '../../assets/decolei.png'; 

const PacoteDetalhes = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [pacote, setPacote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPacote = async () => {
      try {
        setLoading(true); 
        setError(null);   

        const dadosDoPacote = await pacoteService.getPacotePorId(Number(id));
        setPacote(dadosDoPacote); 
      } catch (err) {
        console.error("Erro ao buscar detalhes do pacote:", err);
        setError("Não foi possível carregar os detalhes do pacote. Tente novamente mais tarde."); 
      } finally {
        setLoading(false); 
      }
    };

    if (id) {
      fetchPacote();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-semibold text-gray-700">Carregando detalhes do pacote...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-800 p-4 rounded-md">
        <p className="text-lg font-semibold">{error}</p>
      </div>
    );
  }

  if (!pacote) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-yellow-100 text-yellow-800 p-4 rounded-md">
        <p className="text-lg font-semibold">Pacote não encontrado.</p>
      </div>
    );
  }

  // Helper para renderizar estrelas
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < rating) {
        stars.push(<span key={i} className="text-yellow-400">&#9733;</span>); // Estrela preenchida
      } else {
        stars.push(<span key={i} className="text-gray-300">&#9733;</span>); // Estrela vazia
      }
    }
    return stars;
  };

  // Helper para formatar datas
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  // NOVO HANDLER PARA O BOTÃO RESERVAR AGORA
  const handleReservarAgora = () => {
    // Redireciona para a tela de reserva, passando o ID do pacote
    navigate(`/reservar/${pacote.id}`); 
  };

  // Se tudo deu certo, exibe os detalhes do pacote com o novo layout.
  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      {/* O cabeçalho/navbar é fornecido pelo ClienteLayout */}

      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 flex flex-col lg:flex-row gap-8">
          {/* Coluna Esquerda: Placeholder de Vídeo ou Foto Principal e Miniaturas */}
          <div className="flex-1 lg:w-2/3">
            {/* Placeholder de Vídeo ou Foto Principal */}
            <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 text-lg font-medium overflow-hidden relative">
              {pacote.imagemURL ? (
                <img src={pacote.imagemURL} alt={pacote.titulo} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/600x400/E0E0E0/808080?text=Imagem+N%C3%A3o+Dispon%C3%ADvel"; }} />
              ) : pacote.videoURL ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-300">
                  <p>Placeholder de Vídeo (URL: {pacote.videoURL})</p>
                </div>
              ) : (
                <p>Placeholder de Vídeo ou Foto Principal</p>
              )}
            </div>

            {/* Miniaturas (se houver mais imagens) */}
            <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
              {/*
                IMPLEMENTAÇÃO FUTURA: Para ter miniaturas dinâmicas, seu objeto 'pacote'
                precisaria ter uma propriedade como 'galeriaImagens' que é um array de URLs de imagens.
                Exemplo de como você mapearia se essa propriedade existisse:
                {pacote.galeriaImagens && pacote.galeriaImagens.map((imgUrl, index) => (
                  <img key={index} src={imgUrl} alt={`Miniatura ${index + 1}`} 
                       className="flex-shrink-0 w-24 h-20 bg-gray-200 rounded-lg object-cover" 
                       onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/96x80/E0E0E0/808080?text=Mini"; }} />
                ))}
              */}
              {(!pacote.galeriaImagens || pacote.galeriaImagens.length === 0) && [1, 2, 3, 4].map((_, index) => (
                <div key={index} className="flex-shrink-0 w-24 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-sm">
                  Mini {index + 1}
                </div>
              ))}
            </div>
          </div>

          {/* Coluna Direita: Detalhes do Pacote, Preço e Botão */}
          <div className="flex-1 lg:w-1/3 flex flex-col">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{pacote.titulo || 'Nome do Pacote'}</h1>
            
            {/* Avaliações */}
            <div className="flex items-center mb-4">
              <div className="flex text-yellow-400 text-lg">
                {renderStars(pacote.avaliacoes && pacote.avaliacoes.length > 0 
                  ? pacote.avaliacoes.reduce((sum, av) => sum + av.nota, 0) / pacote.avaliacoes.length 
                  : 0)}
              </div>
              <span className="text-gray-600 ml-2 text-sm">{pacote.avaliacoes ? pacote.avaliacoes.length : 0} avaliações</span>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              {pacote.descricao || 'Descrição detalhada do pacote de viagem, incluindo todos os benefícios e experiências oferecidas.'}
            </p>

            {/* Datas Disponíveis */}
            <div className="mb-6 text-gray-700">
              <p className="font-semibold text-lg mb-2">Datas Disponíveis:</p>
              <p>De: <span className="font-medium">{formatDate(pacote.dataInicio)}</span></p>
              <p>Até: <span className="font-medium">{formatDate(pacote.dataFim)}</span></p>
            </div>

            {/* Preço e Botão */}
            <div className="mt-auto border-t pt-6">
              <p className="text-gray-600 text-sm mb-2">A partir de</p>
              <p className="text-4xl font-bold text-blue-600 mb-4">
                R$ {typeof pacote.valor === 'number' ? pacote.valor.toFixed(2).replace('.', ',') : '0,00'} <span className="text-lg text-gray-600 font-normal">/ pessoa</span>
              </p>
              <button 
                onClick={handleReservarAgora} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out">
                Reservar Agora
              </button>
            </div>
          </div>
        </div>

        {/* Seção de Avaliações e Comentários */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Avaliações e Comentários</h2>
          
          {pacote.avaliacoes && pacote.avaliacoes.length > 0 ? (
            pacote.avaliacoes.map((avaliacao, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                <div className="flex items-center mb-2">
                  <span className="font-semibold text-gray-800">{avaliacao.usuarioNome || 'Usuário Anônimo'}</span> 
                  <div className="flex text-yellow-400 text-sm ml-3">
                    {renderStars(avaliacao.nota)}
                  </div>
                </div>
                <p className="text-gray-700 italic">"{avaliacao.comentario || 'Sem comentário.'}"</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">Nenhuma avaliação encontrada para este pacote.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default PacoteDetalhes;
