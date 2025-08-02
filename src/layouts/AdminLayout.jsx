import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSideBar';

export default function AdminLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      
      {/* 1. A nova sidebar, simples e funcional */}
      <AdminSidebar />

      {/* 2. A área de conteúdo principal, que ocupa o resto da tela */}
      <main className="flex-1 p-6 overflow-y-auto">
        
        {/* 3. O Outlet, que renderiza a página correta (Dashboard, Pacotes, etc.) */}
        <Outlet />
        
      </main>
    </div>
  );
}