import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice'; // ajuste o caminho se necessário

export default function AtendenteDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[rgb(0,84,161)]">Dashboard do Atendente</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
        >
          Sair
        </button>
      </div>
      <p className="text-gray-700">Bem-vindo, Atendente! Aqui você gerencia reservas e dá suporte aos clientes.</p>
    </div>
  );
}
