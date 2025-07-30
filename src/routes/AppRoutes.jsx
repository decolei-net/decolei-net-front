import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from '../layouts/AdminLayout.jsx';
import ClienteLayout from '../layouts/ClienteLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';

// Protetores de Rota e Componente de Entrada
import PrivateRoute from '../components/PrivateRoute.jsx';
import PublicRoute from '../components/PublicRoute.jsx';
import Root from '../components/Root.jsx';

// Páginas
import Login from '../pages/Login/Login.jsx';
import Cadastro from '../pages/Cadastro/Cadastro.jsx';
import Unauthorized from '../pages/Unauthorized/Unauthorized.jsx';
import AdminDashboard from '../pages/Dashboards/AdminDashboard.jsx';
import AtendenteDashboard from '../pages/Dashboards/AtendenteDashboard.jsx';
import Home from '../Pages/Home/Home.jsx';
import Suporte from '../pages/Suporte/Suporte.jsx';
import PacoteDetalhes from '../Pages/PacoteDetalhes/PacoteDetalhes.jsx';
import SuaTelaDeReserva from '../Pages/Reserva/Reserva.jsx';

export default function AppRoutes() {
    return (
        <Routes>
            {/* Rota Raiz ('/'): Ponto de entrada que decide para onde redirecionar o usuário. */}
            <Route path="/" element={<Root />} />

            {/* --- Grupo de Rotas Públicas --- */}
            {/* Visíveis apenas para usuários DESLOGADOS, graças ao PublicRoute. */}
            <Route element={<PublicRoute><AuthLayout /></PublicRoute>}>
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
            </Route>

            {/* --- Grupo de Rotas Privadas (Admin e Atendente) --- */}
            {/* Visíveis apenas para usuários LOGADOS com as roles corretas. */}
            <Route
                path="/dashboard-admin"
                element={<PrivateRoute roles={['ADMIN']}><AdminLayout><AdminDashboard /></AdminLayout></PrivateRoute>}
            />
            <Route
                path="/dashboard-atendente"
                element={<PrivateRoute roles={['ADMIN', 'ATENDENTE']}><AdminLayout><AtendenteDashboard /></AdminLayout></PrivateRoute>}
            />

            {/* --- Grupo de Rotas Privadas (Cliente) --- */}
            {/* Visíveis para CLIENTES e ADMINS (para que admins possam ver a interface do cliente). */}
            <Route element={<PrivateRoute roles={['CLIENTE', 'ADMIN']}><ClienteLayout /></PrivateRoute>}>
                <Route path="/home" element={<Home />} />
                <Route path="/suporte" element={<Suporte />} />
                <Route path="/dashboard-cliente" element={<Navigate to="/home" replace />} />
                <Route path="/pacotes/:id" element={<PacoteDetalhes />} />
                <Route path="/reservar/:id" element={<SuaTelaDeReserva />} />
                {/* Adicione outras rotas do cliente aqui, como "/minha-conta", etc. */}
            </Route>

            {/* Rota para a página de "Acesso Não Autorizado" */}
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* --- Rota "Catch-All" --- */}
            {/* Se nenhuma das rotas acima corresponder, o usuário será redirecionado para a raiz. */}
            {/* O componente Root na raiz decidirá o que fazer com ele. */}
            <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
    );
}
