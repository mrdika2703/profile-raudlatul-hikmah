import { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  UserCheck,
  House,
  Flame,
  Newspaper,
  UserRoundPlus,
  DoorClosed,
  History,
} from "lucide-react";

import Header from "./Header";
import Sidebar from "./Sidebar";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Mengambil data user yang disimpan saat login
  const userData = localStorage.getItem("user");
  const user = userData
    ? JSON.parse(userData)
    : { name: "Guru TK", email: "guru@tk.sch.id" };

  const menuGroups = [
    {
      title: "Menu Utama",
      items: [
        { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "Akademik & Siswa",
      items: [
        { name: "Absensi Siswa", path: "/admin/absen", icon: UserCheck },
        { name: "Kelola Siswa", path: "/admin/siswa", icon: Users },
        { name: "Kelola Kelas", path: "/admin/kelas", icon: DoorClosed },
        { name: "Input Rapot", path: "/admin/rapor", icon: BookOpen },
      ],
    },
    {
      title: "Informasi & Konten",
      items: [
        { name: "Kelola Informasi", path: "/admin/home-information", icon: House },
        { name: "Kelola Kegiatan", path: "/admin/activity", icon: Flame },
        { name: "Kelola Berita", path: "/admin/news", icon: Newspaper },
      ],
    },
    {
      title: "Sistem & Keamanan",
      items: [
        { name: "Kelola User", path: "/admin/users", icon: UserRoundPlus },
        { name: "Riwayat", path: "/admin/history", icon: History },
      ],
    },
  ];

  const menuItems = menuGroups.flatMap((group) => group.items);

  const isActive = (path: string) => location.pathname === path;
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans">
      {/* Sidebar - Desktop & Mobile */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        navigate={navigate}
        user={user}
        menuGroups={menuGroups}
        isActive={isActive}
      />

      {/* Area Konten Utama */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        <Header
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          menuItems={menuItems}
          user={user}
          isActive={isActive}
        />

        {/* Content Outlet */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
