import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store.js';

// Importa o novo componente que contém todas as suas rotas
import AppRoutes from './routes/AppRoutes.jsx'; 

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {/* Renderiza o componente AppRoutes que agora gerencia todas as suas rotas */}
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;