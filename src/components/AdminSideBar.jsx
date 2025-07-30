import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
    LayoutDashboard, 
    Package, 
    CalendarCheck, 
    Users, 
    Star,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { useSelector } from "react-redux";

// Itens do menu específicos para o painel de admin
const adminMenuItems = [
    { label: 'Painel',      icon: <LayoutDashboard size={20} />, path: '/admin/dashboard'  }, 
    { label: 'Pacotes',     icon: <Package size={20} />,         path: '/admin/pacotes'    }, 
    { label: 'Reservas',    icon: <CalendarCheck size={20} />,   path: '/admin/reservas'   }, 
    { label: 'Usuários',    icon: <Users size={20} />,           path: '/admin/usuarios'   }, 
    { label: 'Avaliações',  icon: <Star size={20} />,            path: '/admin/avaliacoes' }
];

export default function AdminSidebar() {
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();

    // CORREÇÃO: Acessa o estado do Redux corretamente
    const { role } = useSelector((state) => state.auth);

    // Se o usuário não for admin, o componente não renderiza nada.
    if (role !== 'ADMIN') {
        return null;
    }

    return (
        <motion.aside
            animate={{ width: isOpen ? 250 : 80 }}
            className="bg-gray-900 text-gray-200 h-screen p-4 flex flex-col"
        >
            <div className="flex items-center justify-between mb-6">
                {isOpen && <h1 className="text-2xl font-bold text-white">DecoleiNet</h1>}
                <button 
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-1 rounded-full hover:bg-gray-700 focus:outline-none"
                >
                    {isOpen ? <ChevronLeft /> : <ChevronRight />}
                </button>
            </div>

            <nav className="flex-grow">
                <ul>
                    {adminMenuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.path} className="mb-2">
                                <Link 
                                    to={item.path}
                                    className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200
                                        ${isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'}`}
                                >
                                    {item.icon}
                                    {isOpen && <span className="font-medium">{item.label}</span>}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </motion.aside>
    );
}