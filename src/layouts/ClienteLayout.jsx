// src/layouts/ClienteLayout.jsx
import { Outlet } from 'react-router-dom';
import NavBar from '../components/NavBar.jsx';

export default function ClienteLayout() {
  return (
    <div>
      <NavBar />
      <main className="container mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}