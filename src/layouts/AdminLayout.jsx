import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSideBar';

export default function AdminLayout() {
  return (
    // Sempre flex-row para manter sidebar na lateral
    <div className="flex flex-row min-h-screen bg-gray-100">
      
      {/* O AdminSidebar agora é inteligente e se adapta sozinho */}
      <AdminSidebar />
      
      {/* O conteúdo principal com scroll independente e posição corrigida */}
      <main className="flex-1 overflow-y-auto lg:max-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}