import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { logout } from '../store/authSlice';

// Importando os ícones
import { 
    LayoutDashboard, 
    Package, 
    CalendarCheck, 
    Users, 
    Star,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Menu,
    X
} from 'lucide-react';

// Hook customizado para detectar o tamanho da tela de forma simples
const useWindowSize = () => {
    const [size, setSize] = useState([0, 0]);
    useEffect(() => {
        const updateSize = () => {
            setSize([window.innerWidth, window.innerHeight]);
        };
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);
    return { width: size[0] };
};

// Itens do menu
const adminMenuItems = [
    { label: 'Painel',      icon: <LayoutDashboard size={20} />, path: '/admin/dashboard'  }, 
    { label: 'Pacotes',     icon: <Package size={20} />,         path: '/admin/pacotes'    }, 
    { label: 'Reservas',    icon: <CalendarCheck size={20} />,   path: '/admin/reservas'   }, 
    { label: 'Usuários',    icon: <Users size={20} />,           path: '/admin/usuarios'   }, 
    { label: 'Avaliações',  icon: <Star size={20} />,            path: '/admin/avaliacoes' }
];

export default function AdminSidebar() {
    const { width } = useWindowSize();
    const isMobile = width < 1024; // Ponto de quebra para responsividade (lg)

    // Estado para a sidebar do desktop (recolhida/expandida)
    const [isDesktopOpen, setDesktopOpen] = useState(true);
    // Estado para o menu dropdown do mobile (aberto/fechado)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Função para deslogar o usuário
    const handleLogout = () => {
        dispatch(logout());
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };
    
    // Estilo para os links da sidebar do desktop
    const desktopNavLinkStyle = ({ isActive }) =>
        `flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200 ${
            isActive 
                ? 'bg-blue-600 text-white font-semibold' 
                : 'text-gray-400 hover:bg-gray-700 hover:text-white'
        }`;

    // Estilo para os links do menu dropdown do mobile
    const mobileNavLinkStyle = ({ isActive }) =>
        `flex items-center w-full p-3 text-base rounded-lg transition-colors duration-200 ${
            isActive 
                ? 'bg-blue-100 text-blue-700 font-semibold' 
                : 'text-gray-700 hover:bg-gray-100'
        }`;

    // Se a tela for pequena, renderiza a barra de navegação mobile
    if (isMobile) {
        return (
            // NOTA: Este componente agora controla a navegação no topo da página em telas pequenas.
            // Pode ser necessário adicionar um padding-top ao seu conteúdo principal no AdminLayout
            // para que ele não fique escondido atrás desta barra. (ex: <main className="pt-20 lg:pt-0">)
            <div className="lg:hidden">
                {/* A barra de navegação fixa no topo */}
                <div className="fixed top-0 left-0 right-0 z-30 flex items-center justify-between p-4 bg-gray-900 text-white shadow-lg">
                    <h1 className="text-xl font-bold">Painel Admin</h1>
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* O menu dropdown animado */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="fixed top-16 left-0 right-0 z-20 bg-white p-4 shadow-xl"
                        >
                            <nav className="flex flex-col space-y-1">
                                {adminMenuItems.map(item => (
                                    <NavLink key={item.path} to={item.path} className={mobileNavLinkStyle} onClick={() => setIsMobileMenuOpen(false)}>
                                        {item.icon}
                                        <span className="ml-3">{item.label}</span>
                                    </NavLink>
                                ))}
                                <div className="pt-2 mt-2 border-t border-gray-200">
                                    <button onClick={handleLogout} className="flex items-center w-full p-3 text-base rounded-lg text-red-600 hover:bg-red-50">
                                        <LogOut size={20} />
                                        <span className="ml-3 font-semibold">Sair</span>
                                    </button>
                                </div>
                            </nav>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // Se a tela for grande, renderiza a sidebar do desktop
    return (
        <motion.aside
            animate={{ width: isDesktopOpen ? 288 : 80 }}
            className="hidden lg:flex bg-gray-900 text-gray-200 h-screen p-4 flex-col border-r border-gray-800"
        >
            {/* Cabeçalho da Sidebar */}
            <div className="flex items-center justify-between mb-8">
                {isDesktopOpen && <h1 className="text-2xl font-bold text-white whitespace-nowrap">Painel Admin</h1>}
                <button 
                    onClick={() => setDesktopOpen(!isDesktopOpen)}
                    className="p-1 rounded-full text-gray-400 hover:bg-gray-700 focus:outline-none"
                >
                    {isDesktopOpen ? <ChevronLeft /> : <ChevronRight />}
                </button>
            </div>

            {/* Navegação Principal */}
            <nav className="flex-grow">
                <ul className="space-y-2">
                    {adminMenuItems.map((item) => (
                        <li key={item.path}>
                            <NavLink to={item.path} className={desktopNavLinkStyle}>
                                {item.icon}
                                {isDesktopOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}
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
                    {isDesktopOpen && <span className="font-semibold whitespace-nowrap">Sair</span>}
                </button>
            </div>
        </motion.aside>
    );
}
