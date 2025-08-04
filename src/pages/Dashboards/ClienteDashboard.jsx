import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import reservaService from '../../services/reservaService';
import avaliacoesService from '../../services/avaliacoesServices';
import ModalDetalhesReservas from '../../components/ModalDetalhesReservas.jsx';
import StarRating from '../../components/StarRating.jsx';

// -- HELPER PARA FORMATAR DATA --
const formatarData = (dataString) => {
  if (!dataString) return 'Data indisponível';
  try {
    const data = new Date(dataString);
    return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(data);
  } catch (error) {
    return 'Data inválida';
  }
};

export default function ClienteDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [reservas, setReservas] = useState([]);
  const [loadingReservas, setLoadingReservas] = useState(true);
  const [activeTab, setActiveTab] = useState('viagens');
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loadingAvaliacoes, setLoadingAvaliacoes] = useState(false);
  const [modalAberta, setModalAberta] = useState(false);
  const [reservaSelecionada, setReservaSelecionada] = useState(null);
  const [reservasError, setReservasError] = useState(null);
  const [avaliacoesError, setAvaliacoesError] = useState(null);

  const abrirModal = (reserva) => {
    setReservaSelecionada(reserva);
    setModalAberta(true);
  };

  const fecharModal = () => {
    setModalAberta(false);
    setReservaSelecionada(null);
  };

  useEffect(() => {
    let isSubscribed = true;

    const fetchReservas = async () => {
      setLoadingReservas(true);
      setReservasError(null);
      try {
        const dadosDaApi = await reservaService.getMinhasReservas();
        if (isSubscribed) {
          setReservas(Array.isArray(dadosDaApi) ? dadosDaApi : []);
        }
      } catch (error) {
        if (isSubscribed) {
          console.error('Falha ao buscar reservas:', error);
          setReservasError('Não foi possível carregar suas reservas. Tente novamente mais tarde.');
          setReservas([]);
        }
      } finally {
        if (isSubscribed) {
          setLoadingReservas(false);
        }
      }
    };

    if (activeTab === 'viagens') {
      fetchReservas();
    }

    return () => {
      isSubscribed = false;
    };
  }, [activeTab]);

  useEffect(() => {
    let isSubscribed = true;
    const fetchAvaliacoes = async () => {
      if (activeTab === 'avaliacoes') {
        setLoadingAvaliacoes(true);
        setAvaliacoesError(null);
        try {
          const dadosDaApi = await avaliacoesService.getMinhasAvaliacoes();
          if (isSubscribed) {
            setAvaliacoes(Array.isArray(dadosDaApi) ? dadosDaApi : []);
          }
        } catch (error) {
          if (isSubscribed) {
            console.error('Falha ao buscar avaliações:', error);
            setAvaliacoesError('Não foi possível carregar suas avaliações. Tente novamente mais tarde.');
            setAvaliacoes([]);
          }
        } finally {
          if (isSubscribed) {
            setLoadingAvaliacoes(false);
          }
        }
      }
    };
    fetchAvaliacoes();
    return () => {
      isSubscribed = false;
    };
  }, [activeTab]);

  const reservasPendentes = useMemo(
    () => reservas.filter((r) => r?.status === 'PENDENTE'),
    [reservas]
  );

  const reservasConcluidas = useMemo(
    () => reservas.filter((r) => r?.status === 'CONCLUIDA' || r?.status === 'CONFIRMADA'),
    [reservas]
  );

  const primeiroNome = user?.nomeCompleto?.split(' ')[0] || 'Usuário';

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Olá, {primeiroNome}!</h1>
        <p className="text-md text-gray-500">
          Bem-vindo(a) ao seu painel. Aqui você gerencia suas viagens e avaliações.
        </p>
      </header>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('viagens')}
            className={`flex-shrink-0 py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'viagens'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Minhas Viagens
          </button>
          <button
            onClick={() => setActiveTab('avaliacoes')}
            className={`flex-shrink-0 py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'avaliacoes'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Minhas Avaliações
          </button>
        </nav>
      </div>

      {activeTab === 'viagens' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Reservas Pendentes</h2>
          {loadingReservas && <p>Carregando reservas...</p>}
          {reservasError && <p className="text-red-500 p-4 bg-red-50 rounded-lg">{reservasError}</p>}
          {!loadingReservas && !reservasError && (
            reservasPendentes.length > 0 ? (
              reservasPendentes.map((reserva) => (
                <div key={reserva.id} className="bg-white rounded-xl shadow-md p-5 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="font-bold text-lg truncate">Viagem para {reserva?.pacoteViagem?.destino || 'Destino não informado'}</h3>
                    <p className="text-sm text-gray-500">Data da Reserva: {formatarData(reserva?.data)}</p>
                    <span className="mt-2 inline-block px-3 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">Pendente</span>
                  </div>
                  <button onClick={() => abrirModal(reserva)} className="mt-4 sm:mt-0 px-5 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 font-semibold flex-shrink-0">Ver Detalhes</button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Nenhuma reserva pendente encontrada.</p>
            )
          )}

          <h2 className="text-xl font-semibold text-gray-700 mt-8 mb-4">Reservas Anteriores</h2>
          {loadingReservas && <p>Carregando reservas...</p>}
          {reservasError && <p className="text-red-500 p-4 bg-red-50 rounded-lg">{reservasError}</p>}
          {!loadingReservas && !reservasError && (
            reservasConcluidas.length > 0 ? (
              reservasConcluidas.map((reserva) => (
                <div key={reserva.id} className="bg-white rounded-xl shadow-md p-5 mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 min-w-0 pr-4">
                    <h3 className="font-bold text-lg truncate">Viagem para {reserva?.pacoteViagem?.destino || 'Destino não informado'}</h3>
                    <p className="text-sm text-gray-500">Data da Reserva: {formatarData(reserva?.data)}</p>
                    <span className={`mt-2 inline-block px-3 py-1 text-xs font-semibold ${reserva.status === 'CONFIRMADA' ? 'text-blue-800 bg-blue-200' : 'text-green-800 bg-green-200'} rounded-full`}>
                      {reserva.status === 'CONFIRMADA' ? 'Confirmada' : 'Concluída'}
                    </span>
                  </div>
                  <button onClick={() => abrirModal(reserva)} className="mt-4 sm:mt-0 px-5 py-2 rounded-lg text-indigo-600 bg-white border border-indigo-600 hover:bg-indigo-50 font-semibold flex-shrink-0">Ver Detalhes</button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Nenhuma reserva anterior encontrada.</p>
            )
          )}
        </div>
      )}

      {activeTab === 'avaliacoes' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Minhas Avaliações Publicadas</h2>
          {loadingAvaliacoes && <p>Carregando avaliações...</p>}
          {avaliacoesError && <p className="text-red-500 p-4 bg-red-50 rounded-lg">{avaliacoesError}</p>}
          {!loadingAvaliacoes && !avaliacoesError && (
            avaliacoes.length > 0 ? (
              <div className="space-y-4">
                {avaliacoes.map((avaliacao) => (
                  <div key={avaliacao.id} className="bg-white rounded-xl shadow-md p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-500">Avaliação para:</p>
                        <h3 className="font-bold text-lg text-gray-800 truncate">{avaliacao?.pacote?.destino || 'Destino não informado'}</h3>
                      </div>
                      <div className="text-right">
                        <StarRating rating={avaliacao.nota} />
                        <p className="text-xs text-gray-400 mt-1">em {formatarData(avaliacao.dataCriacao)}</p>
                      </div>
                    </div>
                    <p className="mt-4 text-gray-600 italic">"{avaliacao.comentario}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Você ainda não fez nenhuma avaliação.</p>
            )
          )}
        </div>
      )}

      <div className="mt-12 p-4 bg-gray-100 rounded-lg text-center">
        <p className="text-sm text-gray-600">
          Caso queira alterar seus dados cadastrais, por favor,{' '}
          <a href="/suporte" className="font-semibold text-indigo-600 hover:underline">
            entre em contato com o suporte
          </a>
          .
        </p>
      </div>

      {modalAberta && <ModalDetalhesReservas reserva={reservaSelecionada} onClose={fecharModal} />}
    </div>
  );
}
