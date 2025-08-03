import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar.jsx';
import Footer from '../components/Footer.jsx'; 

export default function ClienteLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <NavBar />
      {/* 
        Ajuste na main:
        - Removido 'container mx-auto p-6' daqui, pois cada página pode ter seu próprio container.
        - Adicionado 'flex-grow' para empurrar o rodapé para baixo.
      */}
      <main className="flex-grow"> 
        <Outlet />
      </main>
      
      <Footer />
    </div>
  );
}