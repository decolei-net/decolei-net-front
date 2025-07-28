import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Plane, UserCircle, LogOut } from 'lucide-react';

// Importe sua ação de logout do slice do Redux
// import { logoutAction } from "../features/auth/authSlice";

export default function ClientNavbar() {
    // Busca o estado de autenticação do Redux
    // Assumimos que o usuário sempre estará logado se este componente for renderizado
    const { isLoggedIn, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const handleLogout = () => {
        // Descomente a linha abaixo quando tiver sua ação de logout
        // dispatch(logoutAction());
        console.log("Usuário deslogado!"); // Placeholder
    };

    // Uma boa prática: se por algum motivo o usuário não estiver logado
    // (ex: na própria página de login), o componente simplesmente não aparece.
    if (!isLoggedIn) {
        return null;
    }

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

                {/* Lado Direito: Ações do Usuário (Sempre logado) */}
                <div className="flex items-center space-x-4">
                    <Link to="/perfil" className="flex items-center space-x-2 hover:text-blue-300 transition-colors duration-200">
                        <UserCircle size={24} />
                        <span className="font-medium hidden sm:block">{user?.nomeCompleto || 'Meu Perfil'}</span>
                    </Link>
                    <button onClick={handleLogout} className="flex items-center space-x-2 p-2 rounded-md hover:bg-red-500 hover:text-white transition-colors duration-200">
                        <LogOut size={20} />
                        <span className="hidden sm:block">Sair</span>
                    </button>
                </div>
            </nav>
        </header>
    );
}