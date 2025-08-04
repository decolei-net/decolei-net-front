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
    <div className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-[rgb(0,84,161)] text-center sm:text-left">
          Dashboard do Atendente
        </h1>
        {/* Futuro botão ou ações adicionais podem ir aqui */}
      </div>

      <p className="text-gray-700 text-center sm:text-left">
        Bem-vindo, Atendente! Aqui você gerencia reservas e dá suporte aos clientes.
      </p>
    </div>
  );
}
