import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import reservaService from '../../services/reservaService';
import avaliacoesService from '../../services/avaliacoesServices';
import usuarioService from '../../services/usuarioService';
import { updateUser } from '../../store/authSlice';

import ModalDetalhesReservas from '../../components/ModalDetalhesReservas.jsx';
import { Star, Eye, EyeOff } from 'lucide-react';

// --- COMPONENTE INTERNO PARA AVALIAÇÃO EM ESTRELAS ---
const StarRating = ({ rating, size = 20 }) => {
    return (
        <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
                <Star
                    key={i}
                    size={size}
                    className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                />
            ))}
        </div>
    );
};

// --- COMPONENTE INTERNO PARA O FORMULÁRIO DE AVALIAÇÃO ---
const AvaliacaoForm = ({ pacoteId, onAvaliacaoSubmit }) => {
    const [nota, setNota] = useState(0);
    const [comentario, setComentario] = useState('');
    const [hoverNota, setHoverNota] = useState(0);
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { user } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (nota === 0) {
            setError('Por favor, selecione uma nota de 1 a 5 estrelas.');
            return;
        }
        setError('');
        setIsSubmitting(true);
        try {
            await avaliacoesService.criarAvaliacao({
                pacoteViagem_Id: pacoteId,
                usuario_Id: user.id,
                nota: nota,
                comentario: comentario,
            });
            onAvaliacaoSubmit();
        } catch (err) {
            const apiError = err.response?.data?.erro || "Ocorreu um erro ao enviar sua avaliação.";
            setError(apiError);
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mt-4 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`cursor-pointer transition-colors ${
                            (hoverNota || nota) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                        }`}
                        onMouseEnter={() => setHoverNota(star)}
                        onMouseLeave={() => setHoverNota(0)}
                        onClick={() => setNota(star)}
                    />
                ))}
                <span className="ml-2 text-sm text-gray-600">{nota > 0 ? `${nota} estrela(s)`: 'Sua nota'}</span>
            </div>
            <textarea
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Conte como foi sua experiência..."
                className="w-full p-2 border rounded-md"
                rows="3"
                required
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
            <button type="submit" disabled={isSubmitting} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
            </button>
        </form>
    );
};


