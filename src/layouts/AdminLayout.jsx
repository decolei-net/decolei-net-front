import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar.jsx'; // Use sua sidebar existente
import NavBar from '../components/NavBar.jsx';   // Use sua navbar existente

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <NavBar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Outlet /> {/* O conteúdo das páginas (dashboard, etc.) entra aqui */}
        </main>
      </div>
    </div>
  );
}