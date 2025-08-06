import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Eye,
  EyeOff,
  User,
  FileText,
  Phone,
  Mail,
  Lock,
  UserPlus,
  AlertCircle,
} from 'lucide-react';
import logoImage from '../../assets/decolei.png'; // Verifique o caminho para o seu logo

import usuarioService from '../../services/usuarioService.js';
import authService from '../../services/authService.js';
import { loginSuccess } from '../../store/authSlice.js';

export default function Cadastro() {
  const [nome, setNome] = useState('');
  const [documento, setDocumento] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erro, setErro] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDocumentoChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    setDocumento(rawValue);
  };
  const handleTelefoneChange = (e) => {
    let rawValue = e.target.value.replace(/\D/g, '');
    if (rawValue.length > 11) rawValue = rawValue.slice(0, 11);
    setTelefone(rawValue);
  };
  const formatCPF = (cpf) => {
    return cpf
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .substring(0, 14);
  };
  const formatTelefone = (tel) => {
    if (tel.length <= 10)
      return tel
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .substring(0, 14);
    return tel
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substring(0, 15);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem. Verifique e tente novamente.');
      return;
    }

    const payload = { nome, email, senha, documento, telefone };

    try {
      await usuarioService.registrarUsuario(payload);

      // Após o cadastro bem-sucedido, faz o login automaticamente
      const data = await authService.login({ email, senha });
      dispatch(loginSuccess({ token: data.token, user: data.user }));

      // Redireciona para a página principal do cliente
      navigate('/home');
    } catch (error) {
      console.error('Erro no cadastro:', error.response);
      const serverError =
        error.response?.data?.erro || 'Ocorreu um erro ao tentar realizar o cadastro.';

      // ✅ Lógica para mensagens de erro específicas
      if (serverError.toLowerCase().includes('email')) {
        setErro('Este e-mail já está em uso. Por favor, tente outro ou faça login.');
      } else if (
        serverError.toLowerCase().includes('documento') ||
        serverError.toLowerCase().includes('cpf')
      ) {
        setErro('Este CPF já possui um cadastro. Tente fazer login ou verifique o número.');
      } else {
        setErro('Não foi possível realizar o cadastro. Verifique os dados e tente novamente.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Card principal */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header compacto */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 px-6 py-5 text-center relative overflow-hidden">
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
              <h2 className="text-xl font-black text-white mb-1">Crie sua Conta</h2>
              <p className="text-blue-100 text-sm">É rápido e fácil. Vamos começar?</p>
            </div>
          </div>

          {/* Conteúdo do formulário */}
          <div className="p-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              {/* Primeira linha: Nome completo (span completo) */}
              <div>
                <label htmlFor="nome" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={18} className="text-gray-400" />
                  </div>
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500"
                    placeholder="Seu nome completo"
                  />
                </div>
              </div>

              {/* Segunda linha: CPF e Telefone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="documento" className="block text-sm font-semibold text-gray-700 mb-2">
                    CPF
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="documento"
                      name="documento"
                      type="text"
                      required
                      value={formatCPF(documento)}
                      onChange={handleDocumentoChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500"
                      placeholder="000.000.000-00"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="telefone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Telefone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="telefone"
                      name="telefone"
                      type="text"
                      required
                      value={formatTelefone(telefone)}
                      onChange={handleTelefoneChange}
                      className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500"
                      placeholder="(00) 00000-0000"
                    />
                  </div>
                </div>
              </div>

              {/* Terceira linha: Email (span completo) */}
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
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              {/* Quarta linha: Senha e Confirmar Senha */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                      required
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500"
                      placeholder="Senha segura"
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

                <div>
                  <label htmlFor="confirmarSenha" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirmar Senha
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-gray-400" />
                    </div>
                    <input
                      id="confirmarSenha"
                      name="confirmarSenha"
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-gray-800 placeholder-gray-500"
                      placeholder="Repita a senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors duration-300"
                      aria-label="Mostrar ou esconder a confirmação da senha"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Erro */}
              {erro && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-3">
                  <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{erro}</p>
                </div>
              )}

              {/* Botão */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-[1.02]"
                >
                  <UserPlus size={18} />
                  Criar Conta
                </button>
              </div>
            </form>

            {/* Link para login */}
            <div className="mt-6 pt-4 border-t border-gray-100 text-center">
              <p className="text-gray-600 text-sm">
                Já tem uma conta?{' '}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-300"
                >
                  Faça login
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer com benefícios */}
        <div className="mt-6 text-center">
          <div className="flex justify-center items-center gap-6 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
              <span>100% Gratuito</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              <span>Dados Protegidos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
