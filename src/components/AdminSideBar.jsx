import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice'; // Verifique o caminho do seu slice

// Ícones que vamos usar
import { 
    LayoutDashboard, 
    Package, 
    CalendarCheck, 
    Users, 
    Star,
    LogOut,
    Menu, // Ícone de Hamburguer
    X     // Ícone de Fechar
} from 'lucide-react';

// Itens do menu com caminhos e a correção para o "Painel"
const adminMenuItems = [
    // A propriedade "end" aqui resolve o bug do link sempre ativo.
    { label: 'Painel',      icon: <LayoutDashboard size={20} />, path: '/dashboard-admin', end: true },
    // Corrigindo o caminho do painel que tinha um 'a' a mais
    { label: 'Pacotes',     icon: <Package size={20} />,         path: '/dashboard-admin/pacotes' }, 
    // Corrigindo caminhos para o padrão que definimos
    { label: 'Reservas',    icon: <CalendarCheck size={20} />,   path: '/dashboard-admin/reservas' }, 
    { label: 'Usuários',    icon: <Users size={20} />,           path: '/dashboard-admin/usuarios' }, 
    { label: 'Avaliações',  icon: <Star size={20} />,            path: '/dashboard-admin/avaliacoes' }
];

export default function AdminSidebar() {
    const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };
    
    // Estilo para os links da sidebar de DESKTOP
    const desktopNavLinkStyle = ({ isActive }) =>
        `flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
            isActive ? 'bg-blue-600 text-white font-semibold' : 'text-gray-400 hover:bg-gray-700 hover:text-white'
        }`;
    
    // Estilo para os links do dropdown de MOBILE
    const mobileNavLinkStyle = ({ isActive }) =>
        `block px-4 py-2 text-base rounded-md ${
            isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700'
        }`;

    return (
        // O container principal se adapta. No desktop (lg), é uma sidebar. No mobile, é um header.
        <aside className="bg-gray-900 text-gray-200 lg:w-64 lg:h-screen lg:flex-shrink-0 lg:flex-col lg:sticky lg:top-0 z-20">
            
            {/* ********** VERSÃO DESKTOP (Visível em 'lg' e acima) ********** */}
            <div className="hidden lg:flex lg:flex-col h-full p-4">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white text-center">Painel Admin</h1>
                </div>
                <nav className="flex-grow">
                    <ul className="space-y-2">
                        {adminMenuItems.map((item) => (
                            <li key={item.path}>
                                <NavLink to={item.path} className={desktopNavLinkStyle} end={item.end}>
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

            {/* ********** VERSÃO MOBILE (Visível abaixo de 'lg') ********** */}
            <div className="lg:hidden p-4">
                {/* A barra superior do mobile */}
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold text-white">Painel Admin</h1>
                    <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* O menu dropdown que abre e fecha */}
                {isMobileMenuOpen && (
                    <nav className="mt-4">
                        <ul className="space-y-1">
                            {adminMenuItems.map((item) => (
                                <li key={item.path}>
                                    <NavLink 
                                      to={item.path} 
                                      className={mobileNavLinkStyle} 
                                      end={item.end} 
                                      onClick={() => setMobileMenuOpen(false)} // Fecha o menu ao clicar
                                    >
                                        {item.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                        <div className="pt-4 mt-4 border-t border-gray-700">
                            <button
                                onClick={handleLogout}
                                className="flex items-center w-full space-x-3 p-3 rounded-lg text-red-400 hover:bg-gray-700 hover:text-white"
                            >
                                <LogOut size={20} />
                                <span className="font-semibold">Sair</span>
                            </button>
                        </div>
                    </nav>
                )}
            </div>
        </aside>
    );
}