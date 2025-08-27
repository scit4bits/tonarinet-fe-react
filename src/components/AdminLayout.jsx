import { Outlet } from "react-router";
import Sidebar from "./Sidebar";

export default function AdminLayout({ role }) {
  return (
    <div className="flex flex-row w-full">
      <Sidebar role={role} />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
