import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

/**
 * Atua como um "controlador de tráfego" inicial na rota raiz.
 * Verifica o status de autenticação e a role do usuário para redirecionar
 * para a página apropriada, seja o login ou um dos dashboards.
 */
export default function Root() {
  const { token, user } = useSelector((state) => state.auth);

  // Se não há token, o destino é a página de login.
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Se há um token, decide para qual página principal redirecionar.
  switch (user?.role) {
    case 'ADMIN':
        return <Navigate to="/dashboard-admin" replace />;
    case 'ATENDENTE':
        return <Navigate to="/home" replace />;
    case 'CLIENTE':
    default:
        // O padrão para qualquer outra role (ou se a role for nula) é a home do cliente.
        return <Navigate to="/home" replace />;
  }
}
