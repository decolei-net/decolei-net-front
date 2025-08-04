import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CreditCard, Landmark, QrCode } from 'lucide-react';
import pagamentoService from '../../services/pagamentoService';
import reservaService from '../../services/reservaService';
import PixPayment from '../../components/PixPayment';

const formatarCpf = (value) => {
  const valorNumerico = value.replace(/\D/g, '').slice(0, 11);
  return valorNumerico
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

const formatarNumeroCartao = (value) => {
  const valorNumerico = value.replace(/\D/g, '').slice(0, 16);
  return valorNumerico.replace(/(\d{4})(?=\d)/g, '$1 ');
};


export default function Pagamento() {
    const { reservaId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);

    const [reserva, setReserva] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [metodo, setMetodo] = useState('Credito');
    const [nomeCompleto, setNomeCompleto] = useState(user?.nomeCompleto || '');
    const [cpf, setCpf] = useState('');
    const [numeroCartao, setNumeroCartao] = useState('');
    const [parcelas, setParcelas] = useState(1);
    const [cvv, setCvv] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!reservaId) return;
        setLoading(true);
        reservaService.getReservaPorId(Number(reservaId))
            .then(dadosReserva => {
              if (dadosReserva.usuario.id !== Number(user.id) && user.role !== 'ADMIN') {
                  navigate('/unauthorized'); return;
              }
              if (dadosReserva.status !== 'PENDENTE') {
                  setError("Esta reserva não está mais disponível para pagamento.");
              }
              setReserva(dadosReserva);
            })
            .catch(() => setError("Reserva não encontrada."))
            .finally(() => setLoading(false));
    }, [reservaId, user.id, navigate]);

    const handleFinalizarCompra = async () => {
        setIsProcessing(true);
        setError('');
        const dadosPagamento = {
            ReservaId: Number(reservaId),
            NomeCompleto: nomeCompleto,
            Cpf: cpf.replace(/\D/g, ''),
            Email: user.email,
            Metodo: metodo, // 'Credito', 'Debito', 'Boleto', 'Pix'
            Valor: reserva.valorTotal,
            NumeroCartao: (metodo === 'Credito' || metodo === 'Debito') ? numeroCartao.replace(/\D/g, '') : '',
            Parcelas: metodo === 'Credito' ? parcelas : 1,
        };

        console.log("Enviando para a API:", dadosPagamento);
        try {
            await pagamentoService.criarPagamento(dadosPagamento);
            alert("Pagamento realizado com sucesso!");
            navigate('/minha-conta');
        } catch (err) {
            setError(err.response?.data?.erro || "Não foi possível processar o pagamento.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSubmitForm = (e) => { e.preventDefault(); handleFinalizarCompra(); };

    let botaoPagarTexto = `Pagar R$ ${reserva?.valorTotal.toFixed(2).replace('.', ',')}`;
    if (metodo === 'Boleto') botaoPagarTexto = 'Gerar e Enviar Boleto por Email';

    if (loading) return <div className="text-center p-10 font-bold">Carregando...</div>;

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">Finalizar Pagamento</h1>

            {error && !reserva && <div className="text-center p-10 text-red-500 font-bold">{error}</div>}

            {reserva && (
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
                    <div className="border-b pb-6 mb-6">
                        <div className='flex justify-between items-center mb-2'>
                            <h2 className="text-2xl font-bold text-blue-600">{reserva.pacoteViagem.titulo}</h2>
                            <span className='text-sm font-medium bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full'>
                                {reserva.status}
                            </span>
                        </div>
                        <div className="text-sm text-gray-500 space-y-1">
                            <p><strong>Viajantes:</strong> {reserva.viajantes.length + 1}</p>
                            <p><strong>Valor Total:</strong>
                                <span className='font-bold text-base text-gray-800 ml-1'>
                                    R$ {reserva.valorTotal.toFixed(2).replace('.', ',')}
                                </span>
                            </p>
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                    <fieldset disabled={reserva.status !== 'PENDENTE'}>
                        <h3 className="text-xl font-bold mb-4">Escolha o Método de Pagamento</h3>
                        <div className="space-y-4 mb-8">
                            {['Credito', 'Debito', 'Boleto', 'Pix'].map(m => (
                                <div key={m} onClick={() => setMetodo(m)} className={`flex items-center p-4 border rounded-lg cursor-pointer transition ${metodo === m ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500' : 'hover:bg-gray-50'}`}>
                                    {(m === 'Credito' || m === 'Debito') && <CreditCard className="mr-4 text-blue-600"/>}
                                    {m === 'Boleto' && <Landmark className="mr-4 text-blue-600"/>}
                                    {m === 'Pix' && <QrCode className="mr-4 text-blue-600"/>}
                                    <span className="font-semibold">{m === 'Credito' ? 'Cartão de Crédito' : (m === 'Debito' ? 'Cartão de Débito' : m)}</span>
                                </div>
                            ))}
                        </div>

                        {metodo === 'Pix' && (
                            <form onSubmit={handleSubmitForm} className="animate-fade-in">
                                <h3 className="text-xl font-bold mb-4">Informações do Pagador</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <input
                                      value={nomeCompleto}
                                      onChange={e => setNomeCompleto(e.target.value)}
                                      required
                                      placeholder="Nome Completo"
                                      className="p-3 border rounded-md"
                                    />
                                    <input
                                      value={cpf}
                                      onChange={e => setCpf(formatarCpf(e.target.value))}
                                      required
                                      placeholder="CPF do titular"
                                      className="p-3 border rounded-md"
                                      maxLength="14"
                                    />
                                </div>
                                <PixPayment onConfirm={handleFinalizarCompra} isProcessing={isProcessing}/>
                            </form>
                        )}

                        {(metodo === 'Credito' || metodo === 'Debito' || metodo === 'Boleto') && (
                            <form onSubmit={handleSubmitForm} className="animate-fade-in">
                                <h3 className="text-xl font-bold mb-4">Informações do Pagador</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <input
                                      value={nomeCompleto}
                                      onChange={e => setNomeCompleto(e.target.value)}
                                      required
                                      placeholder="Nome Completo"
                                      className="p-3 border rounded-md"
                                    />
                                    <input
                                      value={cpf}
                                      onChange={e => setCpf(formatarCpf(e.target.value))}
                                      required
                                      placeholder="CPF do titular"
                                      className="p-3 border rounded-md"
                                      maxLength="14"
                                    />
                                </div>

                                {(metodo === 'Credito' || metodo === 'Debito') && (
                                   <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
                                        <input
                                          value={numeroCartao}
                                          onChange={e => setNumeroCartao(formatarNumeroCartao(e.target.value))}
                                          required
                                          placeholder="Número do Cartão"
                                          className="sm:col-span-4 p-3 border rounded-md"
                                          maxLength="19"
                                        />

                                        <input
                                            value={cvv}
                                            onChange={e => setCvv(formatarCvv(e.target.value))}
                                            required
                                            placeholder="CVV"
                                            className="sm:col-span-1 p-3 border rounded-md"
                                            maxLength="4"
                                        />

                                        {metodo === 'Credito' && (
                                            <select
                                              value={parcelas}
                                              onChange={e => setParcelas(Number(e.target.value))}
                                              className="sm:col-span-3 p-3 border rounded-md bg-white"
                                            >
                                                {[...Array(12).keys()].map(p => <option key={p+1} value={p+1}>{p+1}x de R$ {(reserva.valorTotal / (p+1)).toFixed(2).replace('.', ',')}</option>)}
                                            </select>
                                        )}
                                   </div>
                                )}

                                <button type="submit" disabled={isProcessing} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg text-lg hover:bg-green-700 transition disabled:bg-green-300">{isProcessing ? 'Processando...' : botaoPagarTexto}</button>
                            </form>
                        )}
                    </fieldset>
                </div>
            )}
        </div>
    );
}
