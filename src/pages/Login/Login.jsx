import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Eye, EyeOff } from 'lucide-react';

// Importando a sua imagem
import logoImage from '../../assets/decolei.png'; // Ajuste o caminho se necessário

import authService from '../../services/authService.js';
import { loginSuccess } from '../../store/authSlice.js';

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const [showPassword, setShowPassword] = useState(false);

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
            dispatch(loginSuccess({ token: data.token, user: data.user })); // Passando o usuário também

            // Com o usuário no state, podemos pegar o role diretamente
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
            console.error("Erro no login:", error);
            // ✅ Mensagem de erro específica e amigável
            setErro('Usuário ou senha inválidos. Verifique seus dados e tente novamente.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md">

                <div className="text-center">
                    <img src={logoImage} alt="Logo Decolei.net" className="mx-auto h-12 w-auto" />
                    <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
                        Login
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Faça sua reserva conosco!
                    </p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Email"
                        />
                    </div>

                    <div className="relative">
                        <label htmlFor="senha" className="sr-only">Senha</label>
                        <input
                            id="senha"
                            name="senha"
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            required
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Senha"
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

                    {/* A mensagem de erro aparecerá aqui */}
                    {erro && <p className="text-sm text-red-600 text-center font-medium">{erro}</p>}

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Login
                        </button>
                    </div>
                </form>

                <p className="text-xs text-center text-gray-500">
                    Não tem uma conta?{' '}
                    <Link to="/cadastro" className="font-medium text-blue-600 hover:text-blue-500">
                        Cadastre-se
                    </Link>
                </p>
            </div>
        </div>
    );
}
