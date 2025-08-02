import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar.jsx';
import Footer from '../components/Footer.jsx'; // <-- PASSO 1: Importe o Footer

export default function ClienteLayout() {
  return (
    // <-- PASSO 2: Adicione as classes na div principal
    <div className="flex flex-col min-h-screen">
      <NavBar />
      {/* 
        Ajuste na main:
        - Removido 'container mx-auto p-6' daqui, pois cada página pode ter seu próprio container.
        - Adicionado 'flex-grow' para empurrar o rodapé para baixo.
      */}
      <main className="flex-grow"> {/* <-- PASSO 3: Adicione a classe aqui */}
        <Outlet />
      </main>
      
      {/* <-- PASSO 4: Adicione o componente Footer aqui */}
      <Footer />
    </div>
  );
}