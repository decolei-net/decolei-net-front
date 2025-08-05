import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import reservaService from '../../services/reservaService';
import avaliacoesService from '../../services/avaliacoesServices';
import ModalDetalhesReservas from '../../components/ModalDetalhesReservas.jsx';
import StarRating from '../../components/StarRating.jsx';
import AvaliacaoForm from '../../components/AvaliacaoForm.jsx';
import { API_BASE_URL } from '../../services/api.js';
import { MessageSquareText, CalendarDays, Eye, EyeOff, Clock, PlaneTakeoff, ShieldCheck } from 'lucide-react';
// Imports corrigidos e adicionados
import usuarioService from '../../services/usuarioService';
import { updateUser } from '../../store/authSlice.js';

const placeholderImg = 'https://placehold.co/100x100/e2e8f0/94a3b8/png?text=Sem+Imagem';

const formatarData = (dataString) => {
  if (!dataString) return 'Data indisponível';
  try {
    const data = new Date(dataString);
    return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(data);
  } catch (error) {
    return 'Data inválida';
  }
};

export default function ClienteDashboard() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch(); // Adicionado para poder usar o dispatch
  const [reservas, setReservas] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('viagens');
  const [modalAberta, setModalAberta] = useState(false);
  const [reservaSelecionada, setReservaSelecionada] = useState(null);

  // Novos estados para a mudança de senha
  const [senhaAtual, setSenhaAtual] = useState('');
  const [novaSenha, setNovaSenha] = useState('');
  const [confirmarNovaSenha, setConfirmarNovaSenha] = useState('');
  const [senhaError, setSenhaError] = useState(null);
  const [senhaSuccess, setSenhaSuccess] = useState(null);

  // Estados para a aba de perfil
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [documento, setDocumento] = useState('');
  const [perfilError, setPerfilError] = useState(null);
  const [perfilSuccess, setPerfilSuccess] = useState(null);
  const [isPerfilSubmitting, setIsPerfilSubmitting] = useState(false);

  // Estados para mostrar/ocultar senhas
  const [showSenhaAtual, setShowSenhaAtual] = useState(false);
  const [showNovaSenha, setShowNovaSenha] = useState(false);
  const [showConfirmarNovaSenha, setShowConfirmarNovaSenha] = useState(false);

  const formatarCpf = (value) => {
    if (!value) return '';
    const valorNumerico = value.replace(/\D/g, '').slice(0, 11);
    // A formatação estava com um espaço no início que impedia o formato correto de CPF
    return valorNumerico
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatarTelefone = (value) => {
    if (!value) return '';
    const valorNumerico = value.replace(/\D/g, '').slice(0, 11);
    return valorNumerico
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  };

  const FeedbackMessage = ({ message, type = 'status' }) => {
    if (!message) return null;

    const isError = type === 'error';
    const role = isError ? 'alert' : 'status';
    const className = `p-3 mb-4 text-sm rounded-lg ${
      isError
        ? 'text-red-700 bg-red-100'
        : 'text-green-700 bg-green-100'
    }`;

    return (
      <div className={className} role={role}>
        {message}
      </div>
    );
  };

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

  // ✅ --- LÓGICA DE FILTRAGEM CORRIGIDA --- ✅
  const pacotesAvaliadosIds = useMemo(() =>
    new Set(avaliacoes.filter(a => a && a.pacote).map(a => a.pacote.id)),
    [avaliacoes]
  );

  const reservasPendentes = useMemo(() => reservas.filter(r => r?.status === 'PENDENTE'), [reservas]);

  const proximasViagens = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return reservas.filter(reserva => {
      if (!reserva || !reserva.pacoteViagem) return false;
      const dataFim = new Date(reserva.pacoteViagem.dataFim);
      return reserva.status === 'CONFIRMADA' && dataFim >= hoje;
    });
  }, [reservas]);

  const viagensAnteriores = useMemo(() => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    return reservas.filter(reserva => {
      if (!reserva || !reserva.pacoteViagem) return false;
      const dataFim = new Date(reserva.pacoteViagem.dataFim);
      const statusValido = reserva.status === 'CONFIRMADA' || reserva.status === 'CONCLUIDA';
      return statusValido && dataFim < hoje;
    });
  }, [reservas]);

  const abrirModal = (reserva) => {
    setReservaSelecionada(reserva);
    setModalAberta(true);
  };
  const fecharModal = () => setModalAberta(false);
  const primeiroNome = user?.nomeCompleto?.split(' ')[0] || 'Usuário';

  const getThumbnailUrl = (reserva) => {
    const imagens = reserva?.pacoteViagem?.imagens;
    if (Array.isArray(imagens) && imagens.length > 0) {
      const primeiraImagem = imagens.find(midia => midia && midia.url && !midia.isVideo);
      if (primeiraImagem) {
        return `${API_BASE_URL}/${primeiraImagem.url}`;
      }
    }
    return placeholderImg;
  };

  useEffect(() => {
    if (user && activeTab === 'perfil') {
        setNome(user.nomeCompleto || '');
        setEmail(user.email || '');
        setTelefone(user.telefone || '');
        setDocumento(user.documento || '');
    }
  }, [user, activeTab]);

  useEffect(() => {
    if (activeTab === 'perfil') {
        setPerfilError(null);
        setPerfilSuccess(null);
        setSenhaError(null);
        setSenhaSuccess(null);
        tentarCarregarDadosCompletos();
    }
  }, [activeTab]);

  const tentarCarregarDadosCompletos = async () => {
      try {
          const dadosCompletos = await usuarioService.getMeuPerfil();
          setNome(dadosCompletos.nomeCompleto || user?.nomeCompleto || '');
          setEmail(dadosCompletos.email || user?.email || '');
          setTelefone(dadosCompletos.telefone || '');
          setDocumento(dadosCompletos.documento || '');
          dispatch(updateUser({ user: { ...user, ...dadosCompletos } }));
      } catch (error) {
          console.error("Falha ao carregar dados completos do perfil:", error);
      }
  };

  const handlePerfilSubmit = async (e) => {
    e.preventDefault();
    setIsPerfilSubmitting(true);
    setPerfilError(null);
    setPerfilSuccess(null);
    setSenhaError(null);
    setSenhaSuccess(null);
    try {
        const dadosAtualizados = {
            nomeCompleto: nome,
            telefone: telefone,
            email: email,
            documento: user?.documento
        };
        await usuarioService.atualizarMeuPerfil(dadosAtualizados);
        let mensagem = "Seu perfil foi atualizado com sucesso!";
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
            setSenhaAtual('');
            setNovaSenha('');
            setConfirmarNovaSenha('');
        }
        setPerfilSuccess(mensagem);
        dispatch(updateUser({ user: { ...user, ...dadosAtualizados } }));
    } catch (err) {
        const apiError = err.response?.data?.erro || err.response?.data?.message || err.response?.data?.title || "Ocorreu um erro ao atualizar seu perfil.";
        const apiErrors = err.response?.data?.detalhes || err.response?.data?.errors;
        if (apiError.includes("senha") || apiErrors?.PasswordMismatch || err.config?.url?.includes('alterar-senha') || err.response?.data?.title?.includes('validation errors')) {
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

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Olá, {primeiroNome}!</h1>
        <p className="text-md text-gray-500">Bem-vindo(a) ao seu painel. Aqui você gerencia suas viagens e avaliações.</p>
      </header>
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-6 overflow-x-auto" role="tablist" aria-label="Painel do Cliente">
          <button role="tab" aria-selected={activeTab === 'viagens'} onClick={() => setActiveTab('viagens')} className={`flex-shrink-0 py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'viagens' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Minhas Viagens</button>
          <button role="tab" aria-selected={activeTab === 'avaliacoes'} onClick={() => setActiveTab('avaliacoes')} className={`flex-shrink-0 py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'avaliacoes' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Minhas Avaliações</button>
          <button onClick={() => setActiveTab('perfil')} className={`flex-shrink-0 py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'perfil' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>Meu Perfil</button>
        </nav>
      </div>

      {loading && <p role="status">Carregando...</p>}
      {error && <p className="text-red-500 p-4 bg-red-50 rounded-lg" role="alert">{error}</p>}

      <main>
        {!loading && !error && activeTab === 'viagens' && (
          <section role="tabpanel" aria-labelledby="tab-viagens">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Reservas Pendentes</h2>
            {reservasPendentes.length > 0 ? (
              reservasPendentes.map((reserva) => (
                <div key={reserva.id} className="bg-white rounded-xl shadow-md p-4 mb-4 flex items-center">
                  <img src={getThumbnailUrl(reserva)} alt={`Imagem do destino ${reserva?.pacoteViagem?.destino}`} className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover mr-4 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate">Viagem para {reserva?.pacoteViagem?.destino}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock size={14} className="mr-2 text-yellow-600" aria-hidden="true" />
                      <span>Aguardando Pagamento</span>
                    </div>
                  </div>
                  <button onClick={() => abrirModal(reserva)} className="ml-4 px-4 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 font-semibold flex-shrink-0">Ver Detalhes</button>
                </div>
              ))
            ) : <p className="text-gray-500">Nenhuma reserva pendente.</p>}

            {/* ✅ JSX ATUALIZADO PARA USAR A NOVA LISTA `proximasViagens` */}
            <h2 className="text-xl font-semibold text-gray-700 mt-8 mb-4">Próximas Viagens</h2>
            {proximasViagens.length > 0 ? (
               proximasViagens.map((reserva) => (
                <div key={reserva.id} className="bg-white rounded-xl shadow-md p-4 mb-4 flex items-center">
                   <img src={getThumbnailUrl(reserva)} alt={`Imagem do destino ${reserva?.pacoteViagem?.destino}`} className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover mr-4 flex-shrink-0" />
                   <div className="flex-1 min-w-0">
                     <h3 className="font-bold text-lg truncate">Viagem para {reserva?.pacoteViagem?.destino}</h3>
                     <div className="flex items-center text-sm text-gray-500 mt-1">
                        <PlaneTakeoff size={14} className="mr-2 text-blue-600" aria-hidden="true" />
                        <span>Viagem Confirmada. Partida em {formatarData(reserva?.pacoteViagem?.dataInicio)}</span>
                     </div>
                   </div>
                   <button onClick={() => abrirModal(reserva)} className="ml-4 px-4 py-2 rounded-lg text-indigo-600 bg-white border border-indigo-600 hover:bg-indigo-50 font-semibold flex-shrink-0">Ver Detalhes</button>
                 </div>
               ))
            ) : <p className="text-gray-500">Nenhuma próxima viagem confirmada.</p>}

            {/* ✅ JSX ATUALIZADO PARA USAR A NOVA LISTA `viagensAnteriores` */}
            <h2 className="text-xl font-semibold text-gray-700 mt-8 mb-4">Viagens Anteriores</h2>
            {viagensAnteriores.length > 0 ? (
              viagensAnteriores.map((reserva) => {
                const naoFoiAvaliado = !pacotesAvaliadosIds.has(reserva.pacoteViagem.id);
                return (
                  <div key={reserva.id} className="bg-white rounded-xl shadow-md p-5 mb-4">
                    <div className="flex flex-col sm:flex-row justify-between items-center">
                      <div className="flex items-center flex-1 min-w-0 pr-4">
                        <img src={getThumbnailUrl(reserva)} alt={`Imagem do destino ${reserva?.pacoteViagem?.destino}`} className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover mr-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg truncate">Viagem para {reserva?.pacoteViagem?.destino}</h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <ShieldCheck size={14} className="mr-2 text-green-600" aria-hidden="true" />
                            <span>Viagem Concluída em {formatarData(reserva?.pacoteViagem?.dataFim)}</span>
                          </div>
                        </div>
                      </div>
                      <button onClick={() => abrirModal(reserva)} className="mt-4 sm:mt-0 ml-4 px-4 py-2 rounded-lg text-indigo-600 bg-white border border-indigo-600 hover:bg-indigo-50 font-semibold flex-shrink-0">Ver Detalhes</button>
                    </div>
                    {naoFoiAvaliado && (
                      <AvaliacaoForm pacoteId={reserva.pacoteViagem.id} onAvaliacaoSubmit={fetchData} />
                    )}
                  </div>
                )
              })
            ) : <p className="text-gray-500">Nenhuma viagem anterior.</p>}
          </section>
        )}

        {!loading && !error && activeTab === 'avaliacoes' && (
          <section role="tabpanel" aria-labelledby="tab-avaliacoes">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Suas Avaliações</h2>
            {avaliacoes.length > 0 ? (
              avaliacoes.map((avaliacao) => (
                <div key={avaliacao.id} className="bg-white rounded-xl shadow-md p-5 mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg">{avaliacao.pacote.destino}</h3>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <CalendarDays size={14} className="mr-2" aria-hidden="true" />
                        <span>Enviada em: {formatarData(avaliacao.dataCriacao)}</span>
                      </div>
                      <span className={`mt-2 inline-block px-3 py-1 text-xs font-semibold rounded-full ${avaliacao.status === 'PENDENTE' ? 'text-yellow-800 bg-yellow-200' : 'text-green-800 bg-green-200'}`}>
                        {avaliacao.status}
                      </span>
                    </div>
                    <StarRating rating={avaliacao.nota} />
                  </div>
                  <div className="flex items-start mt-4 text-gray-600">
                    <MessageSquareText size={16} className="mr-2 mt-1 flex-shrink-0" aria-hidden="true" />
                    <p className="italic">"{avaliacao.comentario}"</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Você ainda não enviou nenhuma avaliação.</p>
            )}
          </section>
        )}

        {!loading && !error && activeTab === 'perfil' && (
          <div className="mt-6 space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
              <div className="mb-4">
                  {(perfilError || senhaError) && (
                      <FeedbackMessage message={perfilError || senhaError} type="error" />
                  )}
                  {!(perfilError || senhaError) && (perfilSuccess || senhaSuccess) && (
                      <FeedbackMessage message={perfilSuccess || senhaSuccess} type="status" />
                  )}
              </div>
              <form onSubmit={handlePerfilSubmit}>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Meu Perfil</h2>
                <div className="mb-4">
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                  <input type="text" id="nome" value={nome} onChange={(e) => setNome(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required aria-required="true" />
                </div>
                <div className="mb-4">
                  <label htmlFor="documento" className="block text-sm font-medium text-gray-700">Documento</label>
                  <input type="text" id="documento" value={formatarCpf(documento || user?.documento || '')} placeholder={!user?.documento ? 'Documento será carregado quando disponível' : ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed" disabled aria-describedby="documento-desc"/>
                  <p id="documento-desc" className="mt-1 text-xs text-gray-500">Este campo não pode ser alterado. Entre em contato com o suporte se precisar de ajuda.</p>
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" required aria-required="true" />
                </div>
                <div className="mb-4">
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">Telefone</label>
                  <input type="tel" id="telefone" value={telefone} onChange={(e) => setTelefone(formatarTelefone(e.target.value))} placeholder="Adicione seu telefone" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>
                <fieldset className="mt-8 border-t pt-4">
                  <legend className="text-xl font-semibold text-gray-800 mb-4">Alterar Senha</legend>
                  <div className="mb-4 relative">
                    <label htmlFor="senhaAtual" className="block text-sm font-medium text-gray-700">Senha Atual</label>
                    <input type={showSenhaAtual ? 'text' : 'password'} id="senhaAtual" value={senhaAtual} onChange={(e) => setSenhaAtual(e.target.value)} placeholder="Digite sua senha atual para alterar" className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" autoComplete="current-password" />
                    <button type="button" onClick={() => setShowSenhaAtual(!showSenhaAtual)} className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6 text-gray-500 hover:text-gray-700" aria-label={showSenhaAtual ? "Esconder a senha atual" : "Mostrar a senha atual"}>
                      {showSenhaAtual ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="mb-4 relative">
                    <label htmlFor="novaSenha" className="block text-sm font-medium text-gray-700">Nova Senha</label>
                    <input type={showNovaSenha ? 'text' : 'password'} id="novaSenha" value={novaSenha} onChange={(e) => setNovaSenha(e.target.value)} placeholder="Digite a nova senha" className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" autoComplete="new-password" />
                    <button type="button" onClick={() => setShowNovaSenha(!showNovaSenha)} className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6 text-gray-500 hover:text-gray-700" aria-label={showNovaSenha ? "Esconder a nova senha" : "Mostrar a nova senha"}>
                      {showNovaSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <div className="mb-4 relative">
                    <label htmlFor="confirmarNovaSenha" className="block text-sm font-medium text-gray-700">Confirmar Nova Senha</label>
                    <input type={showConfirmarNovaSenha ? 'text' : 'password'} id="confirmarNovaSenha" value={confirmarNovaSenha} onChange={(e) => setConfirmarNovaSenha(e.target.value)} className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" autoComplete="new-password" />
                    <button type="button" onClick={() => setShowConfirmarNovaSenha(!showConfirmarNovaSenha)} className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6 text-gray-500 hover:text-gray-700" aria-label={showConfirmarNovaSenha ? "Esconder a confirmação da nova senha" : "Mostrar a confirmação da nova senha"}>
                      {showConfirmarNovaSenha ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </fieldset>
                <button type="submit" disabled={isPerfilSubmitting} className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300">
                  {isPerfilSubmitting ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <div className="mt-12 p-4 bg-gray-100 rounded-lg text-center">
        <p className="text-sm text-gray-600">Precisa alterar seus dados? <a href="/suporte" className="font-semibold text-indigo-600 hover:underline">Fale com o suporte</a>.</p>
      </div>
      {modalAberta && <ModalDetalhesReservas reserva={reservaSelecionada} onClose={fecharModal} />}
    </div>
  );
}
