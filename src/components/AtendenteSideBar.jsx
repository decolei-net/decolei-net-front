import { NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from "../store/authSlice";


export default function AtendenteSideBar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-blue-900 text-white px-4 py-2 rounded transition'
      : 'text-gray-300 hover:text-white px-4 py-2 rounded transition';

  return (
    <div className="bg-[#0f172a] text-white h-screen w-64 flex flex-col justify-between p-6">
      {/* Topo */}
      <div>
        <h1 className="text-2xl font-bold mb-1">DecoleiNet</h1>
        <p className="text-sm text-gray-400 mb-8">Perfil: Atendente</p>

        <nav className="flex flex-col gap-2">
          <NavLink to="/dashboard-atendente" className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/dashboard-atendente/buscar-cliente" className={linkClass}>
            Buscar Cliente
          </NavLink>
          <NavLink to="/dashboard-atendente/reservas-recentes" className={linkClass}>
            Reservas Recentes
          </NavLink>
        </nav>
      </div>

      {/* Rodapé */}
      <div>
        <button
          onClick={handleLogout}
          className="w-full text-left text-red-400 hover:text-red-300 px-4 py-2 mt-4 transition"
        >
          Sair
        </button>
      </div>
    </div>
  );
}
