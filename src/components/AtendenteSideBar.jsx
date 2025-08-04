import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  ChartPieIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ArrowLeftOnRectangleIcon,
  HomeIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { logout } from '../store/authSlice';
import logoDecolei from '../assets/decolei.png';

const menuItems = [
  { label: 'Home', icon: <HomeIcon className="h-5 w-5" />, path: '/home' },
  { label: 'Dashboard', icon: <ChartPieIcon className="h-5 w-5" />, path: '/dashboard-atendente' },
  { label: 'Buscar Clientes', icon: <MagnifyingGlassIcon className="h-5 w-5" />, path: '/dashboard-atendente/buscar-cliente' },
  { label: 'Reservas', icon: <DocumentTextIcon className="h-5 w-5" />, path: '/dashboard-atendente/reservas-recentes' },
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

  return (
    <>
      {/* Mobile Header */}
      <div className="sm:hidden bg-[rgb(0,84,161)] text-white p-4 flex justify-between items-center">
        <img src={logoDecolei} alt="Decolei Logo" className="h-8 object-contain" />
        <button onClick={toggleMenu}>
          {menuAberto ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
        </button>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden sm:flex flex-col bg-[#0c1429] w-64 h-screen p-6 shadow-md text-white">
        <img
          src={logoDecolei}
          alt="Decolei Logo"
          className="h-8 object-contain mb-6"
        />
        <p className="text-sm text-white italic mb-6">Perfil: Atendente</p>

        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium border-b border-[#1a2238]',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                )
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900 hover:text-white rounded-md transition"
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
          <span>Sair</span>
        </button>
      </aside>

      {/* Mobile Menu Overlay */}
      {menuAberto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-70 z-50 sm:hidden"
          onClick={toggleMenu}
        >
          <div className="bg-[#0c1429] w-64 p-6 h-full shadow-lg text-white" onClick={(e) => e.stopPropagation()}>
            <img src={logoDecolei} alt="Decolei Logo" className="h-8 object-contain mb-6" />
            <p className="text-sm text-white italic mb-6">Perfil: Atendente</p>

            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={toggleMenu}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium border-b border-[#1a2238]',
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white'
                    )
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            <button
              onClick={() => {
                toggleMenu();
                handleLogout();
              }}
              className="mt-10 flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-900 hover:text-white rounded-md transition"
            >
              <ArrowLeftOnRectangleIcon className="h-5 w-5" />
              <span>Sair</span>
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}
