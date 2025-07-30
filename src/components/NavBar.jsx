import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { UserCircle, LogOut, LogIn, UserPlus } from 'lucide-react';
import { logout } from '../store/authSlice';
import logoImage from '../assets/decolei.png';

export default function NavBar() {
    const { token, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    // Define o link principal com base no status de login
    const homeLink = token ? "/home" : "/";

    return (
        <header className="bg-gray-900 bg-opacity-80 text-white shadow-md backdrop-blur-sm sticky top-0 z-50">
            <nav className="container mx-auto px-6 py-3 flex justify-between items-center">

                {/* Lado Esquerdo: Logo */}
                {/* ✅ O link agora é dinâmico. Se logado, vai para /home. */}
                <Link to={homeLink} className="flex items-center space-x-3">
                    <img src={logoImage} alt="Decolei.net Logo" className="h-8 w-8" />
                    <span className="text-xl font-bold tracking-wider">Decolei.net</span>
                </Link>

                {/* Centro: Links de Navegação */}
                <div className="hidden md:flex items-center space-x-8">
                    {/* ✅ O link "Home" também é dinâmico. */}
                    <Link to={homeLink} className="text-gray-300 hover:text-white transition-colors duration-200">
                        Home
                    </Link>
                    {/* Apenas usuários logados veem o link de Suporte */}
                    {token && (
                      <Link to="/suporte" className="text-gray-300 hover:text-white transition-colors duration-200">
                          Suporte
                      </Link>
                    )}
                </div>

                {/* Lado Direito: Ações do Usuário */}
                <div className="flex items-center space-x-4">
                    {token && user ? (
                        // -- Visão para usuário LOGADO --
                        <>
                            <Link to="/minha-conta" className="flex items-center space-x-2 hover:text-gray-200 transition-colors duration-200">
                                <UserCircle size={24} />
                                <span className="font-medium hidden sm:block">{user.nomeCompleto}</span>
                            </Link>
                            <button onClick={handleLogout} className="flex items-center space-x-2 p-2 rounded-md hover:bg-red-600 transition-colors duration-200" title="Sair">
                                <LogOut size={20} />
                            </button>
                        </>
                    ) : (
                        // -- Visão para usuário DESLOGADO --
                        <>
                            <Link to="/login" className="flex items-center space-x-2 p-2 rounded-md hover:bg-blue-600 transition-colors duration-200">
                                <LogIn size={20} />
                                <span>Login</span>
                            </Link>
                            <Link to="/cadastro" className="hidden sm:flex items-center space-x-2 px-3 py-2 rounded-md bg-blue-500 hover:bg-blue-400 transition-colors duration-200">
                                <UserPlus size={20} />
                                <span>Cadastre-se</span>
                            </Link>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}
