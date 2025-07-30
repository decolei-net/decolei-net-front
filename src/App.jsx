import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store.js';
import AppRoutes from './routes/AppRoutes.jsx'; // Importa nosso novo arquivo de rotas
import './index.css';

function App() {  
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Provider>
  );
}

export default App;