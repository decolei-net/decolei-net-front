import { Outlet } from 'react-router-dom';
import SideBar  from './Sidebar';
import LogoutButton from './LogoutButton';

export default function Layout() {
  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="flex-1 p-6 overflow-auto">
        <Outlet />
        <LogoutButton />
      </div>
    </div>
  )
}
