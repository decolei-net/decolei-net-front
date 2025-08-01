import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import pacoteService from '../../services/pacoteServices';
import reservaService from '../../services/reservaService';
import StarRating from '../../components/StarRating';
import { API_BASE_URL } from '../../services/api';

// Ícones para as setas do carrossel
import { ChevronLeft, ChevronRight } from 'lucide-react';

const placeholderImg = 'https://placehold.co/800x600/374151/FFFFFF/png?text=Imagem+Indisponível';

const PacoteDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pacote, setPacote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReservando, setIsReservando] = useState(false);

  // Controlamos o carrossel pelo índice da imagem atual.
  const [indiceAtual, setIndiceAtual] = useState(0);

  // useCallback memoriza as funções para otimizar a performance.
  const proximaImagem = useCallback(() => {
    if (pacote && pacote.imagens && pacote.imagens.length > 1) {
      setIndiceAtual((indiceAnterior) => (indiceAnterior + 1) % pacote.imagens.length);
    }
  }, [pacote]);

  const imagemAnterior = () => {
    if (pacote && pacote.imagens && pacote.imagens.length > 1) {
      setIndiceAtual((indiceAnterior) => (indiceAnterior - 1 + pacote.imagens.length) % pacote.imagens.length);
    }
  };

  useEffect(() => {
    const fetchPacote = async () => {
      try {
        setLoading(true);
        setError(null);
        const dadosDoPacote = await pacoteService.getPacotePorId(Number(id));

        // Ferramenta de Debug: Verifique os dados no console do navegador (F12)
        console.log("Dados do Pacote Recebidos da API:", dadosDoPacote);

        const totalAvaliacoes = dadosDoPacote.avaliacoes?.length || 0;
        let mediaAvaliacoes = 0;
        if (totalAvaliacoes > 0) {
          const somaDasNotas = dadosDoPacote.avaliacoes.reduce((soma, avaliacao) => soma + avaliacao.nota, 0);
          mediaAvaliacoes = parseFloat((somaDasNotas / totalAvaliacoes).toFixed(1));
        }

        setPacote({
          ...dadosDoPacote,
          mediaAvaliacoes,
          totalAvaliacoes
        });

        // Reseta o índice para a primeira imagem sempre que um novo pacote é carregado.
        setIndiceAtual(0);

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

  // Efeito para o carrossel automático
  useEffect(() => {
    if (pacote && pacote.imagens && pacote.imagens.length > 1) {
      const timerId = setInterval(proximaImagem, 5000); // Muda a cada 5 segundos
      return () => clearInterval(timerId); // Limpa o timer ao sair do componente
    }
  }, [pacote, proximaImagem]);

  const handleReservarAgora = async () => {
    setIsReservando(true);
    try {
      const novaReserva = await reservaService.criarReserva({ pacoteViagemId: pacote.id });
      navigate(`/pagamento/${novaReserva.id}`);
    } catch (err) {
      console.error("Erro ao iniciar a reserva:", err);
      alert(err.response?.data?.erro || "Não foi possível iniciar o processo de reserva.");
    } finally {
      setIsReservando(false);
    }
  };

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
  
  const listaImagens = pacote.imagens?.map(urlRelativa => `${API_BASE_URL}/${urlRelativa}`) || [];
  const imagemPrincipal = listaImagens.length > 0 ? listaImagens[indiceAtual] : placeholderImg;

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 flex flex-col lg:flex-row gap-8">

          <div className="flex-1 lg:w-2/3">
            <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg shadow-md overflow-hidden relative group">
              {listaImagens.length > 1 && (
                <>
                  <button onClick={imagemAnterior} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 m-2 bg-black bg-opacity-30 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Imagem Anterior">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={proximaImagem} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 m-2 bg-black bg-opacity-30 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Próxima Imagem">
                    <ChevronRight size={24} />
                  </button>
                </>
              )}
              <img src={imagemPrincipal} alt={pacote.titulo || 'Imagem do Pacote'} className="w-full h-full object-cover transition-opacity duration-500 ease-in-out" key={imagemPrincipal} onError={(e) => { e.currentTarget.src = placeholderImg; }} />
            </div>

            {listaImagens.length > 1 && (
              <div className="flex gap-4 mt-4 overflow-x-auto pb-2">
                {listaImagens.map((urlCompleta, index) => (
                  <img key={index} src={urlCompleta} alt={`Miniatura ${index + 1}`} className={`flex-shrink-0 w-24 h-20 bg-gray-200 rounded-lg object-cover cursor-pointer transition-all duration-200 ${indiceAtual === index ? 'ring-4 ring-blue-500 ring-offset-2' : 'hover:opacity-80'}`} onClick={() => setIndiceAtual(index)} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 lg:w-1/3 flex flex-col">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{pacote.titulo}</h1>
            <p className="text-xl font-bold text-gray-600 -mt-2 mb-4">Destino: {pacote.destino}</p>
            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={pacote.mediaAvaliacoes} />
              <span className="text-gray-600 text-sm">
                ({pacote.totalAvaliacoes} {pacote.totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'})
              </span>
            </div>
            <p className="text-gray-700 leading-relaxed mb-6">{pacote.descricao}</p>
            <div className="mb-6 text-gray-700">
              <p className="font-semibold text-lg mb-2">Período da Viagem:</p>
              <p>De: <span className="font-medium">{new Date(pacote.dataInicio).toLocaleDateString('pt-BR')}</span></p>
              <p>Até: <span className="font-medium">{new Date(pacote.dataFim).toLocaleDateString('pt-BR')}</span></p>
              <p className="mt-2">Vagas disponíveis: <span className="font-bold">{pacote.vagasDisponiveis}</span></p>
            </div>
            <div className="mt-auto border-t pt-6">
              <p className="text-gray-600 text-sm mb-2">Valor por pessoa</p>
              <p className="text-4xl font-bold text-blue-600 mb-4">
                R$ {typeof pacote.valor === 'number' ? pacote.valor.toFixed(2).replace('.', ',') : '0,00'}
                <span className="text-lg text-gray-600 font-normal">/ pessoa</span>
              </p>
              <button onClick={handleReservarAgora} disabled={isReservando} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out disabled:bg-blue-300 disabled:cursor-not-allowed">
                {isReservando ? 'Processando...' : 'Reservar e Pagar'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">O que os viajantes dizem</h2>
          {pacote.totalAvaliacoes > 0 ? (
            pacote.avaliacoes.map((avaliacao) => (
              <div key={avaliacao.id} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                <div className="flex items-center mb-2">
                  <span className="font-semibold text-gray-800">{avaliacao.usuarioNome || 'Viajante'}</span>
                </div>
                <div className='flex items-center gap-2 mb-2'>
                  <StarRating rating={avaliacao.nota} />
                  <span className='text-xs text-gray-400'>{new Date(avaliacao.data).toLocaleDateString('pt-BR')}</span>
                </div>
                <p className="text-gray-700 italic">"{avaliacao.comentario || 'Sem comentário.'}"</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">Este pacote ainda não recebeu avaliações. Seja o primeiro a viajar e contar sua experiência!</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default PacoteDetalhes;