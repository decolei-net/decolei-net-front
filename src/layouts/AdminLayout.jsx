import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSideBar';

export default function AdminLayout() {
  return (
    // O layout principal agora se adapta. 'lg:flex-row' para desktop, 'flex-col' (padrão) para mobile.
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      
      {/* O AdminSidebar agora é inteligente e se adapta sozinho */}
      <AdminSidebar />
      
      {/* O conteúdo principal com scroll independente */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}