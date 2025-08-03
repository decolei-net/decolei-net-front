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
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Título */}
      <h2 className="text-3xl font-bold text-gray-800">
        👤 Detalhes do Cliente
      </h2>

      {/* Informações do Cliente */}
      <div className="bg-white p-6 rounded-xl shadow space-y-3 border border-gray-200">
        <div className="text-lg text-gray-700">
          <p><span className="font-semibold">Nome:</span> {cliente.nomeCompleto}</p>
          <p><span className="font-semibold">E-mail:</span> {cliente.email}</p>
          <p><span className="font-semibold">CPF:</span> {cliente.documento}</p>
          <p><span className="font-semibold">Telefone:</span> {cliente.telefone}</p>
        </div>
      </div>

      {/* Histórico de Reservas */}
      <div>
        <h3 className="text-3xl font-bold text-gray-800">
          📑 Histórico de Reservas
        </h3>
        <div className="bg-white p-4 rounded-xl shadow border border-gray-200">
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
        </div>
      </div>
    </div>
  );
};

export default DetalhesClientes;
