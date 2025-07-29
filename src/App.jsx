import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store.js'; // Verifique se a extensão .js está aqui se o arquivo for .js

// Importe suas páginas com a extensão correta
import Login from './pages/Login/Login.jsx';
import AdminDashboard from './pages/Dashboards/AdminDashboard.jsx';
import AtendenteDashboard from './pages/Dashboards/AtendenteDashboard.jsx';
import ClienteDashboard from './pages/Dashboards/ClienteDashboard.jsx';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Rota principal que carrega o Login */}
          <Route path="/" element={<Login />} />

          {/* Outras rotas */}
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard-admin" element={<AdminDashboard />} />
          <Route path="/dashboard-atendente" element={<AtendenteDashboard />} />
          <Route path="/dashboard-cliente" element={<ClienteDashboard />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;