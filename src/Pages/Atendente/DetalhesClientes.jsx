import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import usuarioService from '../../services/usuarioService';
import reservaService from '../../services/reservaService';
import TabelaHistoricoReservas from '../../components/TabelaHistoricoReservas';

const DetalhesClientes = () => {
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const buscarDados = async () => {
      try {
        const dadosCliente = await usuarioService.getUsuarioPorId(id);
        setCliente(dadosCliente);

        const todasReservas = await reservaService.getTodasReservas();
        const reservasDoCliente = todasReservas.filter(
          (reserva) => reserva.usuario?.id == id
        );
        setReservas(reservasDoCliente);
      } catch (error) {
        console.error('Erro ao buscar detalhes do cliente:', error);
      } finally {
        setCarregando(false);
      }
    };

    buscarDados();
  }, [id]);

  if (carregando) {
    return (
      <div className="p-6 text-center text-blue-600 font-medium">
        Carregando dados do cliente...
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">
        Cliente não encontrado.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-8">
      {/* Título */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-blue-800 flex items-center gap-2">
          <span>👤</span> Detalhes do Cliente
        </h2>
        <p className="text-gray-500 text-sm sm:text-base">
          Informações pessoais e histórico de reservas
        </p>
      </div>

      {/* Informações do Cliente */}
      <div className="bg-white p-6 rounded-xl shadow space-y-3 border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-base sm:text-lg">
          <p><span className="font-semibold">Nome:</span> {cliente.nomeCompleto}</p>
          <p><span className="font-semibold">E-mail:</span> {cliente.email}</p>
          <p><span className="font-semibold">CPF:</span> {cliente.documento}</p>
          <p><span className="font-semibold">Telefone:</span> {cliente.telefone}</p>
        </div>
      </div>

      {/* Histórico de Reservas */}
      <div>
        <h3 className="text-2xl sm:text-3xl font-bold text-blue-800 flex items-center gap-2 mb-2">
          <span>📑</span> Histórico de Reservas
        </h3>

        {/* Tabela responsiva */}
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-200 overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 font-semibold text-gray-700">Pacote</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Datas</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Status Reserva</th>
                <th className="px-4 py-3 font-semibold text-gray-700">Status Pagamento</th>
              </tr>
            </thead>
            <TabelaHistoricoReservas
              reservas={reservas.map((reserva) => ({
                pacote: reserva.pacoteViagem?.destino || '—',
                dataInicio: reserva.pacoteViagem?.dataInicio
                  ? new Date(reserva.pacoteViagem.dataInicio).toLocaleDateString('pt-BR')
                  : '—',
                dataFim: reserva.pacoteViagem?.dataFim
                  ? new Date(reserva.pacoteViagem.dataFim).toLocaleDateString('pt-BR')
                  : '—',
                statusReserva: reserva.status || '—',
                statusPagamento: reserva.pagamento?.status || 'PENDENTE',
              }))}
            />
          </table>
        </div>
      </div>
    </div>
  );
};

export default DetalhesClientes;
