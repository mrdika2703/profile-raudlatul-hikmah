import { Navigate, Outlet } from "react-router";

export default function GuestRoute() {
  const token = localStorage.getItem("token");

  // Jika user sudah login, alihkan ke dashboard admin
  if (token) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Jika belum login, izinkan akses rute tamu (misal: login)
  return <Outlet />;
}
