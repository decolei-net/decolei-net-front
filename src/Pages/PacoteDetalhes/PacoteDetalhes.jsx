import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import pacoteService from '../../services/pacoteServices';
import StarRating from '../../components/StarRating';
import { API_BASE_URL } from '../../services/api';
import { ChevronLeft, ChevronRight, PlayCircle, MapPin } from 'lucide-react';

const PACOTES_VISTOS_KEY = 'pacotesVistosRecentemente';
const placeholderImg = 'https://placehold.co/800x600/374151/FFFFFF/png?text=Mídia+Indisponível';

const PacoteDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pacote, setPacote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [indiceAtual, setIndiceAtual] = useState(0);
  const [timerAtivo, setTimerAtivo] = useState(true);

  const proximaMidia = useCallback(() => {
    if (pacote && pacote.imagens && pacote.imagens.length > 1) {
      setIndiceAtual((prev) => (prev + 1) % pacote.imagens.length);
    }
  }, [pacote]);

  const midiaAnterior = () => {
    if (pacote && pacote.imagens && pacote.imagens.length > 1) {
      setIndiceAtual((prev) => (prev - 1 + pacote.imagens.length) % pacote.imagens.length);
    }
  };

  useEffect(() => {
    const fetchPacote = async () => {
      if (!id) return;
      try {
        setLoading(true);
        setError(null);
        const dadosDoPacote = await pacoteService.getPacotePorId(Number(id));
        const totalAvaliacoes = dadosDoPacote.avaliacoes?.length || 0;

        let mediaAvaliacoes = 0;
        if (totalAvaliacoes > 0) {
          const somaDasNotas = dadosDoPacote.avaliacoes.reduce((soma, avaliacao) => soma + avaliacao.nota, 0);
          mediaAvaliacoes = parseFloat((somaDasNotas / totalAvaliacoes).toFixed(1));
        }

        // objeto completo do pacote
        const pacoteCompleto = { ...dadosDoPacote, mediaAvaliacoes, totalAvaliacoes };
        setPacote(pacoteCompleto);
        setIndiceAtual(0);

        // Início da Lógica para Salvar no Histórico de Visualização
        try {
          // 1. Pega o histórico atual do localStorage ou cria um array vazio.
          const historicoAtual = JSON.parse(localStorage.getItem(PACOTES_VISTOS_KEY)) || [];

          // 2. Remove o pacote atual do histórico (caso o usuário esteja visitando a página de novo).
          const historicoFiltrado = historicoAtual.filter(p => p.id !== pacoteCompleto.id);

          // 3. Adiciona o pacote recém-visto no início da lista.
          const novoHistorico = [pacoteCompleto, ...historicoFiltrado];

          // 4. Limita o histórico a um número razoável (ex: 5 pacotes).
          const historicoLimitado = novoHistorico.slice(0, 5);

          // 5. Salva o histórico atualizado de volta no localStorage.
          localStorage.setItem(PACOTES_VISTOS_KEY, JSON.stringify(historicoLimitado));

        } catch (storageError) {
          console.warn("Não foi possível salvar o histórico de visualização:", storageError);
        }

      } catch (err) {
        console.error("Erro ao buscar detalhes do pacote:", err);
        setError("Não foi possível carregar os detalhes do pacote.");
      } finally {
        setLoading(false);
      }
    };
    fetchPacote();
  }, [id]);

  useEffect(() => {
    const midiaAtual = pacote?.imagens?.[indiceAtual];
    if (pacote?.imagens?.length > 1 && midiaAtual && !midiaAtual.isVideo) {
      const timerId = setInterval(proximaMidia, 5000);
      return () => clearInterval(timerId);
    }
  }, [pacote, proximaMidia, indiceAtual]);

  const handleReservarAgora = () => {
    navigate(`/reservar/${pacote.id}`);
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

  const listaMidia = pacote.imagens || [];
  const midiaAtual = listaMidia.length > 0 ? listaMidia[indiceAtual] : null;
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(pacote.destino)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 flex flex-col lg:flex-row gap-8">
          <div className="flex-1 lg:w-2/3">
            <div className="w-full h-64 md:h-96 bg-gray-900 rounded-lg shadow-md overflow-hidden relative group">
              {listaMidia.length > 1 && (
                <>
                  <button onClick={midiaAnterior} className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 m-2 bg-black bg-opacity-40 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Mídia Anterior"><ChevronLeft size={24} /></button>
                  <button onClick={proximaMidia} className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 m-2 bg-black bg-opacity-40 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Próxima Mídia"><ChevronRight size={24} /></button>
                </>
              )}
              {midiaAtual && midiaAtual.isVideo ? (
                <iframe
                  className="w-full h-full"
                  src={midiaAtual.url}
                  title="Player de vídeo do pacote"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <img
                  src={midiaAtual ? `${API_BASE_URL}/${midiaAtual.url}` : placeholderImg}
                  alt={pacote.titulo || 'Mídia do Pacote'}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            {listaMidia.length > 1 && (
              <div className="flex gap-1 mt-2 overflow-x-auto pb-2">
                {listaMidia.map((midia, index) => {
                  let thumbnailUrl = placeholderImg;
                  if (midia.isVideo) {
                    const videoId = midia.url.split('/embed/').pop().split('?')[0];
                    thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
                  } else {
                    thumbnailUrl = `${API_BASE_URL}/${midia.url}`;
                  }
                  return (
                    <div key={index} onClick={() => setIndiceAtual(index)} className={`relative flex flex-shrink-0 ml-2 mt-2 w-20 h-20 bg-gray-200 rounded-lg object-cover cursor-pointer transition-all duration-200 ${indiceAtual === index ? 'ring-4 ring-blue-500 ring-offset-2' : 'hover:opacity-80'}`}>
                      <img src={thumbnailUrl} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                      {midia.isVideo && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
                          <PlayCircle size={32} className="text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          <div className="flex-1 lg:w-1/3 flex flex-col">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{pacote.titulo}</h1>
            <p className="text-lg text-gray-500 mb-4">{pacote.destino}</p>
            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={pacote.mediaAvaliacoes} />
              <span className="text-gray-600 text-sm">({pacote.totalAvaliacoes} {pacote.totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'})</span>
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
              <p className="text-4xl font-bold text-blue-600 mb-4">R$ {typeof pacote.valor === 'number' ? pacote.valor.toFixed(2).replace('.', ',') : '0,00'}<span className="text-lg text-gray-600 font-normal">/ pessoa</span></p>
              <button
                onClick={handleReservarAgora}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out"
              >
                Reservar
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
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mt-8">
          <div className="flex items-center mb-6">
            <MapPin className="text-blue-600 mr-3" size={28} />
            <h2 className="text-2xl font-bold text-gray-900">Localização</h2>
          </div>
          <div className="w-full h-80 rounded-lg overflow-hidden border">
            <iframe
              title={`Mapa de ${pacote.destino}`}
              src={mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PacoteDetalhes;
