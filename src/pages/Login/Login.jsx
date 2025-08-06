import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff, Mail, Lock, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';

// Importando a sua imagem
import logoImage from '../../assets/decolei.png'; // Ajuste o caminho se necessário

// Importando o authService, que agora contém o método forgotPassword
import authService from '../../services/authService';
import { loginSuccess } from '../../store/authSlice.js';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // NOVOS ESTADOS PARA A FUNCIONALIDADE DE REDEFINIR SENHA
  const [isForgotPasswordMode, setIsForgotPasswordMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');
  const [resetError, setResetError] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!email || !senha) {
      setErro('Por favor, preencha todos os campos.');
      return;
    }

    try {
      const data = await authService.login({ email, senha });
      dispatch(loginSuccess({ token: data.token, user: data.user }));

      const userRole = data.user?.role;

      switch (userRole) {
        case 'ADMIN':
          navigate('/dashboard-admin');
          break;
        case 'ATENDENTE':
          navigate('/dashboard-atendente');
          break;
        case 'CLIENTE':
          navigate('/home');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      setErro('Usuário ou senha inválidos. Verifique seus dados e tente novamente.');
    }
  };

  // NOVO HANDLER PARA ENVIAR O EMAIL DE REDEFINIÇÃO
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setResetSuccessMessage('');
    setResetError('');

    if (!resetEmail) {
      setResetError('Por favor, digite seu email.');
      return;
    }

    try {
      await authService.forgotPassword({ email: resetEmail });
      setResetSuccessMessage(
        'Se um usuário com este email for encontrado, um link de redefinição de senha foi enviado. Verifique sua caixa de entrada.',
      );
      setResetEmail(''); // Limpa o campo de email
    } catch (error) {
      console.error('Erro ao enviar email de redefinição:', error);
      setResetError('Não foi possível enviar o email. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card principal */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header com gradiente */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-6 py-6 text-center relative overflow-hidden">
            {/* Pattern de fundo */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                  backgroundSize: '30px 30px',
                }}
              ></div>
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-full mb-3">
                <img src={logoImage} alt="Logo Decolei.net" className="h-6 w-auto" />
              </div>
              <h2 className="text-xl font-black text-white mb-1">
                {isForgotPasswordMode ? 'Recuperar Senha' : 'Fazer Login'}
              </h2>
              <p className="text-blue-100 text-xs">
                {isForgotPasswordMode
                  ? 'Digite seu email para receber as instruções'
                  : 'Acesse sua conta e continue sua jornada'}
              </p>
            </div>
          </div>

          {/* Conteúdo do formulário */}
          <div className="p-6">
            {isForgotPasswordMode ? (
              // FORMULÁRIO DE RECUPERAR SENHA
              <form className="space-y-5" onSubmit={handleForgotPassword}>
                <div>
                  <label
                    htmlFor="reset-email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="reset-email"
                      name="resetEmail"
                      type="email"
                      autoComplete="email"
                      required
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500"
                      placeholder="Digite seu email"
                    />
                  </div>
                </div>

                {resetError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{resetError}</p>
                  </div>
                )}

                {resetSuccessMessage && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
                    <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                    <p className="text-green-700 text-sm">{resetSuccessMessage}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Mail size={18} />
                  Enviar Link
                </button>

                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordMode(false)}
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300 text-sm"
                  >
                    ← Voltar para o Login
                  </button>
                </div>
              </form>
            ) : (
              // FORMULÁRIO DE LOGIN MODERNO
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500"
                      placeholder="Digite seu email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="senha" className="block text-sm font-semibold text-gray-700 mb-2">
                    Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="senha"
                      name="senha"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500"
                      placeholder="Digite sua senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                      aria-label="Mostrar ou esconder a senha"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordMode(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300"
                  >
                    Esqueceu a senha?
                  </button>
                </div>

                {erro && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                    <p className="text-red-700 text-sm">{erro}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                >
                  Entrar
                  <ArrowRight size={18} />
                </button>
              </form>
            )}

            {/* Link para cadastro - só aparece no modo login */}
            {!isForgotPasswordMode && (
              <div className="mt-6 pt-4 border-t border-gray-100 text-center">
                <p className="text-gray-600 text-sm">
                  Não tem uma conta?{' '}
                  <Link
                    to="/cadastro"
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300"
                  >
                    Cadastre-se gratuitamente
                  </Link>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer com benefícios */}
        <div className="mt-6 text-center">
          <div className="flex justify-center items-center gap-6 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <span>Seguro e Confiável</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>Suporte 24/7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
