import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import pacoteService from '../../services/pacoteServices';
import StarRating from '../../components/StarRating';
import { API_BASE_URL } from '../../services/api';
import {
  ChevronLeft,
  ChevronRight,
  PlayCircle,
  MapPin,
  Calendar,
  Users,
  Star,
  ArrowLeft,
} from 'lucide-react';

const PACOTES_VISTOS_KEY = 'pacotesVistosRecentemente';
const placeholderImg = 'https://placehold.co/800x600/374151/FFFFFF/png?text=Mídia+Indisponível';

const VisuallyHidden = ({ children }) => (
  <span
    className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
    style={{ clip: 'rect(0, 0, 0, 0)' }}
  >
    {children}
  </span>
);

const PacoteDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pacote, setPacote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [indiceAtual, setIndiceAtual] = useState(0);

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
          const somaDasNotas = dadosDoPacote.avaliacoes.reduce(
            (soma, avaliacao) => soma + avaliacao.nota,
            0,
          );
          mediaAvaliacoes = parseFloat((somaDasNotas / totalAvaliacoes).toFixed(1));
        }
        const pacoteCompleto = { ...dadosDoPacote, mediaAvaliacoes, totalAvaliacoes };
        setPacote(pacoteCompleto);
        setIndiceAtual(0);
        try {
          const historicoAtual = JSON.parse(localStorage.getItem(PACOTES_VISTOS_KEY)) || [];
          const historicoFiltrado = historicoAtual.filter((p) => p.id !== pacoteCompleto.id);
          const novoHistorico = [pacoteCompleto, ...historicoFiltrado];
          const historicoLimitado = novoHistorico.slice(0, 5);
          localStorage.setItem(PACOTES_VISTOS_KEY, JSON.stringify(historicoLimitado));
        } catch (storageError) {
          console.warn('Não foi possível salvar o histórico de visualização:', storageError);
        }
      } catch (err) {
        console.error('Erro ao buscar detalhes do pacote:', err);
        setError('Não foi possível carregar os detalhes do pacote.');
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

  const handleThumbnailKeyDown = (event, index) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIndiceAtual(index);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center"
        role="status"
      >
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-lg font-semibold text-gray-700">Carregando detalhes do pacote...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center"
        role="alert"
      >
        <div className="text-center p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-6">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-lg font-semibold text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-500 text-white px-6 py-3 rounded-xl hover:bg-red-600 transition-colors duration-300"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  if (!pacote) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center"
        role="status"
      >
        <div className="text-center p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-6">
            <span className="text-2xl">🔍</span>
          </div>
          <p className="text-lg font-semibold text-yellow-700">Pacote não encontrado.</p>
        </div>
      </div>
    );
  }

  const listaMidia = pacote.imagens || [];
  const midiaAtual = listaMidia.length > 0 ? listaMidia[indiceAtual] : null;
  const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(pacote.destino)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans">
      {/* Hero Section com informações principais */}
      <div className="relative w-full bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          ></div>
        </div>

        {/* Content Container */}
        <div className="relative z-10 container mx-auto px-6 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Botão de voltar */}
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors duration-300"
            >
              <ArrowLeft size={20} />
              Voltar
            </button>

            <div className="grid lg:grid-cols-2 gap-8 items-center">
              {/* Informações do pacote */}
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 leading-tight">
                  {pacote.titulo}
                </h1>
                <div className="flex items-center gap-2 text-blue-100 mb-4">
                  <MapPin size={20} />
                  <span className="text-lg">{pacote.destino}</span>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <StarRating rating={pacote.mediaAvaliacoes} />
                    <span className="text-blue-100">
                      ({pacote.totalAvaliacoes}{' '}
                      {pacote.totalAvaliacoes === 1 ? 'avaliação' : 'avaliações'})
                    </span>
                  </div>
                </div>

                <p className="text-blue-100 text-lg mb-6 leading-relaxed max-w-2xl">
                  {pacote.descricao}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={16} className="text-yellow-300" />
                      <span className="text-sm font-semibold text-white">Data de Partida</span>
                    </div>
                    <p className="text-blue-100">
                      {new Date(pacote.dataInicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar size={16} className="text-yellow-300" />
                      <span className="text-sm font-semibold text-white">Data de Retorno</span>
                    </div>
                    <p className="text-blue-100">
                      {new Date(pacote.dataFim).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                    </p>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users size={16} className="text-yellow-300" />
                      <span className="text-sm font-semibold text-white">Vagas Disponíveis</span>
                    </div>
                    <p className="text-blue-100 font-bold">{pacote.vagasDisponiveis}</p>
                  </div>
                </div>
              </div>

              {/* Card de Reserva */}
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/20">
                <div className="text-center mb-6">
                  <p className="text-gray-600 text-sm mb-2">Valor por pessoa</p>
                  <p className="text-4xl font-bold text-blue-600">
                    R${' '}
                    {typeof pacote.valor === 'number'
                      ? pacote.valor.toFixed(2).replace('.', ',')
                      : '0,00'}
                    <span className="text-lg text-gray-600 font-normal">/ pessoa</span>
                  </p>
                </div>
                <button
                  onClick={handleReservarAgora}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-300"
                >
                  Reservar Agora
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container max-w-7xl mx-auto px-6 py-12">
        <VisuallyHidden>
          <h2 aria-live="polite">Página de detalhes do pacote: {pacote.titulo}</h2>
        </VisuallyHidden>

        {/* Galeria de Mídia */}
        <section
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8"
          aria-labelledby="galeria-heading"
        >
          <h2
            id="galeria-heading"
            className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3"
          >
            📸 Galeria de Fotos
          </h2>

          <div className="w-full h-64 md:h-96 bg-gray-900 rounded-xl shadow-md overflow-hidden relative group">
            {listaMidia.length > 1 && (
              <>
                <button
                  onClick={midiaAnterior}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 m-3 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                  aria-label="Mídia Anterior"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={proximaMidia}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 m-3 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-all duration-300"
                  aria-label="Próxima Mídia"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
            {midiaAtual && midiaAtual.isVideo ? (
              <iframe
                className="w-full h-full rounded-xl"
                src={midiaAtual.url}
                title={`Vídeo sobre ${pacote.titulo}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <img
                src={midiaAtual ? `${API_BASE_URL}/${midiaAtual.url}` : placeholderImg}
                alt={`Mídia principal do pacote ${pacote.titulo}, imagem ${indiceAtual + 1} de ${listaMidia.length}`}
                className="w-full h-full object-cover rounded-xl"
              />
            )}
          </div>

          {listaMidia.length > 1 && (
            <div
              role="toolbar"
              aria-label="Controles da galeria de mídia"
              className="flex gap-2 mt-4 overflow-x-auto pb-2"
            >
              {listaMidia.map((midia, index) => {
                let thumbnailUrl = placeholderImg;
                if (midia.isVideo) {
                  const videoId = midia.url.split('/embed/').pop().split('?')[0];
                  thumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`;
                } else {
                  thumbnailUrl = `${API_BASE_URL}/${midia.url}`;
                }
                return (
                  <div
                    key={index}
                    onClick={() => setIndiceAtual(index)}
                    onKeyDown={(e) => handleThumbnailKeyDown(e, index)}
                    role="button"
                    tabIndex="0"
                    aria-label={`Mostrar mídia ${index + 1}`}
                    className={`relative flex flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg cursor-pointer transition-all duration-300 ${
                      indiceAtual === index
                        ? 'ring-4 ring-blue-500 ring-offset-2 shadow-lg'
                        : 'hover:opacity-80 hover:shadow-md'
                    }`}
                  >
                    <img
                      src={thumbnailUrl}
                      alt={`Miniatura ${index + 1} de ${listaMidia.length}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {midia.isVideo && (
                      <div
                        className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg"
                        aria-hidden="true"
                      >
                        <PlayCircle size={24} className="text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Avaliações */}
        <section
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8"
          aria-labelledby="avaliacoes-heading"
        >
          <h2
            id="avaliacoes-heading"
            className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3"
          >
            <Star size={32} className="text-yellow-500" />O que os viajantes dizem
          </h2>
          {pacote.totalAvaliacoes > 0 ? (
            <div className="space-y-6">
              {pacote.avaliacoes.map((avaliacao) => (
                <article
                  key={avaliacao.id}
                  className="bg-gray-50 rounded-xl p-6 border border-gray-100"
                  aria-label={`Avaliação de ${avaliacao.usuarioNome || 'Viajante'}`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold text-gray-800 text-lg">
                      {avaliacao.usuarioNome || 'Viajante'}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(avaliacao.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                    </span>
                  </div>
                  <div
                    className="flex items-center gap-2 mb-4"
                    aria-label={`Nota: ${avaliacao.nota} de 5 estrelas`}
                  >
                    <StarRating rating={avaliacao.nota} />
                  </div>
                  <p className="text-gray-700 leading-relaxed text-lg italic">
                    "{avaliacao.comentario || 'Sem comentário.'}"
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center p-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6">
                <Star size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-600 text-lg">
                Este pacote ainda não recebeu avaliações. Seja o primeiro a viajar e contar sua
                experiência!
              </p>
            </div>
          )}
        </section>

        {/* Localização */}
        <section
          className="bg-white rounded-2xl shadow-lg p-6 md:p-8"
          aria-labelledby="localizacao-heading"
        >
          <div className="flex items-center mb-6">
            <MapPin className="text-blue-600 mr-3" size={32} aria-hidden="true" />
            <h2 id="localizacao-heading" className="text-3xl font-bold text-gray-800">
              Localização
            </h2>
          </div>
          <div className="w-full h-80 rounded-xl overflow-hidden border shadow-lg">
            <iframe
              title={`Mapa de localização para ${pacote.destino}`}
              src={mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </section>
      </main>
    </div>
  );
};

export default PacoteDetalhes;