// --- COMPONENTE PRINCIPAL ---
export default function ClienteDashboard() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    
    // Estados para o dashboard (viagens e avaliações)
    const [reservas, setReservas] = useState([]);
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('viagens');
    const [modalAberta, setModalAberta] = useState(false);
    const [reservaSelecionada, setReservaSelecionada] = useState(null);

    // Estados para a aba de perfil
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState(''); 
    const [documento, setDocumento] = useState('');
    const [perfilError, setPerfilError] = useState(null);
    const [perfilSuccess, setPerfilSuccess] = useState(null);
    const [isPerfilSubmitting, setIsPerfilSubmitting] = useState(false);

    // Novos estados para a mudança de senha
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
    const [senhaError, setSenhaError] = useState(null);
    const [senhaSuccess, setSenhaSuccess] = useState(null);

    // Estados para mostrar/ocultar senhas
    const [showSenhaAtual, setShowSenhaAtual] = useState(false);
    const [showNovaSenha, setShowNovaSenha] = useState(false);
    const [showConfirmarNovaSenha, setShowConfirmarNovaSenha] = useState(false);


    // Efeito para carregar as reservas e avaliações
    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [dadosReservas, dadosAvaliacoes] = await Promise.all([
                reservaService.getMinhasReservas(),
                avaliacoesService.getMinhasAvaliacoes()
            ]);
            setReservas(Array.isArray(dadosReservas) ? dadosReservas : []);
            setAvaliacoes(Array.isArray(dadosAvaliacoes) ? dadosAvaliacoes : []);
        } catch (err) {
            console.error('Falha ao buscar dados do painel:', err);
            setError('Não foi possível carregar os dados. Tente atualizar a página.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Efeito que preenche os campos do perfil com base nos dados do usuário no Redux
    useEffect(() => {
        if (user && activeTab === 'perfil') {
            setNome(user.nomeCompleto || '');
            setEmail(user.email || '');
            setTelefone(user.telefone || '');
            setDocumento(user.documento || '');
        }
    }, [user, activeTab]);

    // Efeito que limpa as mensagens ao mudar de aba e tenta carregar dados completos se disponível
    useEffect(() => {
        if (activeTab === 'perfil') {
            // Limpa as mensagens de sucesso/erro ao mudar de aba para evitar que elas persistam
            setPerfilError(null);
            setPerfilSuccess(null);
            setSenhaError(null);
            setSenhaSuccess(null);
            
            // Tenta buscar dados completos silenciosamente (sem mostrar erro se falhar)
            tentarCarregarDadosCompletos();
        }
    }, [activeTab]);

    // Função para tentar carregar dados completos do perfil (silenciosa)
    const tentarCarregarDadosCompletos = async () => {
        try {
            const dadosCompletos = await usuarioService.getMeuPerfil();
            
            // Preenche os campos com os dados da API
            setNome(dadosCompletos.nomeCompleto || user?.nomeCompleto || '');
            setEmail(dadosCompletos.email || user?.email || '');
            setTelefone(dadosCompletos.telefone || '');
            setDocumento(dadosCompletos.documento || '');
            
            // Atualiza o Redux com os dados completos
            dispatch(updateUser({ user: { ...user, ...dadosCompletos } }));
        } catch (error) {
            // Falha silenciosa - continua com os dados disponíveis no Redux
        }
    };


    const viagensParaAvaliar = useMemo(() => {
        const pacotesAvaliadosIds = new Set(avaliacoes.map(a => a.pacote.id));
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);

        return reservas.filter(reserva => {
            const dataFim = new Date(reserva.pacoteViagem?.dataFim);
            const statusValido = reserva.status === 'CONFIRMADA' || reserva.status === 'CONCLUIDA';
            const jaTerminou = dataFim < hoje;
            const naoFoiAvaliado = !pacotesAvaliadosIds.has(reserva.pacoteViagem.id);

            return statusValido && jaTerminou && naoFoiAvaliado;
        });
    }, [reservas, avaliacoes]);
    
    const reservasPendentes = useMemo(() => reservas.filter(r => r?.status === 'PENDENTE'), [reservas]);
    const reservasConfirmadas = useMemo(() => reservas.filter(r => r?.status === 'CONFIRMADA' || r?.status === 'CONCLUIDA'), [reservas]);
    
    const abrirModal = (reserva) => {
        setReservaSelecionada(reserva);
        setModalAberta(true);
    };
    const fecharModal = () => {
        setModalAberta(false);
        setReservaSelecionada(null);
    };

    // Função para lidar com a submissão do formulário de perfil
    const handlePerfilSubmit = async (e) => {
        e.preventDefault();
        setIsPerfilSubmitting(true);
        setPerfilError(null);
        setPerfilSuccess(null);
        setSenhaError(null); 
        setSenhaSuccess(null);
    
        try {
            // Tenta atualizar o perfil primeiro
            const dadosAtualizados = {
                nomeCompleto: nome,
                telefone: telefone,
                email: email,
                documento: user?.documento // Mantém o documento inalterado
            };
    
            await usuarioService.atualizarMeuPerfil(dadosAtualizados);
    
            let mensagem = "Seu perfil foi atualizado com sucesso!";
            
            // Em seguida, verifica se a senha precisa ser alterada
            if (senhaAtual || novaSenha || confirmarNovaSenha) {
                if (!senhaAtual) {
                    setSenhaError('Por favor, insira a senha atual para alterá-la.');
                    return;
                }
                if (novaSenha !== confirmarNovaSenha) {
                    setSenhaError('A nova senha e a confirmação não coincidem.');
                    return;
                }
                if (!novaSenha) {
                    setSenhaError('A nova senha não pode estar vazia.');
                    return;
                }
                
                const dadosSenha = { 
                    SenhaAtual: senhaAtual, 
                    NovaSenha: novaSenha,
                    ConfirmarNovaSenha: confirmarNovaSenha
                };
                
                await usuarioService.alterarSenha(dadosSenha);
                mensagem += " Sua senha também foi atualizada com sucesso!";
                
                // Limpa os campos de senha após o sucesso
                setSenhaAtual('');
                setNovaSenha('');
                setConfirmarNovaSenha('');
            }
            
            setPerfilSuccess(mensagem);
            dispatch(updateUser({ user: { ...user, ...dadosAtualizados } }));
            
        } catch (err) {
            const apiError = err.response?.data?.erro || err.response?.data?.message || err.response?.data?.title || "Ocorreu um erro ao atualizar seu perfil.";
            const apiErrors = err.response?.data?.detalhes || err.response?.data?.errors;
            
            // Verifica se o erro está relacionado à senha
            if (apiError.includes("senha") || apiErrors?.PasswordMismatch || err.config?.url?.includes('alterar-senha') || err.response?.data?.title?.includes('validation errors')) {
                // Se há erros específicos de validação de senha, use-os
                if (apiErrors?.SenhaAtual || apiErrors?.NovaSenha || apiErrors?.ConfirmarNovaSenha) {
                    const errosSenha = [];
                    if (apiErrors.SenhaAtual) errosSenha.push(...apiErrors.SenhaAtual);
                    if (apiErrors.NovaSenha) errosSenha.push(...apiErrors.NovaSenha);
                    if (apiErrors.ConfirmarNovaSenha) errosSenha.push(...apiErrors.ConfirmarNovaSenha);
                    setSenhaError(errosSenha.join(' '));
                } else {
                    setSenhaError(apiError);
                }
            } else {
                setPerfilError(apiError);
            }
        } finally {
            setIsPerfilSubmitting(false);
        }
    };
    

    const primeiroNome = user?.nomeCompleto?.split(' ')[0] || 'Usuário';

    return (
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
            <header className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Olá, {primeiroNome}!</h1>
                <p className="text-md text-gray-500">Bem-vindo(a) ao seu painel. Aqui você gerencia suas viagens, avaliações e perfil.</p>
            </header>

            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-6 overflow-x-auto">
                    <button 
                        onClick={() => setActiveTab('viagens')} 
                        className={`flex-shrink-0 py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'viagens' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        Minhas Viagens
                    </button>
                    <button 
                        onClick={() => setActiveTab('avaliacoes')} 
                        className={`flex-shrink-0 py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'avaliacoes' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        Minhas Avaliações
                    </button>
                    <button 
                        onClick={() => setActiveTab('perfil')} 
                        className={`flex-shrink-0 py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'perfil' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                    >
                        Meu Perfil
                    </button>
                </nav>
            </div>

            {loading && <p>Carregando...</p>}
            {error && <p className="text-red-500 p-4 bg-red-50 rounded-lg">{error}</p>}

            {!loading && !error && activeTab === 'viagens' && (
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Reservas Pendentes</h2>
                    {reservasPendentes.length > 0 ? (
                        reservasPendentes.map((reserva) => (
                            <div key={reserva.id} className="bg-white rounded-xl shadow-md p-5 mb-4 flex flex-col sm:flex-row justify-between items-center">
                                <div className="flex-1 min-w-0 pr-4">
                                    <h3 className="font-bold text-lg truncate">Viagem para {reserva?.pacoteViagem?.destino}</h3>
                                    <p className="text-sm text-gray-500">Data da Reserva: {formatarData(reserva?.data)}</p>
                                </div>
                                <button onClick={() => abrirModal(reserva)} className="mt-4 sm:mt-0 px-5 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 font-semibold">Ver Detalhes</button>
                            </div>
                        ))
                    ) : <p className="text-gray-500">Nenhuma reserva pendente.</p>}

                    <h2 className="text-xl font-semibold text-gray-700 mt-8 mb-4">Reservas Confirmadas e Concluídas</h2>
                    {reservasConfirmadas.length > 0 ? (
                        reservasConfirmadas.map((reserva) => (
                            <div key={reserva.id} className="bg-white rounded-xl shadow-md p-5 mb-4">
                                <div className="flex flex-col sm:flex-row justify-between items-center">
                                    <div className="flex-1 min-w-0 pr-4">
                                        <h3 className="font-bold text-lg truncate">Viagem para {reserva?.pacoteViagem?.destino}</h3>
                                        <p className="text-sm text-gray-500">Status: <span className="font-semibold">{reserva.status}</span></p>
                                    </div>
                                    <button onClick={() => abrirModal(reserva)} className="mt-4 sm:mt-0 px-5 py-2 rounded-lg text-indigo-600 bg-white border border-indigo-600 hover:bg-indigo-50 font-semibold">Ver Detalhes</button>
                                </div>
                                {viagensParaAvaliar.some(p => p.id === reserva.id) && (
                                    <AvaliacaoForm pacoteId={reserva.pacoteViagem.id} onAvaliacaoSubmit={fetchData} />
                                )}
                            </div>
                        ))
                    ) : <p className="text-gray-500">Nenhuma reserva confirmada ou concluída.</p>}
                </div>
            )}

            {!loading && !error && activeTab === 'avaliacoes' && (
                <div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Suas Avaliações</h2>
                    {avaliacoes.length > 0 ? (
                        avaliacoes.map((avaliacao) => (
                            <div key={avaliacao.id} className="bg-white rounded-xl shadow-md p-5 mb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg">{avaliacao.pacote.destino}</h3>
                                        <p className="text-sm text-gray-500">Enviada em: {formatarData(avaliacao.dataCriacao)}</p>
                                        <span className={`mt-2 inline-block px-3 py-1 text-xs font-semibold rounded-full ${avaliacao.status === 'PENDENTE' ? 'text-yellow-800 bg-yellow-200' : 'text-green-800 bg-green-200'}`}>
                                            {avaliacao.status}
                                        </span>
                                    </div>
                                    <StarRating rating={avaliacao.nota} />
                                </div>
                                <p className="mt-4 text-gray-600 italic">"{avaliacao.comentario}"</p>
                            </div>
                        ))
                    ) : <p className="text-gray-500">Você ainda não enviou nenhuma avaliação.</p>}
                </div>
            )}
            
            {/* Formulário de perfil e de mudança de senha */}
            {!loading && !error && activeTab === 'perfil' && (
                <div className="mt-6 space-y-8">
                    {/* Formulário de Perfil */}
                    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Meu Perfil</h2>
                        {(perfilSuccess || senhaSuccess) && <p className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg">{perfilSuccess || senhaSuccess}</p>}
                        {(perfilError || senhaError) && <p className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">{perfilError || senhaError}</p>}
                        
                        <form onSubmit={handlePerfilSubmit}>
                            <div className="mb-4">
                                <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                                <input
                                    type="text"
                                    id="nome"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="documento" className="block text-sm font-medium text-gray-700">Documento</label>
                                <input
                                    type="text"
                                    id="documento"
                                    value={documento || user?.documento || ''}
                                    placeholder={!documento && !user?.documento ? 'Documento será carregado quando disponível' : ''}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed"
                                    disabled
                                />
                                <p className="mt-1 text-xs text-gray-500">Este campo não pode ser alterado. Entre em contato com o suporte se precisar de ajuda.</p>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone</label>
                                <input
                                    type="tel"
                                    id="telefone"
                                    value={telefone}
                                    onChange={(e) => setTelefone(e.target.value)}
                                    placeholder="Adicione seu telefone"
                                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            {/* Campos de alteração de senha */}
                            <div className="mt-8 border-t pt-4">
                                <h3 className="text-xl font-semibold text-gray-800 mb-4">Alterar Senha</h3>
                                <div className="mb-4 relative">
                                    <label htmlFor="senhaAtual" className="block text-sm font-medium text-gray-700">Senha Atual</label>
                                    <input
                                        type={showSenhaAtual ? 'text' : 'password'}
                                        id="senhaAtual"
                                        value={senhaAtual}
                                        onChange={(e) => setSenhaAtual(e.target.value)}
                                        placeholder="Digite sua senha atual para alterar"
                                        className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowSenhaAtual(!showSenhaAtual)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6 text-gray-500 hover:text-gray-700"
                                        aria-label="Mostrar ou esconder a senha atual"
                                    >
                                        {showSenhaAtual ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <div className="mb-4 relative">
                                    <label htmlFor="novaSenha" className="block text-sm font-medium text-gray-700">Nova Senha</label>
                                    <input
                                        type={showNovaSenha ? 'text' : 'password'}
                                        id="novaSenha"
                                        value={novaSenha}
                                        onChange={(e) => setNovaSenha(e.target.value)}
                                        placeholder="Digite a nova senha"
                                        className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNovaSenha(!showNovaSenha)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6 text-gray-500 hover:text-gray-700"
                                        aria-label="Mostrar ou esconder a nova senha"
                                    >
                                        {showNovaSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <div className="mb-4 relative">
                                    <label htmlFor="confirmarNovaSenha" className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
                                    <input
                                        type={showConfirmarNovaSenha ? 'text' : 'password'}
                                        id="confirmarNovaSenha"
                                        value={confirmarNovaSenha}
                                        onChange={(e) => setConfirmarNovaSenha(e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmarNovaSenha(!showConfirmarNovaSenha)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6 text-gray-500 hover:text-gray-700"
                                        aria-label="Mostrar ou esconder a confirmação da nova senha"
                                    >
                                        {showConfirmarNovaSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>
                            
                            <button
                                type="submit"
                                disabled={isPerfilSubmitting}
                                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                            >
                                {isPerfilSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="mt-12 p-4 bg-gray-100 rounded-lg text-center">
                <p className="text-sm text-gray-600">Precisa alterar seus dados? <a href="/suporte" className="font-semibold text-indigo-600 hover:underline">Fale com o suporte</a>.</p>
            </div>

            {modalAberta && <ModalDetalhesReservas reserva={reservaSelecionada} onClose={fecharModal} />}
        </div>
    );
}

const formatarData = (dataString) => {
    if (!dataString) return 'Data indisponível';
    try {
        const data = new Date(dataString);
        return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(data);
    } catch (error) {
        return 'Data inválida';
    }
};
