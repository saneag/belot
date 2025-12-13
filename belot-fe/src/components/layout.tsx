import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex justify-center">
      <div className="max-w-5xl flex flex-1 justify-center">
        <Outlet />
      </div>
    </div>
  );
}
