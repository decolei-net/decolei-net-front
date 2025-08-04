import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  CreditCardIcon,
  UsersIcon,
  UserCircleIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import reservaService from '../../services/reservaService';
import usuarioService from '../../services/usuarioService';
import pacoteService from '../../services/pacoteServices';

const InfoCard = ({ title, icon, children }) => (
  <div className="bg-white p-6 rounded-xl shadow border border-gray-200">
    <div className="flex items-center gap-3 text-xl font-bold text-blue-800 border-b pb-2 mb-4">
      {icon && React.cloneElement(icon, { className: 'h-6 w-6' })}
      <h3>{title}</h3>
    </div>
    <div className="space-y-3">{children}</div>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between items-center text-gray-800 break-words">
    <span className="font-semibold text-gray-600">{label}:</span>
    <span className="text-right">{value}</span>
  </div>
);

const StatusBadge = ({ status, children }) => {
  const statusClasses = {
    PENDENTE: 'bg-yellow-100 text-yellow-800',
    CONFIRMADO: 'bg-green-100 text-green-800',
    CONCLUIDA: 'bg-green-100 text-green-800',
    CANCELADO: 'bg-red-100 text-red-800',
  };

  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusClasses[status] || 'bg-gray-100 text-gray-800'}`}>
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

  const statusPagamentoTexto = {
    PENDENTE: 'Aguardando Pagamento',
    CONFIRMADO: 'Pagamento Aprovado',
    CONCLUIDA: 'Pagamento Aprovado',
    CANCELADO: 'Cancelado',
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Título da Página */}
        <div className="flex items-center gap-3 text-3xl font-bold text-blue-900">
          <ClipboardDocumentCheckIcon className="h-8 w-8" />
          <h2>Gestão da Reserva #{reserva.id}</h2>
        </div>

        {/* Grid Principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda */}
          <div className="lg:col-span-2 space-y-6">
            <InfoCard title="Detalhes Financeiros e do Pacote" icon={<CreditCardIcon />}>
              <DetailRow label="Destino" value={pacote?.destino} />
              <DetailRow
                label="Status da Reserva"
                value={<StatusBadge status={reserva.status}>{reserva.status}</StatusBadge>}
              />
              <DetailRow
                label="Status do Pagamento"
                value={<StatusBadge status={reserva.status}>{statusPagamentoTexto[reserva.status]}</StatusBadge>}
              />
              <DetailRow label="Data da Reserva" value={formatarData(reserva.data)} />
              <DetailRow label="Data de Finalização da Viagem" value={formatarData(pacote?.dataFim)} />
              <DetailRow label="Valor Total" value={formatarValor(reserva.valorTotal)} />
              <DetailRow label="Valor por Viajante" value={formatarValor(valorUnitario)} />
            </InfoCard>

            <InfoCard title="Viajantes da Reserva" icon={<UsersIcon />}>
              {reserva.viajantes?.length > 0 ? (
                <ul className="list-disc list-inside space-y-2">
                  {reserva.viajantes.map((viajante, index) => (
                    <li key={index} className="text-gray-700">
                      <strong>{viajante.nome}</strong> (Documento: {viajante.documento || 'N/A'})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500">Nenhum viajante informado.</p>
              )}
            </InfoCard>
          </div>

          {/* Coluna Direita */}
          <div className="lg:col-span-1">
            <InfoCard title="Informações do Cliente" icon={<UserCircleIcon />}>
              <DetailRow label="Nome" value={cliente?.nomeCompleto} />
              <DetailRow label="Email" value={cliente?.email} />
              <DetailRow label="Telefone" value={cliente?.telefone} />
              <DetailRow label="Documento" value={cliente?.documento} />
            </InfoCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalhesReservaGestao;
