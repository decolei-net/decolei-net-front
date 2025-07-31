import React from 'react';
import { Outlet } from 'react-router-dom';
import AtendenteSideBar from '../components/AtendenteSideBar'; // Aqui você importa a sidebar

export default function AtendenteLayout() {
  return (
    <div className="flex min-h-screen">
      <AtendenteSideBar />
      <main className="flex-1 p-6 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
