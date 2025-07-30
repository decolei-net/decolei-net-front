import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store.js';

// Importe suas páginas com a extensão .jsx
import Login from './pages/Login/Login.jsx';
import AdminDashboard from './pages/Dashboards/AdminDashboard.jsx';
import AtendenteDashboard from './pages/Dashboards/AtendenteDashboard.jsx';
import ClienteDashboard from './pages/Dashboards/ClienteDashboard.jsx';
import Unauthorized from './pages/Unauthorized/Unauthorized.jsx';
import PrivateRoute from './components/PrivateRoute.jsx'; // Importe o nosso segurança!
import Cadastro from './pages/Cadastro/Cadastro.jsx'; 
import AppRoutes from './routes/AppRoutes.jsx'; // Importa nosso novo arquivo de rotas
import './index.css';

function App() {  
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} /> {/* 2. Adicione a nova rota */}
          <Route path="/" element={<Login />} />

          {/* Rotas Protegidas com base na Role */}
          <Route
            path="/pacotes/:id"
            element={
              <PrivateRoute roles={['ADMIN', 'ATENDENTE', 'CLIENTE']}>
                <PacoteDetalhes />
              </PrivateRoute>
            }
          />
          <Route 
            path="/dashboard-admin"
            element={
              <PrivateRoute roles={['ADMIN']}>
                <AdminDashboard />
              </PrivateRoute>
            }
          />

          <Route
            path="/dashboard-atendente"
            element={
              <PrivateRoute roles={['ADMIN', 'ATENDENTE']}>
                <AtendenteDashboard />
              </PrivateRoute>
            }
          />
          
          <Route
            path="/dashboard-cliente"
            element={
              // Todos os perfis logados podem ver a dashboard de cliente
              <PrivateRoute roles={['ADMIN', 'ATENDENTE', 'CLIENTE']}>
                <ClienteDashboard />
              </PrivateRoute>
            }
          />
          
          {/* Rota para acesso negado */}
          <Route path="/unauthorized" element={<Unauthorized />} />

        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;