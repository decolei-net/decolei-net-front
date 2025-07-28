import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Plane, UserCircle, LogOut, LogIn, UserPlus } from 'lucide-react';

// Importe sua ação de logout do slice do Redux
// import { logoutAction } from "../features/auth/authSlice";

export default function ClientNavbar() {
    // Busca o estado de autenticação do Redux
    // Assumindo que seu slice 'auth' tem 'isLoggedIn' e 'user'
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleLogout = () => {
        // Descomente a linha abaixo quando tiver sua ação de logout
        // dispatch(logoutAction());
        console.log("Usuário deslogado!"); // Placeholder
    };

    return (
        <header className="bg-gray-800 bg-opacity-70 text-white shadow-md backdrop-blur-sm sticky top-0 z-50">
            <nav className="container mx-auto px-4 py-3 flex justify-between items-center">
                
                {/* Lado Esquerdo: Logo */}
                <Link to="/" className="flex items-center space-x-2">
                    <Plane className="text-blue-400" size={28} />
                    <span className="text-xl font-bold">Decolei.net</span>
                </Link>

                {/* Centro: Links de Navegação */}
                <div className="hidden md:flex items-center space-x-6">
                    <Link to="/" className="hover:text-blue-300 transition-colors duration-200">
                        Home
                    </Link>
                    <Link to="/suporte" className="hover:text-blue-300 transition-colors duration-200">
                        Suporte
                    </Link>
                </div>

                {/* Lado Direito: Ações do Usuário (Login/Logout) */}
                <div className="flex items-center space-x-4">
                    {isLoggedIn ? (
                        // -- Visão para usuário LOGADO --
                        <>
                            <Link to="/perfil" className="flex items-center space-x-2 hover:text-blue-300 transition-colors duration-200">
                                <UserCircle size={24} />
                                <span className="font-medium hidden sm:block">{user?.nomeCompleto || 'Meu Perfil'}</span>
                            </Link>
                            <button onClick={handleLogout} className="flex items-center space-x-2 p-2 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-200">
                                <LogOut size={20} />
                                <span className="hidden sm:block">Sair</span>
                            </button>
                        </>
                    ) : (
                        // -- Visão para usuário DESLOGADO --
                        <>
                            <Link to="/login" className="flex items-center space-x-2 p-2 rounded-md hover:bg-blue-600 transition-colors duration-200">
                                <LogIn size={20} />
                                <span>Login</span>
                            </Link>
                            <Link to="/cadastro" className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-400 transition-colors duration-200">
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