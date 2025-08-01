import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import usuarioService from '../../services/usuarioService';
import reservaService from '../../services/reservaService';
import TabelaHistoricoReservas from '../../components/TabelaHistoricoReservas';

const DetalhesCliente = () => {
  const { id } = useParams();
  const [cliente, setCliente] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
  console.log("ID recebido na rota:", id);

  const buscarDados = async () => {
    try {
      const dadosCliente = await usuarioService.getUsuarioPorId(id);
      console.log("Dados do cliente retornado:", dadosCliente); // <= veja isso no console
      const dadosReservas = await reservaService.listarReservasPorUsuario(id);
      setCliente(dadosCliente);
      setReservas(dadosReservas);
    } catch (error) {
      console.error('Erro ao buscar detalhes do cliente:', error);
    } finally {
      setCarregando(false);
    }
  };

  buscarDados();
  }, [id]);

  if (carregando) return <p className="p-4">Carregando dados do cliente...</p>;
  if (!cliente) return <p className="text-red-500 p-4">Cliente não encontrado.</p>;

  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-[rgb(0,84,161)]">👤 Detalhes do Cliente</h2>
      
      <div className="bg-gray-100 p-4 rounded mb-6">
        <p><strong>Nome:</strong> {cliente.nomeCompleto}</p>
        <p><strong>E-mail:</strong> {cliente.email}</p>
        <p><strong>CPF:</strong> {cliente.documento}</p>
        <p><strong>Telefone:</strong> {cliente.telefone}</p>
      </div>

      <h3 className="text-2xl font-semibold mb-4 text-[rgb(0,84,161)]">📑 Histórico de Reservas</h3>
      <TabelaHistoricoReservas
        reservas={reservas.map((reserva) => ({
          pacote: reserva.pacoteViagem?.destino || '—',
          dataInicio: reserva.pacoteViagem?.dataInicio?.split('T')[0] || '—',
          dataFim: reserva.pacoteViagem?.dataFim?.split('T')[0] || '—',
          statusReserva: reserva.status || '—',
          statusPagamento: reserva.pagamento?.status || 'PENDENTE'
        }))}
      />
    </div>
  );
};

export default DetalhesCliente;
