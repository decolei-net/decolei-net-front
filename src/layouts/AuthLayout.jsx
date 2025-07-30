import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <main className="w-full max-w-md">
        {/* As páginas de Login e Cadastro aparecerão aqui dentro */}
        <Outlet />
      </main>
    </div>
  );
}