import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import pacoteService from '../../services/pacoteServices';
import reservaService from '../../services/reservaService';
import StarRating from '../../components/StarRating';

const placeholderImg = 'https://placehold.co/600x400/374151/FFFFFF/png?text=Decolei.net';

const PacoteDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pacote, setPacote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isReservando, setIsReservando] = useState(false);

  useEffect(() => {
    const fetchPacote = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Busca os dados do pacote. O backend já inclui a lista de avaliações.
        const dadosDoPacote = await pacoteService.getPacotePorId(Number(id));

        // 2. Calcula a média e o total de avaliações no frontend
        const totalAvaliacoes = dadosDoPacote.avaliacoes?.length || 0;
        let mediaAvaliacoes = 0;
        if (totalAvaliacoes > 0) {
            const somaDasNotas = dadosDoPacote.avaliacoes.reduce((soma, avaliacao) => soma + avaliacao.nota, 0);
            mediaAvaliacoes = parseFloat((somaDasNotas / totalAvaliacoes).toFixed(1));
        }

        // 3. Salva o pacote "enriquecido" com os dados calculados no estado
        setPacote({
            ...dadosDoPacote,
            mediaAvaliacoes,
            totalAvaliacoes
        });

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

  if (loading) return <div className="text-center p-10 font-bold">Carregando detalhes do pacote...</div>;
  if (error) return <div className="text-center p-10 text-red-600 font-bold">{error}</div>;
  if (!pacote) return <div className="text-center p-10 text-yellow-600 font-bold">Pacote não encontrado.</div>;

  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      <main className="container mx-auto p-4 md:p-8">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 flex flex-col lg:flex-row gap-8">

          <div className="flex-1 lg:w-2/3">
            <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg overflow-hidden relative">
              <img src={pacote.imagemURL || placeholderImg} alt={pacote.titulo} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = placeholderImg; }} />
            </div>
          </div>

          <div className="flex-1 lg:w-1/3 flex flex-col">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">{pacote.titulo}</h1>

            {/* SEÇÃO DE AVALIAÇÃO COM STAR RATING */}
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
                R$ {pacote.valor.toFixed(2).replace('.', ',')}
              </p>
              <button
                onClick={handleReservarAgora}
                disabled={isReservando}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300 ease-in-out disabled:bg-blue-300 disabled:cursor-not-allowed"
              >
                {isReservando ? 'Processando...' : 'Reservar e Pagar'}
              </button>
            </div>
          </div>
        </div>

        {/* SEÇÃO DETALHADA DE AVALIAÇÕES */}
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">O que os viajantes dizem</h2>
          {pacote.totalAvaliacoes > 0 ? (
            pacote.avaliacoes.map((avaliacao) => (
              <div key={avaliacao.id} className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:pb-0 last:mb-0">
                <div className="flex items-center mb-2">
                  {/* O nome do usuário virá do backend, se a propriedade for incluída */}
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
