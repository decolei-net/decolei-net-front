import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import reservaService from '../../services/reservaService';
import avaliacoesService from '../../services/avaliacoesServices';
import ModalDetalhesReservas from '../../components/ModalDetalhesReservas.jsx'; // 1. IMPORTAÇÃO DO MODAL

// -- COMPONENTE DE HELPER PARA FORMATAR DATA --
const formatarData = (dataString) => {
  if (!dataString) return 'Data indisponível';
  try {
    const data = new Date(dataString);
    // Ajuste para o fuso horário local, somando um dia para evitar o problema de "um dia a menos"
    data.setDate(data.getDate() + 1);
    return new Intl.DateTimeFormat('pt-BR').format(data);
  } catch (error) {
    return 'Data inválida';
  }
};

// -- COMPONENTE PARA RENDERIZAR AS ESTRELAS DA AVALIAÇÃO --
const RatingStars = ({ nota }) => {
  const totalStars = 5;
  const stars = Array.from({ length: totalStars }, (_, i) => i < nota);
  return (
    <div className="flex items-center">
      {stars.map((isFilled, index) => (
        <svg
          key={index}
          className={`w-5 h-5 ${isFilled ? 'text-yellow-400' : 'text-gray-300'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
};

export default function ClienteDashboard() {
  const { user } = useSelector((state) => state.auth);
  const [reservas, setReservas] = useState([]);
  const [loadingReservas, setLoadingReservas] = useState(true);
  const [activeTab, setActiveTab] = useState('viagens');
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loadingAvaliacoes, setLoadingAvaliacoes] = useState(false);

  // 2. ESTADOS PARA CONTROLAR O MODAL
  const [modalAberta, setModalAberta] = useState(false);
  const [reservaSelecionada, setReservaSelecionada] = useState(null);

  // 3. FUNÇÕES PARA ABRIR E FECHAR O MODAL
  const abrirModal = (reserva) => {
    setReservaSelecionada(reserva);
    setModalAberta(true);
  };

  const fecharModal = () => {
    setModalAberta(false);
    setReservaSelecionada(null);
  };

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        setLoadingReservas(true);
        const dadosDaApi = await reservaService.getMinhasReservas();
        if (dadosDaApi && Array.isArray(dadosDaApi)) {
          setReservas(dadosDaApi);
        } else {
          setReservas([]);
        }
      } catch (error) {
        console.error('Falha ao buscar reservas:', error);
        setReservas([]);
      } finally {
        setLoadingReservas(false);
      }
    };
    fetchReservas();
  }, []);

  useEffect(() => {
    const fetchAvaliacoes = async () => {
      if (activeTab !== 'avaliacoes' || avaliacoes.length > 0) return;
      try {
        setLoadingAvaliacoes(true);
        const dadosDaApi = await avaliacoesService.getMinhasAvaliacoes();
        if (dadosDaApi && Array.isArray(dadosDaApi)) {
          setAvaliacoes(dadosDaApi);
        } else {
          setAvaliacoes([]);
        }
      } catch (error) {
        console.error('Falha ao buscar avaliações:', error);
        setAvaliacoes([]);
      } finally {
        setLoadingAvaliacoes(false);
      }
    };
    fetchAvaliacoes();
  }, [activeTab, avaliacoes.length]);

  const reservasPendentes = reservas.filter((r) => r?.status === 'PENDENTE');
  const reservasConcluidas = reservas.filter(
    (r) => r?.status === 'CONCLUIDA' || r?.status === 'CONFIRMADO',
  );

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Olá, {user?.nome?.split(' ')[0] || 'Usuário'}!
        </h1>
        <p className="text-md text-gray-500">
          Bem-vindo(a) ao seu painel. Aqui você gerencia suas viagens e avaliações.
        </p>
      </header>

      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          <button
            onClick={() => setActiveTab('viagens')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'viagens' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Minhas Viagens
          </button>
          <button
            onClick={() => setActiveTab('avaliacoes')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'avaliacoes' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Minhas Avaliações
          </button>
          <button
            onClick={() => setActiveTab('configuracoes')}
            className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'configuracoes' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Configurações
          </button>
        </nav>
      </div>

      {activeTab === 'viagens' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Reservas Pendentes</h2>
          {loadingReservas ? (
            <p>Carregando...</p>
          ) : reservasPendentes.length > 0 ? (
            reservasPendentes.map((reserva) => (
              <div
                key={reserva.id}
                className="bg-white rounded-xl shadow-md p-5 mb-4 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-lg bg-gray-200 mr-4 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-bold text-lg">
                      Viagem para {reserva?.pacoteViagem?.destino || 'Destino não informado'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Data da Reserva: {formatarData(reserva?.data)}
                    </p>
                    <span className="mt-2 inline-block px-3 py-1 text-xs font-semibold text-yellow-800 bg-yellow-200 rounded-full">
                      Pendente
                    </span>
                  </div>
                </div>
                {/* 4. BOTÃO PARA ABRIR O MODAL */}
                <button
                  onClick={() => abrirModal(reserva)}
                  className="px-5 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 font-semibold"
                >
                  Ver Detalhes
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Nenhuma reserva pendente encontrada.</p>
          )}

          <h2 className="text-xl font-semibold text-gray-700 mt-8 mb-4">Reservas Concluídas</h2>
          {loadingReservas ? (
            <p>Carregando...</p>
          ) : reservasConcluidas.length > 0 ? (
            reservasConcluidas.map((reserva) => (
              <div
                key={reserva.id}
                className="bg-white rounded-xl shadow-md p-5 mb-4 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <div className="w-16 h-16 rounded-lg bg-gray-200 mr-4 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-bold text-lg">
                      Viagem para {reserva?.pacoteViagem?.destino || 'Destino não informado'}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Data da Reserva: {formatarData(reserva?.data)}
                    </p>
                    <span className="mt-2 inline-block px-3 py-1 text-xs font-semibold text-green-800 bg-green-200 rounded-full">
                      Concluída
                    </span>
                  </div>
                </div>
                <button className="px-5 py-2 rounded-lg text-indigo-600 bg-white border border-indigo-600 hover:bg-indigo-50 font-semibold">
                  Avaliar Viagem
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Nenhuma reserva concluída encontrada.</p>
          )}
        </div>
      )}

      {activeTab === 'avaliacoes' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Minhas Avaliações Publicadas</h2>
          {loadingAvaliacoes ? (
            <p>Carregando avaliações...</p>
          ) : avaliacoes.length > 0 ? (
            <div className="space-y-4">
              {avaliacoes.map((avaliacao) => (
                <div key={avaliacao.id} className="bg-white rounded-xl shadow-md p-5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500">Avaliação para:</p>
                      <h3 className="font-bold text-lg text-gray-800">
                        {avaliacao?.pacote?.destino || 'Destino não informado'}
                      </h3>
                    </div>
                    <div className="text-right">
                      <RatingStars nota={avaliacao.nota} />
                      <p className="text-xs text-gray-400 mt-1">
                        em {formatarData(avaliacao.dataCriacao)}
                      </p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600 italic">"{avaliacao.comentario}"</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Você ainda não fez nenhuma avaliação.</p>
          )}
        </div>
      )}

      {activeTab === 'configuracoes' && (
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Configurações da Conta</h2>
          <p className="text-gray-500">Em construção...</p>
        </div>
      )}

      {/* 5. RENDERIZAÇÃO CONDICIONAL DO MODAL */}
      {modalAberta && <ModalDetalhesReservas reserva={reservaSelecionada} onClose={fecharModal} />}
    </div>
  );
}
