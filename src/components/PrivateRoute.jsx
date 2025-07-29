// src/components/PrivateRoute.jsx

import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Um componente que protege rotas.
 * 1. Verifica se o usuário está logado. Se não, redireciona para /login.
 * 2. Verifica se a role do usuário está na lista de roles permitidas. Se não, redireciona para /unauthorized.
 * 3. Se tudo estiver OK, renderiza a página solicitada.
 */
export default function PrivateRoute({ children, roles }) {
    // Pega o usuário e o token do estado global do Redux
    const { user, token } = useSelector((state) => state.auth);
    const location = useLocation();

    // 1. O usuário não está logado?
    if (!token || !user) {
        // Redireciona para a página de login, guardando a página que ele tentou acessar
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. A rota exige uma role específica E a role do usuário não está na lista?
    if (roles && !roles.includes(user.role)) {
        // Redireciona para uma página de "Acesso Negado"
        return <Navigate to="/unauthorized" replace />;
    }

    // 3. Se passou por todas as verificações, o acesso é permitido.
    return children;
}

// Boa prática: definir os tipos das props que o componente espera
PrivateRoute.propTypes = {
    children: PropTypes.node.isRequired,
    roles: PropTypes.arrayOf(PropTypes.string),
};