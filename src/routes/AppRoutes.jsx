import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AdminLayout from '../layouts/AdminLayout.jsx';
import ClienteLayout from '../layouts/ClienteLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import AtendenteLayout from '../layouts/AtendenteLayout.jsx';

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
import ClienteDashboard from '../Pages/Dashboards/ClienteDashboard.jsx';
import AtendenteDashboard from '../pages/Dashboards/AtendenteDashboard.jsx';

// Cliente
import Home from '../Pages/Home/Home.jsx';
import Suporte from '../pages/Suporte/Suporte.jsx';
import PacoteDetalhes from '../Pages/PacoteDetalhes/PacoteDetalhes.jsx';
import Pagamento from '../Pages/Pagamento/Pagamento.jsx';
import Reserva from '../pages/Reserva/Reserva.jsx';

// Atendente
import BuscarCliente from '../Pages/Atendente/BuscarCliente.jsx';
import ReservasRecentes from '../Pages/Atendente/ReservasRecentes.jsx';
import DetalhesClientes from '../Pages/Atendente/DetalhesClientes.jsx';
import DetalhesReservaGestao from '../Pages/Atendente/DetalhesReservaGestao.jsx';

// Admin
import GerenciarPacotes from '../Pages/AdminPacote/GerenciarPacotes.jsx'; // Nome do arquivo corrigido aqui
import AdicionarPacote from '../Pages/AdminPacote/AdicionarPacote.jsx';
import EditarPacote from '../Pages/AdminPacote/EditarPacote.jsx';

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
       {/* Rotas Privadas - Admin (VERSÃO CORRIGIDA) */}
      <Route
        path="/dashboard-admin"
        element={
          <PrivateRoute roles={['ADMIN']}>
            {/* O elemento da rota pai agora renderiza APENAS o layout. */}
            {/* O <Outlet /> dentro do AdminLayout fará o resto. */}
            <AdminLayout />
          </PrivateRoute>
        }
      >
        {/* A rota "index" é a página padrão para /dashboard-admin */}
        <Route index element={<AdminDashboard />} />

        {/* Rotas filhas para cada item da sidebar */}
        <Route path="pacotes" element={<GerenciarPacotes />} />
        <Route path="pacotes/novo" element={<AdicionarPacote />} />
        <Route path="pacotes/editar/:id" element={<EditarPacote />} />
        
        {/* Adicione placeholders para as outras rotas para evitar erros */}
        {/* <Route path="reservas" element={<div>Página de Reservas</div>} /> */}
        {/* <Route path="usuarios" element={<div>Página de Usuários</div>} /> */}
        {/* <Route path="avaliacoes" element={<div>Página de Avaliações</div>} /> */}
      </Route>

      {/* Rotas Privadas - Atendente */}
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
        <Route path="detalhes-reserva/:id" element={<DetalhesReservaGestao />} />
        <Route path="detalhes-clientes/:id" element={<DetalhesClientes />} />
      </Route>

      {/* Rotas Privadas - Cliente */}
      <Route
        element={
          <PrivateRoute roles={['CLIENTE', 'ADMIN', 'ATENDENTE']}>
            <ClienteLayout />
          </PrivateRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/suporte" element={<Suporte />} />
        <Route path="/dashboard-cliente" element={<Navigate to="/home" replace />} />
        <Route path="/minha-conta" element={<ClienteDashboard />} />
        <Route path="/pacotes/:id" element={<PacoteDetalhes />} />
        <Route path="/reservar/:pacoteId" element={<Reserva />} />
        <Route path="/pagamento/:reservaId" element={<Pagamento />} />
      </Route>

      {/* Página de Acesso Negado */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Catch-all (404) */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
