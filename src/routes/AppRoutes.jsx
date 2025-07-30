// src/routes/AppRoutes.jsx
import { Routes, Route } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout.jsx';
import ClienteLayout from '../layouts/ClienteLayout.jsx';
import AuthLayout from '../layouts/AuthLayout.jsx';
import PrivateRoute from '../components/PrivateRoute.jsx';
import Login from '../pages/Login/Login.jsx';
import Cadastro from '../pages/Cadastro/Cadastro.jsx';
import Unauthorized from '../pages/Unauthorized/Unauthorized.jsx';
import AdminDashboard from '../pages/Dashboards/AdminDashboard.jsx';
import AtendenteDashboard from '../pages/Dashboards/AtendenteDashboard.jsx';
import ClienteDashboard from '../pages/Dashboards/ClienteDashboard.jsx';
import Suporte from '../pages/Suporte/Suporte.jsx';

export default function AppRoutes() {
    return (
        <Routes>
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/" element={<Login />} />
            </Route>
            
            <Route path="/dashboard-admin" element={<PrivateRoute roles={['ADMIN']}><AdminLayout><AdminDashboard /></AdminLayout></PrivateRoute>} />
            <Route path="/dashboard-atendente" element={<PrivateRoute roles={['ADMIN', 'ATENDENTE']}><AdminLayout><AtendenteDashboard /></AdminLayout></PrivateRoute>} />
            
            <Route element={<PrivateRoute><ClienteLayout /></PrivateRoute>}>
                <Route path="/dashboard-cliente" element={<ClienteDashboard />} />
                <Route path="/suporte" element={<Suporte />} />
            </Route>

            <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
    );
}