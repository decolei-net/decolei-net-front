import React, { useState, useEffect, useRef } from 'react';
import StatCard from '../../components/StatCard';
import DashboardBarChart from '../../components/DashboardBarChart';
import reservaService from '../../services/reservaService';
import usuarioService from '../../services/usuarioService';
import { FileDown } from 'lucide-react'; // Ícone para o botão de exportar
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function AdminDashboard() {
    // Estados que você já tinha
    const [stats, setStats] = useState({ vendas: 'R$ 0,00', reservas: 0, clientes: 0 });
    const [tripsByDestinationData, setTripsByDestinationData] = useState([]);
    const [popularPackagesData, setPopularPackagesData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Novos estados para a exportação de PDF
    const [isExporting, setIsExporting] = useState(false);
    const dashboardRef = useRef(null); // Referência para a área que será exportada

    useEffect(() => {
        // Sua função fetchDataAndProcess continua exatamente a mesma
        const fetchDataAndProcess = async () => {
            try {
                setLoading(true);
                setError(null);
                const [reservas, usuarios] = await Promise.all([
                    reservaService.getTodasReservas(),
                    usuarioService.getUsuarios(),
                ]);
                const umMesAtras = new Date();
                umMesAtras.setMonth(umMesAtras.getMonth() - 1);
                const reservasPendentes = reservas.filter(r => r.status?.toUpperCase() === 'PENDENTE').length;
                const totalClientes = usuarios.filter(u => u.perfil?.toUpperCase() === 'CLIENTE').length;
                const vendasMes = reservas
                    .filter(r => r.status?.toUpperCase() === 'CONFIRMADA' && new Date(r.data) > umMesAtras)
                    .reduce((total, r) => total + (r.valorTotal || 0), 0);
                const vendasFormatadas = vendasMes.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
                const viagensPorDestino = reservas
                    .filter(r => r.status?.toUpperCase() === 'CONFIRMADA')
                    .reduce((acc, reserva) => {
                        const destino = reserva.pacoteViagem?.destino || 'Desconhecido';
                        acc[destino] = (acc[destino] || 0) + 1;
                        return acc;
                    }, {});
                const formattedTripsData = Object.keys(viagensPorDestino).map(destino => ({
                    name: destino,
                    value: viagensPorDestino[destino]
                }));
                const top5Destinations = formattedTripsData.sort((a, b) => b.value - a.value).slice(0, 5);
                const pacotesReservados = reservas
                    .filter(r => r.status?.toUpperCase() === 'CONFIRMADA')
                    .reduce((acc, reserva) => {
                        const titulo = reserva.pacoteViagem?.titulo || 'Pacote Deletado';
                        acc[titulo] = (acc[titulo] || 0) + 1;
                        return acc;
                    }, {});
                const formattedPopularPackages = Object.keys(pacotesReservados).map(titulo => ({
                    name: titulo.length > 10 ? `${titulo.substring(0, 10)}...` : titulo,
                    value: pacotesReservados[titulo]
                }));
                const top5Packages = formattedPopularPackages.sort((a, b) => b.value - a.value).slice(0, 5);
                setStats({
                    reservas: reservasPendentes,
                    clientes: totalClientes,
                    vendas: vendasFormatadas
                });
                setTripsByDestinationData(top5Destinations);
                setPopularPackagesData(top5Packages);
            } catch (err) {
                setError("Não foi possível carregar os dados. Verifique a API.");
            } finally {
                setLoading(false);
            }
        };
        fetchDataAndProcess();
    }, []);

    // Função que lida com a exportação para PDF
    const handleExportPDF = async () => {
        setIsExporting(true);
        const input = dashboardRef.current;
        if (input) {
            try {
                const canvas = await html2canvas(input, { scale: 2 });
                const imgData = canvas.toDataURL('image/png');
                
                // Dimensões do PDF (A4 em modo paisagem para caber melhor)
                const pdf = new jsPDF('landscape', 'pt', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                
                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;
                const ratio = canvasWidth / canvasHeight;

                const imgWidth = pdfWidth;
                const imgHeight = pdfWidth / ratio;

                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                pdf.save(`decolei-dashboard-${new Date().toLocaleDateString('pt-BR')}.pdf`);
            } catch (err) {
                console.error("Erro ao gerar o PDF:", err);
                alert("Ocorreu um erro ao tentar exportar o PDF.");
            }
        }
        setIsExporting(false);
    };

    if (loading) {
        return <div className="text-center p-10 font-semibold text-gray-600">Carregando dados do painel...</div>;
    }

    if (error) {
        return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">{error}</div>;
    }

    return (
        <div>
            {/* Cabeçalho com o novo botão */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-blue-900">Painel de Controle</h1>
                <button 
                    onClick={handleExportPDF}
                    disabled={isExporting}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:bg-blue-300 disabled:cursor-wait"
                >
                    <FileDown size={20} />
                    {isExporting ? 'Exportando...' : 'Exportar PDF'}
                </button>
            </div>

            {/* O "ref" é adicionado aqui para marcar a área a ser exportada */}
            <div ref={dashboardRef} className="space-y-6 bg-gray-50 p-1">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <StatCard title="Vendas (Último Mês)" value={stats.vendas} />
                    <StatCard title="Reservas Pendentes" value={stats.reservas} />
                    <StatCard title="Total de Clientes" value={stats.clientes} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <DashboardBarChart title="Top 5 Destinos Mais Visitados" data={tripsByDestinationData} />
                    <DashboardBarChart title="Top 5 Pacotes Mais Reservados" data={popularPackagesData} />
                </div>
            </div>
        </div>
    );
}