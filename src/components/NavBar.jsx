// src/components/NavBar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { UserCircle, LogOut, LogIn, UserPlus, Menu, X, Home, HeadphonesIcon } from 'lucide-react';
import { logout } from '../store/authSlice';
import { useNotifications } from '../hooks/useNotifications';
import NotificationDropdown from './NotificationDropdown';
import logoImage from '../assets/decolei.png';

export default function NavBar() {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Hook de notificações
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setIsMenuOpen(false);
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  const homeLink = token ? '/home' : '/';

  return (
    <header className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-800 backdrop-blur-lg bg-opacity-95 text-white shadow-2xl sticky top-0 z-50 border-b border-white/10">
      <nav className="container mx-auto px-6 py-3">
        <div className="flex justify-between items-center h-12">
          {/* Esquerda: Logo */}
          <Link to={homeLink} onClick={handleLinkClick} className="flex items-center group">
            <div className="relative">
              <img
                src={logoImage}
                alt="DecoleiNet Logo"
                className="h-8 w-auto transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
            </div>
          </Link>

          {/* Centro: Links de Navegação (Desktop) */}
          <div className="hidden lg:flex items-center justify-center flex-1 max-w-md mx-8">
            <div className="flex items-center space-x-1 bg-white/5 rounded-xl px-2 py-1">
              <Link
                to={homeLink}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium text-sm"
              >
                <Home size={16} />
                Home
              </Link>
              {token && (
                <Link
                  to="/suporte"
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium text-sm"
                >
                  <HeadphonesIcon size={16} />
                  Suporte
                </Link>
              )}
              <Link
                to="/minha-conta"
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium text-sm"
              >
                <UserCircle size={16} />
                Perfil
              </Link>
            </div>
          </div>

          {/* Direita: Ações do Usuário (Desktop) */}
          <div className="hidden lg:flex items-center space-x-3">
            {token && user ? (
              <div className="flex items-center gap-3">
                {/* Componente de Notificações */}
                <NotificationDropdown
                  notifications={notifications}
                  unreadCount={unreadCount}
                  onMarkAsRead={markAsRead}
                  onMarkAllAsRead={markAllAsRead}
                />

                {/* Botão Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/30 hover:text-white transition-all duration-300 font-medium text-sm"
                  title="Sair"
                >
                  <LogOut size={16} />
                  Sair
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Notificações para visitantes */}
                <NotificationDropdown
                  notifications={notifications}
                  unreadCount={unreadCount}
                  onMarkAsRead={markAsRead}
                  onMarkAllAsRead={markAllAsRead}
                />

                <Link
                  to="/login"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300 font-medium text-sm"
                >
                  <LogIn size={16} />
                  Login
                </Link>
                <Link
                  to="/cadastro"
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-semibold shadow-lg transform hover:scale-105 text-sm"
                >
                  <UserPlus size={16} />
                  Cadastre-se
                </Link>
              </div>
            )}
          </div>

          {/* Botão Hambúrguer (Mobile) */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>{' '}
      {/* Menu Dropdown (Mobile) */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 backdrop-blur-lg border-t border-white/10">
            <div className="container mx-auto px-6 py-6">
              <div className="flex flex-col space-y-4">
                {/* Avatar e Nome do Usuário (Mobile) */}
                {token && user && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center font-bold text-white">
                      {user.nome ? user.nome.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {user.nome ? `Olá, ${user.nome.split(' ')[0]}` : 'Olá, Usuário'}
                      </p>
                      <p className="text-white/60 text-sm">{user.email || 'usuário@exemplo.com'}</p>
                    </div>
                  </div>
                )}

                {/* Links do Menu Mobile */}
                <Link
                  to={homeLink}
                  className="flex items-center gap-3 p-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                  onClick={handleLinkClick}
                >
                  <Home size={20} />
                  Home
                </Link>
                {token && (
                  <Link
                    to="/suporte"
                    className="flex items-center gap-3 p-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                    onClick={handleLinkClick}
                  >
                    <HeadphonesIcon size={20} />
                    Suporte
                  </Link>
                )}
                <Link
                  to="/minha-conta"
                  className="flex items-center gap-3 p-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                  onClick={handleLinkClick}
                >
                  <UserCircle size={20} />
                  Perfil
                </Link>

                {/* Notificações (Mobile) */}
                {token && (
                  <button className="flex items-center gap-3 p-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300">
                    <div className="relative">
                      <Bell size={20} />
                      <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
                    </div>
                    Notificações
                  </button>
                )}

                <hr className="border-white/20 my-4" />

                {/* Ações do Usuário no Menu Mobile */}
                {token && user ? (
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 p-3 rounded-xl bg-red-500/20 text-red-200 hover:bg-red-500/30 hover:text-white transition-all duration-300"
                  >
                    <LogOut size={20} />
                    Sair
                  </button>
                ) : (
                  <div className="space-y-3">
                    <Link
                      to="/login"
                      className="flex items-center gap-3 p-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
                      onClick={handleLinkClick}
                    >
                      <LogIn size={20} />
                      Login
                    </Link>
                    <Link
                      to="/cadastro"
                      className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transition-all duration-300 font-semibold"
                      onClick={handleLinkClick}
                    >
                      <UserPlus size={20} />
                      Cadastre-se
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
