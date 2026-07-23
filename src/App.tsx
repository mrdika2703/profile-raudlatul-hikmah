import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Toaster } from "sonner";

// Layouts
import PublicLayout from "./components/layout/PublicLayout";
import AdminLayout from "./components/layout/Admin/AdminLayout";
import ProtectedRoute from "./components/layout/Admin/ProtectedRoute";
import GuestRoute from "./components/layout/Admin/GuestRoute";

// Pages - Public
import Home from "./pages/home/Index";
import Profile from "./pages/profile/Index";
import Acara from "./pages/invoice/Index";
import RapotHarian from "./pages/rapor/Index";

// Pages - Admin
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/dashboard/Index";
import KelolaSiswa from "./pages/admin/manage-siswa/Index";
import KelolaAbsensi from "./pages/admin/manage-absensi/Index";
import KelolaKelas from "./pages/admin/manage-kelas/Index";
import ManageHomeInformation from "./pages/admin/home-information/Index";
import ManageNews from "./pages/admin/manage-news/Index";
import ManageUser from "./pages/admin/manage-users/Index";
import ManageRapor from "./pages/admin/manage-rapor/Index";
import ManageActivity from "./pages/admin/manage-activity/Index";
import ManageHistory from "./pages/admin/manage-history/Index";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" richColors />
      <Routes>
        {/* Rute Login Admin (Hanya untuk Tamu / Belum Login) */}
        <Route element={<GuestRoute />}>
          <Route path="admin" element={<Login />} />
          <Route path="guru/login" element={<Navigate to="/admin" replace />} />
        </Route>

        {/* --------------------------------------------------- */}
        {/* RUTE TERPROTEKSI (Khusus Guru/Admin yang sudah login) */}
        {/* --------------------------------------------------- */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="admin/dashboard" element={<Dashboard />} />

            {/* Siapkan rute untuk fitur lainnya nanti */}
            <Route path="admin/siswa" element={<KelolaSiswa />} />

            <Route path="admin/absen" element={<KelolaAbsensi />} />
            <Route path="admin/kelas" element={<KelolaKelas />} />
            <Route path="admin/rapor" element={<ManageRapor />} />
            <Route path="admin/news" element={<ManageNews />} />
            <Route
              path="admin/home-information"
              element={<ManageHomeInformation />}
            />
            <Route path="admin/activity" element={<ManageActivity />} />
            <Route path="admin/users" element={<ManageUser />} />
            <Route path="admin/history" element={<ManageHistory />} />
          </Route>
        </Route>

        {/* --------------------------------------------------- */}
        {/* RUTE PUBLIK (Menggunakan PublicLayout) */}
        {/* --------------------------------------------------- */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="acara" element={<Acara />} />
          <Route path="rapot" element={<RapotHarian />} />
          <Route
            path="*"
            element={
              <div className="text-center py-24 text-pink-700 font-bold text-xl">
                404 | Halaman Tidak Ditemukan 🔍
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
