import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UserPlus, Trash2 } from 'lucide-react';
import pacoteService from '../../services/pacoteServices';
import reservaService from '../../services/reservaService';

/**
 * Formata um valor de CPF (xxx.xxx.xxx-xx)
 * @param {string} value O valor a ser formatado
 * @returns {string} O valor formatado
 */
const formatarCpf = (value) => {
  // Remove tudo que não for dígito
  const valorNumerico = value.replace(/\D/g, '');

  // Limita a 11 dígitos
  const valorLimitado = valorNumerico.slice(0, 11);

  // Aplica a máscara
  return valorLimitado
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
};

export default function Reserva() {
    const { pacoteId } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector(state => state.auth);

    const [pacote, setPacote] = useState(null);
    const [viajantes, setViajantes] = useState([]);
    const [reservaCriada, setReservaCriada] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    // Efeito para buscar os detalhes do pacote ao carregar a página
    useEffect(() => {
        setLoading(true);
        pacoteService.getPacotePorId(Number(pacoteId))
            .then(setPacote)
            .catch(() => setError("Pacote não encontrado. Por favor, volte e tente novamente."))
            .finally(() => setLoading(false));
    }, [pacoteId]);

    // Efeito para redirecionar o usuário após a criação bem-sucedida da reserva
    useEffect(() => {
        if (reservaCriada && reservaCriada.id) {
            navigate(`/pagamento/${reservaCriada.id}`);
        }
    }, [reservaCriada, navigate]);

    // Função para adicionar um novo campo de acompanhante
    const handleAddViajante = () => {
        const totalViajantes = 1 + viajantes.length;
        if (pacote && totalViajantes >= pacote.vagasDisponiveis) {
            alert("Não há mais vagas disponíveis para adicionar outro viajante a este pacote.");
            return;
        }
        setViajantes([...viajantes, { nome: '', documento: '' }]);
    };

    // Função para remover um acompanhante pelo seu índice
    const handleRemoveViajante = (index) => {
        const novosViajantes = viajantes.filter((_, i) => i !== index);
        setViajantes(novosViajantes);
    };

    // Função para atualizar os dados de um acompanhante
    const handleViajanteChange = (index, event) => {
        const { name, value } = event.target;
        const novosViajantes = [...viajantes];

        // Se o campo alterado for 'documento', aplica a máscara de CPF
        if (name === 'documento') {
            novosViajantes[index][name] = formatarCpf(value);
        } else {
            // Para outros campos (como 'nome'), mantém o comportamento original
            novosViajantes[index][name] = value;
        }

        setViajantes(novosViajantes);
    };

    const handleConfirmarReserva = async () => {
        setIsProcessing(true);
        setError('');

        // Remove a formatação dos documentos antes de enviar para o backend
        const viajantesValidos = viajantes
            .filter(v => v.nome.trim() !== '' && v.documento.trim() !== '')
            .map(v => ({
                ...v,
                documento: v.documento.replace(/\D/g, '') // Envia apenas os números
            }));

        try {
            const dadosParaCriarReserva = {
                pacoteViagemId: Number(pacoteId),
                viajantes: viajantesValidos,
            };
            const novaReserva = await reservaService.criarReserva(dadosParaCriarReserva);
            setReservaCriada(novaReserva);
        } catch (err) {
            setError(err.response?.data?.erro || "Não foi possível criar a reserva. Verifique as vagas disponíveis.");
            setIsProcessing(false);
        }
    };

    if (loading) return <div className="text-center p-10 font-bold text-gray-500">Carregando detalhes...</div>;
    if (error) return <div className="text-center p-10 text-red-500 font-bold">{error}</div>;
    if (!pacote) return null;

    const totalViajantes = 1 + viajantes.length;
    const valorTotalPrevisto = pacote.valor * totalViajantes;

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-4xl">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">Configurar Reserva</h1>

            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
                <div className="border-b pb-6 mb-6">
                    <h2 className="text-2xl font-bold text-blue-600">{pacote.titulo}</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        De {new Date(pacote.dataInicio).toLocaleDateString('pt-BR')} até {new Date(pacote.dataFim).toLocaleDateString('pt-BR')}
                    </p>
                </div>

                <h3 className="text-xl font-bold mb-2">Viajantes</h3>
                <p className="text-sm text-gray-500 mb-6">Você já está incluído como titular. Adicione seus acompanhantes.</p>

                <div className="bg-gray-50 p-4 rounded-lg border mb-6">
                    <p className="font-semibold text-gray-800">Viajante Principal</p>
                    <p className="text-gray-700">{user?.nomeCompleto}</p>
                </div>

                {viajantes.map((viajante, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 items-center border-t pt-4">
                        <input name="nome" type="text" value={viajante.nome} onChange={(e) => handleViajanteChange(index, e)} placeholder={`Nome completo do Acompanhante ${index + 1}`} className="p-3 border rounded-md w-full"/>
                        <div className="flex items-center gap-2">
                            <input
                                name="documento"
                                type="text"
                                value={viajante.documento}
                                onChange={(e) => handleViajanteChange(index, e)}
                                placeholder="CPF"
                                className="p-3 border rounded-md w-full"
                                maxLength="14"
                            />
                            <button type="button" onClick={() => handleRemoveViajante(index)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={20}/></button>
                        </div>
                    </div>
                ))}

                <button type="button" onClick={handleAddViajante} className="text-blue-600 font-semibold flex items-center p-3 rounded-md border-2 border-dashed border-blue-500 hover:bg-blue-50 transition w-full justify-center">
                    <UserPlus size={18} className="mr-2"/> Adicionar Acompanhante
                </button>

                <div className="border-t mt-8 pt-6">
                    <div className="flex justify-between items-center font-bold text-xl text-blue-600 mb-4">
                        <span>Valor Total Estimado:</span>
                        <span>R$ {valorTotalPrevisto.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <button
                        onClick={handleConfirmarReserva}
                        disabled={isProcessing}
                        className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-lg hover:bg-green-700 transition disabled:bg-green-300"
                    >
                        {isProcessing ? 'Processando Reserva...' : 'Confirmar Viajantes e Ir para Pagamento'}
                    </button>
                    {error && <p className="text-red-500 text-center mt-4 text-sm">{error}</p>}
                </div>
            </div>
        </div>
    );
}
