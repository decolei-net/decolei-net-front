import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Plane } from 'lucide-react';

// Nossos imports customizados
import authService from '../../services/authService'; // Verifique o caminho
import { loginSuccess } from '../../store/authSlice'; // Verifique o caminho

export default function Login() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro(''); // Limpa erros anteriores

        if (!email || !senha) {
            setErro('Por favor, preencha todos os campos.');
            return;
        }

        try {
            // 1. Chama o serviço de autenticação
            const data = await authService.login({ email, senha });

            // 2. Despacha a ação de sucesso para o Redux
            dispatch(loginSuccess({ token: data.token }));
            
            // 3. Pega a role do usuário a partir do token decodificado
            // (O authSlice já decodificou e salvou no localStorage)
            const storedUser = JSON.parse(localStorage.getItem('user'));
            const userRole = storedUser?.role;

            // 4. Redirecionamento Inteligente com base na Role
            switch (userRole) {
                case 'ADMIN':
                    navigate('/dashboard-admin');
                    break;
                case 'ATENDENTE':
                    navigate('/dashboard-atendente');
                    break;
                case 'CLIENTE':
                    navigate('/dashboard-cliente');
                    break;
                default:
                    // Se a role for desconhecida, vai para uma página padrão
                    navigate('/'); 
            }

        } catch (error) {
            console.error("Erro no login:", error);
            setErro('Email ou senha inválidos. Tente novamente.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md">
                
                {/* Cabeçalho do Formulário */}
                <div className="text-center">
                    <Plane className="mx-auto h-12 w-auto text-blue-500" />
                    <h2 className="mt-4 text-3xl font-extrabold text-gray-900">
                        Login
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Faça sua reserva conosco!
                    </p>
                </div>

                {/* Formulário */}
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
                    <div>
                        <label htmlFor="senha" className="sr-only">Senha</label>
                        <input
                            id="senha"
                            name="senha"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Senha"
                        />
                    </div>

                    {erro && <p className="text-sm text-red-600 text-center">{erro}</p>}

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
                    ou <Link to="/cadastro" className="font-medium text-blue-600 hover:text-blue-500">
                        Cadastre-se
                    </Link>
                </p>
            </div>
        </div>
    );
}