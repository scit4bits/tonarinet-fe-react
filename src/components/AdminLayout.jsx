import { Outlet, useParams } from "react-router";
import Sidebar from "./Sidebar";

export default function AdminLayout({ role }) {
  const { orgId } = useParams();
  return (
    <div className="flex flex-row w-full">
      <Sidebar role={role} orgId={orgId} />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
