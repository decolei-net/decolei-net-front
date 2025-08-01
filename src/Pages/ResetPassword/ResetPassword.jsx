import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import authService from '../../services/authService';
import logoImage from '../../assets/decolei.png';

export default function ResetPassword() {
  // Estados para gerenciar a nova senha e a confirmação
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  // Estados para controlar a visibilidade das senhas
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Estados para gerenciar o feedback do usuário
  const [loading, setLoading] = useState(false); // Indica se a chamada de API está em andamento
  const [erro, setErro] = useState('');        // Armazena mensagens de erro
  const [sucesso, setSucesso] = useState('');    // Armazena mensagens de sucesso

  // Hooks do React Router para navegação e acesso aos parâmetros da URL
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Extrai o email e o token da URL, que são enviados pelo link do e-mail
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  // Efeito que é executado apenas uma vez quando o componente é montado.
  // Ele verifica se os parâmetros de email e token existem na URL.
  useEffect(() => {
    // Se o email ou o token não estiverem presentes, o link é inválido.
    // Exibe um erro e redireciona para a página de login após 3 segundos.
    if (!email || !token) {
      setErro('Link de redefinição inválido ou expirado.');
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [email, token, navigate]); // Dependências do useEffect

  // Handler para o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o comportamento padrão de recarregar a página
    
    // Limpa mensagens de estado anteriores
    setErro('');
    setSucesso('');
    setLoading(true);

    // Validação básica: verifica se as senhas são iguais
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem.');
      setLoading(false);
      return; // Interrompe a execução se houver erro
    }

    try {
      // Chama o método de redefinição de senha no authService,
      // passando os dados necessários para o backend.
      await authService.resetPassword({ email, token, novaSenha: senha });
      
      // Se a chamada for bem-sucedida, exibe uma mensagem de sucesso
      setSucesso('Senha redefinida com sucesso! Você será redirecionado para o login.');
      // Redireciona para a tela de login após 3 segundos
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      // Em caso de erro na chamada da API, exibe a mensagem de erro
      console.error('Erro ao redefinir a senha:', error);
      setErro('Não foi possível redefinir a senha. Tente novamente ou solicite um novo link.');
    } finally {
      // Independentemente do resultado, o estado de carregamento é desativado
      setLoading(false);
    }
  };

  // Renderização condicional: se o link for inválido, exibe a mensagem de erro
  if (!email || !token) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-semibold text-red-600">{erro}</p>
      </div>
    );
  }

  // Renderização principal do componente
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <img src={logoImage} alt="Logo Decolei.net" className="mx-auto h-12 w-auto" />
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
            Redefinir Senha
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Digite sua nova senha
          </p>
        </div>

        {/* Renderização condicional: Se houve sucesso, exibe a mensagem de sucesso. */}
        {/* Caso contrário, renderiza o formulário. */}
        {sucesso ? (
          <p className="text-sm text-green-600 text-center font-medium">{sucesso}</p>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="relative">
              <label htmlFor="senha" className="sr-only">Nova Senha</label>
              <input
                id="senha"
                name="senha"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nova Senha"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                aria-label="Mostrar ou esconder a senha"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            
            <div className="relative">
              <label htmlFor="confirmarSenha" className="sr-only">Confirmar Senha</label>
              <input
                id="confirmarSenha"
                name="confirmarSenha"
                type={showConfirmPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Confirmar Nova Senha"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                aria-label="Mostrar ou esconder a senha"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {erro && <p className="text-sm text-red-600 text-center font-medium">{erro}</p>}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? 'Redefinindo...' : 'Redefinir Senha'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}