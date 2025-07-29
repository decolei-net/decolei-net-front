// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store'; // Verifique o caminho

// Importe suas páginas
import Login from './pages/Login/Login';
import AdminDashboard from '/pages/Dashboards/AdminDashboard';
import AtendenteDashboard from './pages/Dashboards/AtendenteDashboard';
import ClienteDashboard from './pages/Dashboards/ClienteDashboard';
// Importe seu PrivateRoute se for usar
// import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Rota pública de Login */}
          <Route path="/login" element={<Login />} />

          {/* Rotas Protegidas (exemplo) */}
          {/* Envolva as rotas de dashboard com seu PrivateRoute quando estiver pronto */}
          <Route path="/dashboard-admin" element={<AdminDashboard />} />
          <Route path="/dashboard-atendente" element={<AtendenteDashboard />} />
          <Route path="/dashboard-cliente" element={<ClienteDashboard />} />

          {/* Adicione outras rotas aqui, como Home, Cadastro, etc. */}
          {/* Ex: <Route path="/" element={<HomePage />} /> */}
          <Route path="/" element={<Login />} /> {/* Por enquanto, a raiz leva pro login */}

        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;