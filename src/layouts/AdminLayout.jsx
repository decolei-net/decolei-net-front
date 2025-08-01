import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSideBar.jsx';

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
        <Outlet /> {/* O conteúdo das páginas (dashboard, etc.) entra aqui */}
      </main>
    </div>
  );
}