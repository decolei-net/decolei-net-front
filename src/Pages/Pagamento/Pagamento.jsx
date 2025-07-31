import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CreditCard, Landmark, QrCode } from 'lucide-react';
import pagamentoService from '../../services/pagamentoService';
import reservaService from '../../services/reservaService';

export default function Pagamento() {
    const { reservaId } = useParams();
    const navigate = useNavigate();
    // Pega o objeto user completo do estado de autenticação
    const { user } = useSelector(state => state.auth);

    const [reserva, setReserva] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Preenche o nome do formulário com o nome do usuário logado
    const [nomeCompleto, setNomeCompleto] = useState(user?.nomeCompleto || '');
    const [metodo, setMetodo] = useState('Credito');
    const [cpf, setCpf] = useState('');
    const [numeroCartao, setNumeroCartao] = useState('');
    const [parcelas, setParcelas] = useState(1);

    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const fetchReserva = async () => {
            try {
                const dadosReserva = await reservaService.getReservaPorId(Number(reservaId));
                setReserva(dadosReserva);
            } catch (err) {
                setError("Não foi possível carregar os detalhes da sua reserva.");
            } finally {
                setLoading(false);
            }
        };
        fetchReserva();
    }, [reservaId]);

    const handlePagamento = async (e) => {
        e.preventDefault();
        setIsProcessing(true);
        setError('');

        const dadosPagamento = {
            reservaId: Number(reservaId),
            nomeCompleto,
            cpf,
            // ✅ Agora user.email terá o valor correto, vindo do novo objeto salvo no localStorage
            email: user?.email,
            metodo,
            valor: reserva.valorTotal,
            numeroCartao: metodo === 'Credito' ? numeroCartao : '',
            parcelas: metodo === 'Credito' ? parcelas : 1,
        };

        try {
            await pagamentoService.criarPagamento(dadosPagamento);
            alert("Pagamento processado com sucesso! Sua viagem está confirmada.");
            navigate('/home');
        } catch (err) {
            console.error("Erro ao processar pagamento:", err);
            const apiError = err.response?.data;
            const errorMessage = apiError?.errors ? Object.values(apiError.errors).flat().join(' ') : apiError?.erro || "Não foi possível processar o pagamento.";
            setError(errorMessage);
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) return <div className="text-center p-10 font-bold">Carregando checkout...</div>;

    if (error && !reserva) return <div className="text-center p-10 text-red-500 font-bold">{error}</div>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-8">Finalizar Pagamento</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Coluna Esquerda: Formulário de Pagamento */}
                <form onSubmit={handlePagamento} className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-xl font-bold mb-6">Informações do Pagador</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
                            <input type="text" value={nomeCompleto} onChange={e => setNomeCompleto(e.target.value)} required className="mt-1 w-full p-2 border rounded-md"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">CPF</label>
                            <input type="text" value={cpf} onChange={e => setCpf(e.target.value)} required placeholder="000.000.000-00" className="mt-1 w-full p-2 border rounded-md"/>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold mb-6">Método de Pagamento</h2>
                    <div className="space-y-4 mb-6">
                        {/* Opções de pagamento */}
                        {['Credito', 'Boleto', 'Pix'].map(m => (
                            <div key={m} onClick={() => setMetodo(m)} className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${metodo === m ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500' : 'hover:bg-gray-50'}`}>
                                {m === 'Credito' && <CreditCard className="mr-4 text-blue-600"/>}
                                {m === 'Boleto' && <Landmark className="mr-4 text-blue-600"/>}
                                {m === 'Pix' && <QrCode className="mr-4 text-blue-600"/>}
                                <span className="font-semibold">{m === 'Credito' ? 'Cartão de Crédito' : m}</span>
                            </div>
                        ))}
                    </div>

                    {/* Campos de Cartão de Crédito */}
                    {metodo === 'Credito' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 animate-fade-in">
                             <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Número do Cartão</label>
                                <input type="text" value={numeroCartao} onChange={e => setNumeroCartao(e.target.value)} required placeholder="0000 0000 0000 0000" className="mt-1 w-full p-2 border rounded-md"/>
                             </div>
                             <div>
                                <label className="block text-sm font-medium text-gray-700">Parcelas</label>
                                <select value={parcelas} onChange={e => setParcelas(Number(e.target.value))} className="mt-1 w-full p-2 border rounded-md">
                                    {[1,2,3,4,5,6,7,8,9,10,11,12].map(p => <option key={p} value={p}>{p}x de R$ {(reserva?.valorTotal / p).toFixed(2).replace('.', ',')}</option>)}
                                </select>
                             </div>
                        </div>
                    )}

                    {error && <p className="text-red-600 text-center my-4">{error}</p>}

                    <button type="submit" disabled={isProcessing} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg text-lg hover:bg-green-700 transition disabled:bg-green-300">
                        {isProcessing ? 'Processando...' : `Pagar R$ ${reserva?.valorTotal.toFixed(2).replace('.', ',')}`}
                    </button>
                </form>

                {/* Coluna Direita: Resumo da Reserva */}
                <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md sticky top-6">
                    <h2 className="text-xl font-bold mb-4 border-b pb-4">Resumo da Compra</h2>
                    {reserva && (
                        <>
                            <h3 className="font-semibold text-gray-800">{reserva.pacoteViagem.titulo}</h3>
                            <p className="text-sm text-gray-500">{new Date(reserva.data).toLocaleDateString('pt-BR')}</p>
                            <div className="flex justify-between font-bold text-lg border-t pt-4 mt-4">
                                <span>Total a Pagar</span>
                                <span>R$ {reserva.valorTotal.toFixed(2).replace('.', ',')}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
