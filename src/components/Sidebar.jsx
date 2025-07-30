import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, User, LogIn, UserPlus} from 'lucide-react';
import { useSelector } from "react-redux";

const menuItems = [
    {label:'Home', icon: <Home size={20} />, path: '/pacotesViagem' }, 
    {label:'Login', icon: <LogIn size={20} />, path: '/login' }, 
    {label:'Cadastro', icon: <UserPlus size={20} />, path: '/cadastro' }, 
    {label:'Usuarios', icon: <User size={20} />, path: '/usuarios', role:'Admin',}, 
];

export default function Sidebar(){
    const [open, setOpen] = useState(true);
    const { role } = useSelector((state) => { state.auth });

    return(
        <motion.aside
            animate={{ width: open ? 200 : 60}}
            className= "bg-gray-800 text-white h-full p-2">
            <button onClick={() => setOpen(!open)}
                className="mb-4"    
            >
                {open ? '<':'>'}
            </button>
            <nav className="space-y-2">
                {menuItens.map((item) => {
                    if(item.role && item.role !== role){
                        return null;
                    }
                    return(
                        <Link 
                            key={item.path}
                            to={item.path}
                            className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded"
                        >
                            {item.icon}
                            {open && <span>{item.label}</span>}      
                        </Link>
                    );
                })}
            </nav>
        </motion.aside>
    )
 }