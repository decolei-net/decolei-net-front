// src/pages/Admin/AdminReservaList/AdminReservaList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import reservaService from '../../services/reservaService';

export default function AdminReservaList() {
    const [reservas, setReservas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Função para formatar a data
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    };

    // Função para definir a cor do badge com base no status
    const getStatusColor = (status) => {
        switch (status.toUpperCase()) {
            case 'CONFIRMADA':
                return 'bg-green-100 text-green-800';
            case 'PENDENTE':
                return 'bg-yellow-100 text-yellow-800';
            case 'CANCELADA':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    useEffect(() => {
        const fetchReservas = async () => {
            try {
                setIsLoading(true);
                // Chama o serviço sem nenhum parâmetro de filtro
                const data = await reservaService.getTodasReservas();
                setReservas(data);
            } catch (err) {
                console.error("Erro ao buscar reservas:", err);
                setError("Não foi possível carregar a lista de reservas.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchReservas();
    }, []); // O array de dependências está vazio, então a busca só ocorre uma vez.

    if (isLoading) {
        return <div className="text-center p-8">Carregando reservas...</div>;
    }

    if (error) {
        return <div className="text-center p-8 text-red-500">{error}</div>;
    }

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Gerenciar Reservas</h1>
            
            {reservas.length === 0 ? (
                <div className="text-center text-gray-500 p-8">Nenhuma reserva encontrada.</div>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Número da Reserva
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Cliente
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Pacote
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Data da Reserva
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {reservas.map(reserva => (
                                <tr key={reserva.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {reserva.numero}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {reserva.usuario?.nomeCompleto} ({reserva.usuario?.email})
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {reserva.pacoteViagem?.titulo}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(reserva.data)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(reserva.status)}`}>
                                            {reserva.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link to={`/dashboard-admin/reservas/${reserva.id}`} className="text-indigo-600 hover:text-indigo-900">
                                            Detalhes
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}