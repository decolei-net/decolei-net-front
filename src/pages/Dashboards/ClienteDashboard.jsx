import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import reservaService from '../../services/reservaService';
import avaliacoesService from '../../services/avaliacoesServices';
import ModalDetalhesReservas from '../../components/ModalDetalhesReservas.jsx';
import { Clock, PlaneTakeoff, ShieldCheck } from 'lucide-react';
import AvaliacaoForm from '../../components/AvaliacaoForm.jsx';
import { API_BASE_URL } from '../../services/api.js';

const placeholderImg = 'https://placehold.co/100x100/e2e8f0/94a3b8/png?text=Sem+Imagem';

export default function ClienteDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [reservas, setReservas] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('viagens');
  const [modalAberta, setModalAberta] = useState(false);
  const [reservaSelecionada, setReservaSelecionada] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dadosReservas, dadosAvaliacoes] = await Promise.all([
        reservaService.getMinhasReservas(),
        avaliacoesService.getMinhasAvaliacoes()
      ]);
      // ✅ Log para ver exatamente o que a API está retornando
      console.log("Dados recebidos de getMinhasReservas:", dadosReservas);
      setReservas(Array.isArray(dadosReservas) ? dadosReservas : []);
      setAvaliacoes(Array.isArray(dadosAvaliacoes) ? dadosAvaliacoes : []);
    } catch (err) {
      console.error('Falha ao buscar dados do painel:', err);
      setError('Não foi possível carregar os dados. Tente atualizar a página.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const viagensParaAvaliar = useMemo(() => {
    const pacotesAvaliadosIds = new Set(avaliacoes.filter(a => a && a.pacote).map(a => a.pacote.id));
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    return reservas.filter(reserva => {
      if (!reserva || !reserva.pacoteViagem) return false;
      const dataFim = new Date(reserva.pacoteViagem.dataFim);
      const statusValido = reserva.status === 'CONCLUIDA';
      const jaTerminou = dataFim < hoje;
      const naoFoiAvaliado = !pacotesAvaliadosIds.has(reserva.pacoteViagem.id);
      return statusValido && jaTerminou && naoFoiAvaliado;
    });
  }, [reservas, avaliacoes]);

  const reservasPendentes = useMemo(() => reservas.filter(r => r?.status === 'PENDENTE'), [reservas]);
  const reservasConfirmadas = useMemo(() => reservas.filter(r => r?.status === 'CONFIRMADA'), [reservas]);
  const reservasConcluidas = useMemo(() => reservas.filter(r => r?.status === 'CONCLUIDA'), [reservas]);

  const abrirModal = (reserva) => {
    setReservaSelecionada(reserva);
    setModalAberta(true);
  };
  const fecharModal = () => {
    setModalAberta(false);
    setReservaSelecionada(null);
  };

  const primeiroNome = user?.nomeCompleto?.split(' ')[0] || 'Usuário';

  // ✅ --- CORREÇÃO DEFINITIVA E ROBUSTA --- ✅
  const getThumbnailUrl = (reserva) => {
    const imagens = reserva?.pacoteViagem?.imagens;
    if (imagens && imagens.length > 0) {
      const primeiraImagem = imagens.find(midia => midia && midia.url && !midia.isVideo);
      if (primeiraImagem) {
        return `${API_BASE_URL}/${primeiraImagem.url}`;
      }
    }
    return placeholderImg;
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Olá, {primeiroNome}!</h1>
        <p className="text-md text-gray-500">Bem-vindo(a) ao seu painel. Aqui você gerencia suas viagens e avaliações.</p>
      </header>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" role="tablist" aria-label="Painel do Cliente">
          <button
            role="tab"
            aria-selected={activeTab === 'viagens'}
            onClick={() => setActiveTab('viagens')}
            className={`flex-shrink-0 py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'viagens' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Minhas Viagens
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'avaliacoes'}
            onClick={() => setActiveTab('avaliacoes')}
            className={`flex-shrink-0 py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'avaliacoes' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Minhas Avaliações
          </button>
        </nav>
      </div>

      {loading && <p role="status">Carregando...</p>}
      {error && <p className="text-red-500 p-4 bg-red-50 rounded-lg" role="alert">{error}</p>}

      <main>
        {!loading && !error && activeTab === 'viagens' && (
          <section role="tabpanel" aria-labelledby="tab-viagens">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Reservas Pendentes</h2>
            {reservasPendentes.length > 0 ? (
              reservasPendentes.map((reserva) => (
                <div key={reserva.id} className="bg-white rounded-xl shadow-md p-4 mb-4 flex items-center">
                  <img src={getThumbnailUrl(reserva)} alt={`Imagem do destino ${reserva?.pacoteViagem?.destino}`} className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover mr-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate">Viagem para {reserva?.pacoteViagem?.destino}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock size={14} className="mr-2 text-yellow-600" aria-hidden="true" />
                      <span>Aguardando Pagamento</span>
                    </div>
                  </div>
                  <button onClick={() => abrirModal(reserva)} className="ml-4 px-4 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 font-semibold flex-shrink-0">Ver Detalhes</button>
                </div>
              ))
            ) : <p className="text-gray-500">Nenhuma reserva pendente.</p>}

            <h2 className="text-xl font-semibold text-gray-700 mt-8 mb-4">Próximas Viagens</h2>
            {reservasConfirmadas.length > 0 ? (
               reservasConfirmadas.map((reserva) => (
                <div key={reserva.id} className="bg-white rounded-xl shadow-md p-4 mb-4 flex items-center">
                   <img src={getThumbnailUrl(reserva)} alt={`Imagem do destino ${reserva?.pacoteViagem?.destino}`} className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover mr-4 flex-shrink-0" />
                   <div className="flex-1 min-w-0">
                     <h3 className="font-bold text-lg truncate">Viagem para {reserva?.pacoteViagem?.destino}</h3>
                     <div className="flex items-center text-sm text-gray-500 mt-1">
                        <PlaneTakeoff size={14} className="mr-2 text-blue-600" aria-hidden="true" />
                        <span>Viagem Confirmada. Partida em {formatarData(reserva?.pacoteViagem?.dataInicio)}</span>
                     </div>
                   </div>
                   <button onClick={() => abrirModal(reserva)} className="ml-4 px-4 py-2 rounded-lg text-indigo-600 bg-white border border-indigo-600 hover:bg-indigo-50 font-semibold flex-shrink-0">Ver Detalhes</button>
                 </div>
               ))
            ) : <p className="text-gray-500">Nenhuma próxima viagem confirmada.</p>}

            <h2 className="text-xl font-semibold text-gray-700 mt-8 mb-4">Viagens Anteriores</h2>
            {reservasConcluidas.length > 0 ? (
              reservasConcluidas.map((reserva) => (
                <div key={reserva.id} className="bg-white rounded-xl shadow-md p-4 mb-4">
                  <div className="flex items-center mb-4">
                    <img src={getThumbnailUrl(reserva)} alt={`Imagem do destino ${reserva?.pacoteViagem?.destino}`} className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover mr-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg truncate">Viagem para {reserva?.pacoteViagem?.destino}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <ShieldCheck size={14} className="mr-2 text-green-600" aria-hidden="true" />
                        <span>Viagem Concluída em {formatarData(reserva?.pacoteViagem?.dataFim)}</span>
                      </div>
                    </div>
                    <button onClick={() => abrirModal(reserva)} className="ml-4 px-4 py-2 rounded-lg text-indigo-600 bg-white border border-indigo-600 hover:bg-indigo-50 font-semibold flex-shrink-0">Ver Detalhes</button>
                  </div>
                  {viagensParaAvaliar.some(p => p.id === reserva.id) && (
                    <AvaliacaoForm pacoteId={reserva.pacoteViagem.id} onAvaliacaoSubmit={fetchData} />
                  )}
                </div>
              ))
            ) : <p className="text-gray-500">Nenhuma viagem concluída.</p>}
          </section>
        )}
      </main>

      <div className="mt-12 p-4 bg-gray-100 rounded-lg text-center">
        <p className="text-sm text-gray-600">Precisa alterar seus dados? <a href="/suporte" className="font-semibold text-indigo-600 hover:underline">Fale com o suporte</a>.</p>
      </div>

      {modalAberta && <ModalDetalhesReservas reserva={reservaSelecionada} onClose={fecharModal} />}
    </div>
  );
}

const formatarData = (dataString) => {
  if (!dataString) return 'Data indisponível';
  try {
    const data = new Date(dataString);
    return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(data);
  } catch (error) {
    return 'Data inválida';
  }
};
