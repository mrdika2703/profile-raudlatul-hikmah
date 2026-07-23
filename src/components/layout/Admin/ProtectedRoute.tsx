import { Navigate, Outlet } from "react-router";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");

  // Jika tidak ada token login, alihkan kembali ke halaman login
  if (!token) {
    return <Navigate to="/admin" replace />;
  }

  // Jika token ada, izinkan render komponen anak (Dashboard/AdminLayout)
  return <Outlet />;
}
