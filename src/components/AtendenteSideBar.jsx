import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

// Importando os ícones que vamos usar
import {
  ChartPieIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ArrowLeftOnRectangleIcon,
  HomeIcon,
} from '@heroicons/react/24/solid';

const AtendenteSideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  const linkStyle = ({ isActive }) =>
    `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group ${
      isActive
        ? 'bg-blue-50 text-blue-600 font-bold'
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <aside className="flex flex-col h-screen bg-white w-72 p-6 border-r border-gray-100">
      {/* Cabeçalho */}
      <div className="mb-10 text-left">
        <h1 className="text-3xl font-black text-blue-600">Decolei.</h1>
        <p className="text-sm text-gray-400 -mt-1">Painel do Atendente</p>
      </div>

      {/* Navegação */}
      <nav className="flex flex-col gap-3 flex-grow">
        {/* ✅ Botão Home */}
        <NavLink to="/" end className={linkStyle}>
          <HomeIcon className="h-6 w-6" />
          <span>Home</span>
        </NavLink>

        <NavLink to="/dashboard-atendente" end className={linkStyle}>
          <ChartPieIcon className="h-6 w-6" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/dashboard-atendente/buscar-cliente" className={linkStyle}>
          <MagnifyingGlassIcon className="h-6 w-6" />
          <span>Buscar Clientes</span>
        </NavLink>
        <NavLink to="/dashboard-atendente/reservas-recentes" className={linkStyle}>
          <DocumentTextIcon className="h-6 w-6" />
          <span>Reservas</span>
        </NavLink>
      </nav>

      {/* Rodapé com botão logout */}
      <div className="pt-6 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-4 px-4 py-3 rounded-xl text-gray-500 transition-all duration-300 group hover:bg-red-50 hover:text-red-600"
        >
          <ArrowLeftOnRectangleIcon className="h-6 w-6" />
          <span className="font-semibold">Sair</span>
        </button>
      </div>
    </aside>
  );
};

export default AtendenteSideBar;
