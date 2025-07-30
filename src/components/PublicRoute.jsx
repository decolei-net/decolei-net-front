import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

/**
 * Este componente protege rotas públicas de usuários que JÁ ESTÃO LOGADOS.
 * Se um usuário autenticado (com token) tentar acessar /login ou /cadastro,
 * ele será redirecionado para a página inicial ('/').
 * Se o usuário não estiver logado, ele permite o acesso à página.
 */
export default function PublicRoute({ children }) {
  // Acessamos o token para verificar o estado de autenticação
  const { token } = useSelector((state) => state.auth);

  // Se existe um token, significa que o usuário está logado.
  // Redirecionamos ele para a raiz do site, onde nosso componente Root decidirá para onde mandá-lo.
  if (token) {
    return <Navigate to="/" replace />;
  }

  // Se não há token, o usuário não está logado, então ele pode ver
  // o componente filho (a página de Login ou Cadastro).
  return children;
}

// Boa prática: definir os tipos das props
PublicRoute.propTypes = {
    children: PropTypes.node.isRequired,
};
