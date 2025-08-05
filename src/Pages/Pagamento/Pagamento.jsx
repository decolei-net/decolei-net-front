import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CreditCard, Landmark, QrCode } from 'lucide-react';
import pagamentoService from '../../services/pagamentoService';
import reservaService from '../../services/reservaService';
import PixPayment from '../../components/PixPayment';

// --- FUNÇÕES AUXILIARES PARA FORMATAÇÃO (MÁSCARAS) ---
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

const formatarCvv = (value) => {
  return value.replace(/\D/g, '').slice(0, 4);
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
    if ((metodo !== 'Pix') && !cpf.trim()) {
      setError("O CPF é obrigatório para este método de pagamento.");
      return;
    }

    setIsProcessing(true);
    setError('');
    const dadosPagamento = {
      ReservaId: Number(reservaId),
      NomeCompleto: nomeCompleto,
      Cpf: cpf.replace(/\D/g, ''),
      Email: user.email,
      Metodo: metodo,
      Valor: reserva.valorTotal,
      NumeroCartao: (metodo === 'Credito' || metodo === 'Debito') ? numeroCartao.replace(/\D/g, '') : '',
      Parcelas: metodo === 'Credito' ? parcelas : 1,
    };
    try {
      await pagamentoService.criarPagamento(dadosPagamento);
      alert("Pagamento realizado com sucesso!");
      navigate('/minha-conta');
    } catch (err) {
      console.error("Erro na API de pagamento:", err.response);
      setError(err.response?.data?.erro || "Não foi possível processar o pagamento.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmitForm = (e) => { e.preventDefault(); handleFinalizarCompra(); };

  let botaoPagarTexto = `Pagar R$ ${reserva?.valorTotal.toFixed(2).replace('.', ',')}`;
  if (metodo === 'Boleto') botaoPagarTexto = 'Gerar e Enviar Boleto por Email';

  if (loading) return <div className="text-center p-10 font-bold" role="status">Carregando...</div>;

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">Finalizar Pagamento</h1>

      {error && !reserva && <div className="text-center p-10 text-red-500 font-bold" role="alert">{error}</div>}

      {reserva && (
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
          <section aria-labelledby="resumo-reserva-heading">
            <div className="border-b pb-6 mb-6">
              <h2 id="resumo-reserva-heading" className="text-2xl font-bold text-blue-600">{reserva.pacoteViagem.titulo}</h2>
              <span className='text-sm font-medium bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full mt-2 inline-block'>
                {reserva.status}
              </span>
              <div className="text-sm text-gray-500 space-y-1 mt-2">
                <p><strong>Viajantes:</strong> {reserva.viajantes.length + 1}</p>
                <p><strong>Valor Total:</strong>
                  <span className='font-bold text-base text-gray-800 ml-1'>
                    R$ {reserva.valorTotal.toFixed(2).replace('.', ',')}
                  </span>
                </p>
              </div>
            </div>
          </section>

          {error && <p className="text-red-500 text-center mb-4" role="alert">{error}</p>}

          <form onSubmit={handleSubmitForm}>
            <fieldset disabled={reserva.status !== 'PENDENTE'}>
              <fieldset className="mb-8">
                <legend className="text-xl font-bold mb-4">Escolha o Método de Pagamento</legend>
                <div className="space-y-4">
                  {[{id: 'Credito', label: 'Cartão de Crédito'}, {id: 'Debito', label: 'Cartão de Débito'}, {id: 'Boleto', label: 'Boleto'}, {id: 'Pix', label: 'Pix'}].map(item => (
                    <div key={item.id} className="relative">
                      <input
                        type="radio"
                        id={`metodo-${item.id}`}
                        name="metodoPagamento"
                        value={item.id}
                        checked={metodo === item.id}
                        onChange={() => setMetodo(item.id)}
                        className="sr-only peer"
                      />
                      <label
                        htmlFor={`metodo-${item.id}`}
                        className={`
                          flex items-center p-4 border rounded-lg cursor-pointer transition
                          ${metodo === item.id ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500' : 'hover:bg-gray-50'}
                          peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-blue-600
                        `}
                      >
                        {(item.id === 'Credito' || item.id === 'Debito') && <CreditCard className="mr-4 text-blue-600" aria-hidden="true"/>}
                        {item.id === 'Boleto' && <Landmark className="mr-4 text-blue-600" aria-hidden="true"/>}
                        {item.id === 'Pix' && <QrCode className="mr-4 text-blue-600" aria-hidden="true"/>}
                        <span className="font-semibold">{item.label}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </fieldset>

              {metodo === 'Pix' && (
                <fieldset className="animate-fade-in">
                   <legend className="text-xl font-bold mb-4">Informações do Pagador</legend>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      <div>
                        <label htmlFor="pix-nomeCompleto" className="sr-only">Nome Completo</label>
                        <input id="pix-nomeCompleto" value={nomeCompleto} onChange={e => setNomeCompleto(e.target.value)} required placeholder="Nome Completo" className="p-3 border rounded-md w-full"/>
                      </div>
                      <div>
                        <label htmlFor="pix-cpf" className="sr-only">CPF do titular</label>
                        <input id="pix-cpf" value={cpf} onChange={e => setCpf(formatarCpf(e.target.value))} required placeholder="CPF do titular" className="p-3 border rounded-md w-full" maxLength="14" />
                      </div>
                   </div>
                   <PixPayment onConfirm={handleFinalizarCompra} isProcessing={isProcessing}/>
                </fieldset>
              )}

              {(metodo === 'Credito' || metodo === 'Debito' || metodo === 'Boleto') && (
                <fieldset className="animate-fade-in">
                  <legend className="text-xl font-bold mb-4">Informações do Pagador</legend>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label htmlFor="form-nomeCompleto" className="sr-only">Nome Completo</label>
                      <input id="form-nomeCompleto" value={nomeCompleto} onChange={e => setNomeCompleto(e.target.value)} required placeholder="Nome Completo" className="p-3 border rounded-md w-full"/>
                    </div>
                    <div>
                      <label htmlFor="form-cpf" className="sr-only">CPF do titular</label>
                      <input id="form-cpf" value={cpf} onChange={e => setCpf(formatarCpf(e.target.value))} required placeholder="CPF do titular" className="p-3 border rounded-md w-full" maxLength="14" />
                    </div>
                  </div>

                  {(metodo === 'Credito' || metodo === 'Debito') && (
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-6">
                      <div className="sm:col-span-4">
                        <label htmlFor="numeroCartao" className="sr-only">Número do Cartão</label>
                        <input id="numeroCartao" value={numeroCartao} onChange={e => setNumeroCartao(formatarNumeroCartao(e.target.value))} required placeholder="Número do Cartão" className="p-3 border rounded-md w-full" maxLength="19" />
                      </div>
                      <div className="sm:col-span-1">
                        <label htmlFor="cvv" className="sr-only">CVV</label>
                        <input id="cvv" value={cvv} onChange={e => setCvv(formatarCvv(e.target.value))} required placeholder="CVV" className="p-3 border rounded-md w-full" maxLength="4" />
                      </div>
                      {metodo === 'Credito' && (
                        <div className="sm:col-span-3">
                          <label htmlFor="parcelas" className="sr-only">Número de parcelas</label>
                          <select id="parcelas" value={parcelas} onChange={e => setParcelas(Number(e.target.value))} className="p-3 border rounded-md bg-white w-full">
                            {[...Array(12).keys()].map(p => <option key={p+1} value={p+1}>{p+1}x de R$ {(reserva.valorTotal / (p+1)).toFixed(2).replace('.', ',')}</option>)}
                          </select>
                        </div>
                      )}
                    </div>
                  )}

                  <button type="submit" disabled={isProcessing} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg text-lg hover:bg-green-700 transition disabled:bg-green-300">
                    {isProcessing ? 'Processando...' : botaoPagarTexto}
                  </button>
                </fieldset>
              )}
            </fieldset>
          </form>
        </div>
      )}
    </div>
  );
}
