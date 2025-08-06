import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UserPlus, Trash2 } from 'lucide-react';
import pacoteService from '../../services/pacoteServices';
import reservaService from '../../services/reservaService';

const VisuallyHidden = ({ children }) => (
  <span
    className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0"
    style={{ clip: 'rect(0, 0, 0, 0)' }}
  >
    {children}
  </span>
);

const formatarCpf = (value) => {
  const valorNumerico = value.replace(/\D/g, '').slice(0, 11);
  return valorNumerico
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

export default function Reserva() {
  const { pacoteId } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [pacote, setPacote] = useState(null);
  const [viajantes, setViajantes] = useState([]);
  const [reservaCriada, setReservaCriada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    setLoading(true);
    pacoteService
      .getPacotePorId(Number(pacoteId))
      .then(setPacote)
      .catch(() => setError('Pacote não encontrado. Por favor, volte e tente novamente.'))
      .finally(() => setLoading(false));
  }, [pacoteId]);

  useEffect(() => {
    if (reservaCriada && reservaCriada.id) {
      navigate(`/pagamento/${reservaCriada.id}`);
    }
  }, [reservaCriada, navigate]);

  const handleAddViajante = () => {
    const totalViajantes = 1 + viajantes.length;
    if (pacote && totalViajantes >= pacote.vagasDisponiveis) {
      alert('Não há mais vagas disponíveis para adicionar outro viajante a este pacote.');
      return;
    }
    setViajantes([...viajantes, { nome: '', documento: '' }]);
    setStatusMessage(`Acompanhante ${viajantes.length + 1} adicionado.`);
  };

  const handleRemoveViajante = (index) => {
    const novosViajantes = viajantes.filter((_, i) => i !== index);
    setViajantes(novosViajantes);
    setStatusMessage(`Acompanhante ${index + 1} removido.`);
  };

  const handleViajanteChange = (index, event) => {
    const { name, value } = event.target;
    const novosViajantes = [...viajantes];
    if (name === 'documento') {
      novosViajantes[index][name] = formatarCpf(value);
    } else {
      novosViajantes[index][name] = value;
    }
    setViajantes(novosViajantes);
  };

  const handleConfirmarReserva = async () => {
    setIsProcessing(true);
    setError('');
    const viajantesValidos = viajantes
      .filter((v) => v.nome.trim() !== '' && v.documento.trim() !== '')
      .map((v) => ({
        ...v,
        documento: v.documento.replace(/\D/g, ''),
      }));
    try {
      const dadosParaCriarReserva = {
        pacoteViagemId: Number(pacoteId),
        viajantes: viajantesValidos,
      };
      const novaReserva = await reservaService.criarReserva(dadosParaCriarReserva);
      setReservaCriada(novaReserva);
    } catch (err) {
      setError(
        err.response?.data?.erro ||
          'Não foi possível criar a reserva. Verifique as vagas disponíveis.',
      );
      setIsProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="text-center p-10 font-bold text-gray-500" role="status">
        Carregando detalhes...
      </div>
    );
  if (error)
    return (
      <div className="text-center p-10 text-red-500 font-bold" role="alert">
        {error}
      </div>
    );
  if (!pacote) return null;

  const totalViajantes = 1 + viajantes.length;
  const valorTotalPrevisto = pacote.valor * totalViajantes;

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <VisuallyHidden role="status" aria-live="polite">
        {statusMessage}
      </VisuallyHidden>

      <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">Configurar Reserva</h1>

      <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
        <section aria-labelledby="detalhes-pacote-heading">
          <div className="border-b pb-6 mb-6">
            <h2 id="detalhes-pacote-heading" className="text-2xl font-bold text-blue-600">
              {pacote.titulo}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              De{' '}
              <time dateTime={pacote.dataInicio}>
                {new Date(pacote.dataInicio).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
              </time>{' '}
              até{' '}
              <time dateTime={pacote.dataFim}>
                {new Date(pacote.dataFim).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
              </time>
            </p>
          </div>
        </section>

        <section aria-labelledby="viajantes-heading">
          <h3 id="viajantes-heading" className="text-xl font-bold mb-2">
            Viajantes
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Você já está incluído como titular. Adicione seus acompanhantes.
          </p>

          <div className="bg-gray-50 p-4 rounded-lg border mb-6">
            <p className="font-semibold text-gray-800">Viajante Principal</p>
            <p className="text-gray-700">{user?.nomeCompleto}</p>
          </div>

          {/* ✅ ACESSIBILIDADE: `fieldset` agrupa os campos de cada acompanhante */}
          {viajantes.map((viajante, index) => (
            <fieldset
              key={index}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 items-center border-t pt-4"
            >
              <legend className="sr-only">Informações do Acompanhante {index + 1}</legend>
              <div>
                <label htmlFor={`nome-acompanhante-${index}`} className="sr-only">
                  Nome completo do Acompanhante {index + 1}
                </label>
                <input
                  id={`nome-acompanhante-${index}`}
                  name="nome"
                  type="text"
                  value={viajante.nome}
                  onChange={(e) => handleViajanteChange(index, e)}
                  placeholder={`Nome completo do Acompanhante ${index + 1}`}
                  className="p-3 border rounded-md w-full"
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor={`documento-acompanhante-${index}`} className="sr-only">
                  Documento (CPF) do Acompanhante {index + 1}
                </label>
                <input
                  id={`documento-acompanhante-${index}`}
                  name="documento"
                  type="text"
                  value={viajante.documento}
                  onChange={(e) => handleViajanteChange(index, e)}
                  placeholder="CPF"
                  className="p-3 border rounded-md w-full"
                  maxLength="14"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveViajante(index)}
                  aria-label={`Remover Acompanhante ${index + 1}`}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </fieldset>
          ))}

          <button
            type="button"
            onClick={handleAddViajante}
            className="text-blue-600 font-semibold flex items-center p-3 rounded-md border-2 border-dashed border-blue-500 hover:bg-blue-50 transition w-full justify-center"
          >
            <UserPlus size={18} className="mr-2" aria-hidden="true" /> Adicionar Acompanhante
          </button>
        </section>

        <div className="border-t mt-8 pt-6">
          <div className="flex justify-between items-center font-bold text-xl text-blue-600 mb-4">
            <span>Valor Total Estimado:</span>
            <span>
              R${' '}
              {valorTotalPrevisto.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <button
            onClick={handleConfirmarReserva}
            disabled={isProcessing}
            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-lg hover:bg-green-700 transition disabled:bg-green-300"
          >
            {isProcessing ? 'Processando Reserva...' : 'Confirmar Viajantes e Ir para Pagamento'}
          </button>
          {error && (
            <p className="text-red-500 text-center mt-4 text-sm" role="alert">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
