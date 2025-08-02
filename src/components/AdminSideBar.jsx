import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from '../store/authSlice';

// Importando os ícones
import { 
    LayoutDashboard, 
    Package, 
    CalendarCheck, 
    Users, 
    Star,
    LogOut
} from 'lucide-react';

// Itens do menu com os caminhos corretos
const adminMenuItems = [
    { label: 'Painel',      icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' }, 
    { label: 'Pacotes',     icon: <Package size={20} />,         path: '/admin/pacotes'   }, 
    { label: 'Reservas',    icon: <CalendarCheck size={20} />,   path: '/admin/reservas'  }, 
    { label: 'Usuários',    icon: <Users size={20} />,           path: '/admin/usuarios'  }, 
    { label: 'Avaliações',  icon: <Star size={20} />,            path: '/admin/avaliacoes'}
];

export default function AdminSidebar() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };
    
    // Estilo dinâmico para o NavLink (link ativo/inativo)
    const navLinkStyle = ({ isActive }) =>
        `flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
            isActive 
                ? 'bg-blue-600 text-white font-semibold' 
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
        }`;

    return (
        <aside className="w-64 flex-shrink-0 bg-gray-900 text-gray-200 h-screen p-4 flex flex-col">
            {/* Cabeçalho */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-white text-center">Painel Admin</h1>
            </div>

            {/* Navegação Principal */}
            <nav className="flex-grow">
                <ul className="space-y-2">
                    {adminMenuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink to={item.path} className={navLinkStyle}>
                                {item.icon}
                                <span className="font-medium">{item.label}</span>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Rodapé com Logout */}
            <div className="pt-4 border-t border-gray-700">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full space-x-3 p-3 rounded-lg transition-colors duration-200 text-red-400 hover:bg-red-500 hover:text-white"
                >
                    <LogOut size={20} />
                    <span className="font-semibold">Sair</span>
                </button>
            </div>
        </aside>
    );
}