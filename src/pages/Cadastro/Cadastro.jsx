import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff } from 'lucide-react';
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
        return cpf.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})/, '$1-$2').substring(0, 14);
    };
    const formatTelefone = (tel) => {
        if (tel.length <= 10) return tel.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2').substring(0, 14);
        return tel.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2').substring(0, 15);
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
            console.error("Erro no cadastro:", error.response);
            const serverError = error.response?.data?.erro || "Ocorreu um erro ao tentar realizar o cadastro.";

            // ✅ Lógica para mensagens de erro específicas
            if (serverError.toLowerCase().includes('email')) {
                setErro('Este e-mail já está em uso. Por favor, tente outro ou faça login.');
            } else if (serverError.toLowerCase().includes('documento') || serverError.toLowerCase().includes('cpf')) {
                setErro('Este CPF já possui um cadastro. Tente fazer login ou verifique o número.');
            } else {
                setErro('Não foi possível realizar o cadastro. Verifique os dados e tente novamente.');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <div className="text-center">
                    <img src={logoImage} alt="Logo Decolei.net" className="mx-auto h-12 w-auto" />
                    <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Crie sua Conta</h2>
                    <p className="mt-2 text-sm text-gray-600">É rápido e fácil. Vamos começar?</p>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <input name="nome" type="text" required value={nome} onChange={(e) => setNome(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Nome Completo" />
                    </div>
                    
                    <div>
                        <input name="documento" type="text" required value={formatCPF(documento)} onChange={handleDocumentoChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="CPF" />
                    </div>

                    <div>
                        <input name="telefone" type="text" required value={formatTelefone(telefone)} onChange={handleTelefoneChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Telefone (com DDD)" />
                    </div>
                    
                    <div>
                        <input name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Seu melhor e-mail" />
                    </div>
                    
                    <div className="relative">
                        <input name="senha" type={showPassword ? 'text' : 'password'} required value={senha} onChange={(e) => setSenha(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Crie uma senha" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <div className="relative">
                        <input name="confirmarSenha" type={showConfirmPassword ? 'text' : 'password'} required value={confirmarSenha} onChange={(e) => setConfirmarSenha(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Confirme a senha" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    {erro && <p className="text-sm text-red-600 text-center font-medium">{erro}</p>}
                    
                    <div>
                        <button type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            Registrar e Acessar
                        </button>
                    </div>
                </form>

                <p className="text-xs text-center text-gray-500">
                    Já tem uma conta?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Faça login
                    </Link>
                </p>
            </div>
        </div>
    );
}
