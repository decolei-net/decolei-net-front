import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

// Ícones que vamos usar
import { 
    LayoutDashboard, 
    Package, 
    CalendarCheck, 
    Users, 
    Star,
    LogOut,
    Home
} from 'lucide-react';

// Itens do menu com caminhos
const adminMenuItems = [
    { label: 'Home', icon: <Home size={20} />, path: '/home', end: true },
    { label: 'Painel', icon: <LayoutDashboard size={20} />, path: '/dashboard-admin', end: true },
    { label: 'Pacotes', icon: <Package size={20} />, path: '/dashboard-admin/pacotes' },
    { label: 'Reservas', icon: <CalendarCheck size={20} />, path: '/dashboard-admin/reservas' },
    { label: 'Usuários', icon: <Users size={20} />, path: '/dashboard-admin/usuarios' },
    { label: 'Avaliações', icon: <Star size={20} />, path: '/dashboard-admin/avaliacoes' }
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
    
    // Estilo para os links da sidebar
    const navLinkStyle = ({ isActive }) =>
        `flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
            isActive ? 'bg-blue-600 text-white font-semibold' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
        }`;

    return (
        // Sidebar sempre lateral
        <aside className="bg-gray-900 text-gray-200 w-64 h-screen flex-shrink-0 flex flex-col z-20">
            
            {/* Conteúdo da sidebar */}
            <div className="flex flex-col h-full p-4">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white text-center">Painel Admin</h1>
                </div>
                
                <nav className="flex-grow">
                    <ul className="space-y-2">
                        {adminMenuItems.map((item) => (
                            <li key={item.path}>
                                <NavLink to={item.path} className={navLinkStyle} end={item.end}>
                                    {item.icon}
                                    <span className="font-medium">{item.label}</span>
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                </nav>
                
                <div className="pt-4 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="flex items-center w-full space-x-3 p-3 rounded-lg transition-colors duration-200 text-red-400 hover:bg-red-500 hover:text-white"
                    >
                        <LogOut size={20} />
                        <span className="font-semibold">Sair</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}