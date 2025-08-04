import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// Importação de ícones de Heroicons foi removida
import {
  // Ícones do AdminSidebar
  Home,
  LayoutDashboard,
  Search,
  FileText,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { logout } from '../store/authSlice';
// A importação do logo foi removida pois o AdminSidebar usa um título de texto
// import logoDecolei from '../assets/decolei.png';

// Mapeamento dos itens de menu com os novos ícones do lucide-react
const menuItems = [
  { label: 'Home', icon: <Home size={20} />, path: '/home', end: true },
  { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard-atendente' },
  { label: 'Buscar Clientes', icon: <Search size={20} />, path: '/dashboard-atendente/buscar-cliente' },
  { label: 'Reservas', icon: <FileText size={20} />, path: '/dashboard-atendente/reservas-recentes' },
];

export default function AtendenteSideBar() {
  const [menuAberto, setMenuAberto] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const toggleMenu = () => setMenuAberto((prev) => !prev);
  
  // Estilo para os links da sidebar de DESKTOP
  const navLinkStyle = ({ isActive }) =>
    clsx(
      'flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200',
      isActive
        ? 'bg-blue-600 text-white font-semibold'
        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
    );

  // Estilo para os links do dropdown de MOBILE
  const mobileNavLinkStyle = ({ isActive }) =>
    clsx(
      'block px-4 py-2 text-base rounded-md',
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-300 hover:bg-gray-700'
    );

  return (
    <>
      {/* Container principal para DESKTOP, agora com as classes de estilo do Admin */}
      <aside className="hidden lg:flex lg:flex-col bg-gray-900 text-gray-200 w-64 h-screen p-4 flex-shrink-0 sticky top-0 z-20">
        <div className="mb-8">
            <h1 className="text-2xl font-bold text-white text-center">Painel Atendente</h1>
        </div>

        <nav className="flex-grow flex flex-col gap-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={navLinkStyle}
              end={item.end}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
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
      </aside>

      {/* ********** VERSÃO MOBILE ********** */}
      <div className="lg:hidden bg-gray-900 text-gray-200 p-4">
        {/* A barra superior do mobile */}
        <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold text-white">Painel Atendente</h1>
            <button onClick={toggleMenu} className="text-white">
                {menuAberto ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>

        {/* O menu dropdown que abre e fecha */}
        {menuAberto && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 bg-black bg-opacity-70 z-50 lg:hidden"
                onClick={toggleMenu}
            >
                <div className="bg-gray-900 w-64 p-4 h-full shadow-lg" onClick={(e) => e.stopPropagation()}>
                    <h1 className="text-xl font-bold text-white mb-6">Painel Atendente</h1>
                    <nav className="mt-4">
                        <ul className="space-y-1">
                            {menuItems.map((item) => (
                                <li key={item.path}>
                                    <NavLink 
                                        to={item.path} 
                                        className={mobileNavLinkStyle} 
                                        end={item.end} 
                                        onClick={toggleMenu}
                                    >
                                        {item.label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                        <div className="pt-4 mt-4 border-t border-gray-700">
                            <button
                                onClick={() => {
                                    toggleMenu();
                                    handleLogout();
                                }}
                                className="flex items-center w-full space-x-3 p-3 rounded-lg text-red-400 hover:bg-gray-700 hover:text-white"
                            >
                                <LogOut size={20} />
                                <span className="font-semibold">Sair</span>
                            </button>
                        </div>
                    </nav>
                </div>
            </motion.div>
        )}
      </div>
    </>
  );
}