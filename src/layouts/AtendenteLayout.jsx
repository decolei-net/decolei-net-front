import React from 'react';
import { Outlet } from 'react-router-dom';
import AtendenteSideBar from '../components/AtendenteSideBar';

export default function AtendenteLayout() {
  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-gray-50">
      {/* Sidebar fixa à esquerda no desktop, em cima no mobile */}
      <AtendenteSideBar />

      {/* Conteúdo principal */}
      <main className="flex-1 px-4 sm:px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
