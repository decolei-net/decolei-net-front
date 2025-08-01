import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from '../layouts/AdminLayout.jsx';
import ClienteLayout from '../layouts/ClienteLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import AtendenteLayout from '../layouts/AtendenteLayout.jsx'; // ✅ layout leve do atendente

// Protetores de Rota e Componente de Entrada
import PrivateRoute from '../components/PrivateRoute.jsx';
import PublicRoute from '../components/PublicRoute.jsx';
import Root from '../components/Root.jsx';

// Páginas Públicas
import Login from '../Pages/Login/Login.jsx';
import Cadastro from '../pages/Cadastro/Cadastro.jsx';
import Unauthorized from '../pages/Unauthorized/Unauthorized.jsx';
import ResetPassword from '../Pages/ResetPassword/ResetPassword.jsx';

// Dashboards
import AdminDashboard from '../pages/Dashboards/AdminDashboard.jsx';
import ClienteDashboard from '../pages/Dashboards/ClienteDashboard.jsx';
import AtendenteDashboard from '../pages/Dashboards/AtendenteDashboard.jsx';

// Cliente
import Home from '../Pages/Home/Home.jsx';
import Suporte from '../pages/Suporte/Suporte.jsx';
import PacoteDetalhes from '../Pages/PacoteDetalhes/PacoteDetalhes.jsx';
import Pagamento from '../Pages/Pagamento/Pagamento.jsx';

// Atendente
import BuscarCliente from '../Pages/Atendente/BuscarCliente.jsx';
import ReservasRecentes from '../Pages/Atendente/ReservasRecentes.jsx';
import DetalhesClientes from '../Pages/Atendente/DetalhesClientes.jsx';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rota Raiz */}
      <Route path="/" element={<Root />} />

      {/* Rotas Públicas */}
      <Route
        element={
          <PublicRoute>
            <AuthLayout />
          </PublicRoute>
        }
      >
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Rotas Privadas - Admin */}
      <Route
        path="/dashboard-admin"
        element={
          <PrivateRoute roles={['ADMIN']}>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </PrivateRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />

        {/* Rotas futuras para cada item da sidebar (não precisam de alteração) */}
        {/* <Route path="pacotes" element={<GerenciarPacotes />} /> */}
        {/* <Route path="reservas" element={<GerenciarReservas />} /> */}
        {/* <Route path="usuarios" element={<GerenciarUsuarios />} /> */}
        {/* <Route path="avaliacoes" element={<GerenciarAvaliacoes />} /> */}

        {/* O <Navigate> foi removido para evitar o loop. */}
      </Route>

      {/* ✅ Rotas Privadas - Atendente com layout mínimo */}
      <Route
        path="/dashboard-atendente"
        element={
          <PrivateRoute roles={['ATENDENTE', 'ADMIN']}>
            <AtendenteLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<AtendenteDashboard />} />
        <Route path="buscar-cliente" element={<BuscarCliente />} />
        <Route path="reservas-recentes" element={<ReservasRecentes />} />
        <Route path="detalhes-cliente/:id" element={<DetalhesClientes />} />
      </Route>

      {/* Rotas Privadas - Cliente */}
      <Route
        element={
          <PrivateRoute roles={['CLIENTE', 'ADMIN']}>
            <ClienteLayout />
          </PrivateRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/suporte" element={<Suporte />} />
        <Route path="/dashboard-cliente" element={<Navigate to="/home" replace />} />
        <Route path="/minha-conta" element={<ClienteDashboard />} />
        <Route path="/pacotes/:id" element={<PacoteDetalhes />} />
        <Route path="/pagamento/:reservaId" element={<Pagamento />} />
      </Route>

      {/* Página de Acesso Negado */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Catch-all (404) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
