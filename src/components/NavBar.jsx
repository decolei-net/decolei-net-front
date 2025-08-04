// src/components/NavBar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { UserCircle, LogOut, LogIn, UserPlus, Menu, X } from 'lucide-react';
import { logout } from '../store/authSlice';
import logoImage from '../assets/decolei.png';

export default function NavBar() {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <header className="bg-blue-800 bg-opacity-90 text-white shadow-md backdrop-blur-sm sticky top-0 z-50">
      <nav className="container mx-auto px-6 py-3 flex justify-between items-center ">
        {/* Esquerda: Logo */}
        <Link to={homeLink} onClick={handleLinkClick}>
          <img src={logoImage} alt="DecoleiNet Logo" className="h-8 w-auto" />
        </Link>

        {/* Centro: Links de Navegação (Desktop) */}
        <div className="hidden md:flex justify-center items-center space-x-8">
          <Link
            to={homeLink}
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            Home
          </Link>
          {token && (
            <Link
              to="/suporte"
              className="text-gray-300 hover:text-white transition-colors duration-200"
            >
              Suporte
            </Link>
          )}
          <Link
            to="/minha-conta"
            className="text-gray-300 hover:text-white transition-colors duration-200"
          >
            Perfil
          </Link>
        </div>

        {/* Direita: Ações do Usuário (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          {token && user ? (
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 p-2 rounded-md hover:bg-red-600 transition-colors duration-200"
              title="Sair"
            >
              <LogOut size={20} />
              <span>Sair</span>
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center space-x-2 p-2 rounded-md hover:bg-blue-600 transition-colors duration-200"
              >
                <LogIn size={20} />
                <span>Login</span>
              </Link>
              <Link
                to="/cadastro"
                className="flex items-center space-x-2 px-3 py-2 rounded-md bg-blue-500 hover:bg-blue-400 transition-colors duration-200"
              >
                <UserPlus size={20} />
                <span>Cadastre-se</span>
              </Link>
            </>
          )}
        </div>

        {/* Botão Hambúrguer (Mobile) */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Menu Dropdown (Mobile) */}
      {isMenuOpen && (
        <div className="md:hidden bg-black bg-opacity-90 absolute w-full">
          <div className="flex flex-col items-center space-y-4 py-6">
            {/* Links do Menu Mobile */}
            <Link
              to={homeLink}
              className="text-gray-300 hover:text-white text-lg"
              onClick={handleLinkClick}
            >
              Home
            </Link>
            {token && (
              <Link
                to="/suporte"
                className="text-gray-300 hover:text-white text-lg"
                onClick={handleLinkClick}
              >
                Suporte
              </Link>
            )}
            <Link
              to="/minha-conta"
              className="text-gray-300 hover:text-white text-lg"
              onClick={handleLinkClick}
            >
              Perfil
            </Link>

            <hr className="w-3/4 border-gray-700 my-2" />

            {/* Ações do Usuário no Menu Mobile */}
            {token && user ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-lg text-red-400 hover:text-red-300"
              >
                <LogOut size={20} />
                <span>Sair</span>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center space-x-2 text-lg text-blue-400 hover:text-blue-300"
                  onClick={handleLinkClick}
                >
                  <LogIn size={20} />
                  <span>Login</span>
                </Link>
                <Link
                  to="/cadastro"
                  className="flex items-center space-x-2 text-lg text-gray-300 hover:text-white"
                  onClick={handleLinkClick}
                >
                  <UserPlus size={20} />
                  <span>Cadastre-se</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
