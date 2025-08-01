import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import reservaService from '../../services/reservaService.js';
import usuarioService from '../../services/usuarioService.js';
import pacoteService from '../../services/pacoteServices.js';

// --- Componentes de UI ---

// Componente para os cards de informação
const InfoCard = ({ title, children }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-xl font-bold text-[rgb(0,84,161)] border-b pb-2 mb-4">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
);

// Componente para as linhas de detalhe, agora com alinhamento
const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center text-gray-800 break-words">
    <span className="font-semibold text-gray-600">{label}:</span>
    <span className="text-right">{value}</span>
  </div>
);

// Componente reutilizável para os 'badges' de status
const StatusBadge = ({ status, children }) => {
  const statusClasses = {
    PENDENTE: 'bg-yellow-100 text-yellow-800',
    CONFIRMADO: 'bg-green-100 text-green-800',
    CONCLUIDA: 'bg-green-100 text-green-800',
    CANCELADO: 'bg-red-100 text-red-800',
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}
    >
      {children}
    </span>
  );
};

const DetalhesReservaGestao = () => {
  const { id } = useParams();
  const [reserva, setReserva] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [pacote, setPacote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Lógica completa para carregar todos os dados
  useEffect(() => {
    const carregarTudo = async () => {
      try {
        const dadosReserva = await reservaService.getReservaPorId(id);
        setReserva(dadosReserva);

        if (dadosReserva) {
          const [dadosCliente, dadosPacote] = await Promise.all([
            usuarioService.getUsuarioPorId(dadosReserva.usuario.id),
            pacoteService.getPacotePorId(dadosReserva.pacoteViagem.id),
          ]);
          setCliente(dadosCliente);
          setPacote(dadosPacote);
        } else {
          throw new Error('Reserva não encontrada.');
        }
      } catch (err) {
        setError('Falha ao carregar os detalhes. Verifique o console.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    carregarTudo();
  }, [id]);

  if (loading) return <div className="p-10 text-center text-gray-600">Carregando...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;
  if (!reserva) return <div className="p-10 text-center">Reserva não encontrada.</div>;

  // Funções de formatação
  const formatarValor = (valor) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  const formatarData = (dataString) => {
    if (!dataString) return 'Não informado';
    return new Date(dataString).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  };

  const valorUnitario =
    reserva.viajantes?.length > 0
      ? reserva.valorTotal / reserva.viajantes.length
      : reserva.valorTotal;

  // Mapeamento para o texto do status de pagamento
  const statusPagamentoTexto = {
    PENDENTE: 'Aguardando Pagamento',
    CONFIRMADO: 'Pagamento Aprovado',
    CONCLUIDA: 'Pagamento Aprovado',
    CANCELADO: 'Cancelado',
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Link to="/dashboard-atendente/reservas-recentes" className="text-blue-600 hover:underline">
          &larr; Voltar para Reservas Recentes
        </Link>
        <h2 className="text-3xl font-bold text-gray-800 mt-2">Gestão da Reserva #{reserva.id}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <InfoCard title="Detalhes Financeiros e do Pacote">
            <DetailRow label="Destino" value={pacote?.destino} />
            <DetailRow
              label="Status da Reserva"
              value={<StatusBadge status={reserva.status}>{reserva.status}</StatusBadge>}
            />
            <DetailRow
              label="Status do Pagamento"
              value={
                <StatusBadge status={reserva.status}>
                  {statusPagamentoTexto[reserva.status]}
                </StatusBadge>
              }
            />
            <DetailRow label="Data da Reserva" value={formatarData(reserva.data)} />
            <DetailRow
              label="Data de Finalização da Viagem"
              value={formatarData(pacote?.dataFim)}
            />
            <DetailRow label="Valor Total" value={formatarValor(reserva.valorTotal)} />
            <DetailRow label="Valor por Viajante" value={formatarValor(valorUnitario)} />
          </InfoCard>

          <InfoCard title="Viajantes da Reserva">
            {reserva.viajantes?.length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {reserva.viajantes.map((viajante, index) => (
                  <li key={index} className="text-gray-700">
                    <strong>{viajante.nome}</strong> (Documento: {viajante.documento || 'N/A'})
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum viajante informado.</p>
            )}
          </InfoCard>
        </div>

        <div className="lg:col-span-1">
          <InfoCard title="Informações do Cliente">
            <DetailRow label="Nome" value={cliente?.nomeCompleto} />
            <DetailRow label="Email" value={cliente?.email} />
            <DetailRow label="Telefone" value={cliente?.telefone} />
            <DetailRow label="Documento" value={cliente?.documento} />
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

export default DetalhesReservaGestao;
