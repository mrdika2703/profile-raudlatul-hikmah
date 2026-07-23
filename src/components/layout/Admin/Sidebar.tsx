import { Link } from "react-router";
import { GraduationCap, LogOut, X, UserCheck } from "lucide-react";
import api from "../../../lib/axios";

export default function Sidebar({
  isSidebarOpen,
  setIsSidebarOpen,
  navigate,
  user,
  menuGroups,
  isActive,
}: any) {
  const handleLogout = async () => {
    try {
      // Tembak API Logout Laravel untuk menghapus token Sanctum
      await api.post("/logout");
    } catch (error) {
      console.error("Gagal logout dari server:", error);
    } finally {
      // Hapus sesi di browser dan alihkan ke login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/admin");
    }
  };

  return (
    <>
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-pink-100 flex flex-col transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
      >
        {/* Logo Sidebar */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-pink-100">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-pink-200">
              <GraduationCap size={22} />
            </div>
            <div>
              <span className="font-bold text-lg text-pink-700 block leading-none">
                TK Raudlatul
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                Admin Portal
              </span>
            </div>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
          {menuGroups.map((group: any) => (
            <div key={group.title} className="space-y-1.5">
              <p className="px-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {group.title}
              </p>
              {group.items.map((item: any) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all ${
                      isActive(item.path)
                        ? "bg-pink-600 text-white shadow-md shadow-pink-200"
                        : "text-slate-600 hover:bg-pink-50 hover:text-pink-600"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={
                        isActive(item.path) ? "text-white" : "text-slate-400"
                      }
                    />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        {/* User Profile & Logout Bottom */}
        <div className="p-4 border-t border-pink-100 bg-pink-50/50">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-9 h-9 rounded-full bg-pink-200 flex items-center justify-center text-pink-700 font-bold">
              <UserCheck size={18} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-700 truncate">
                {user.name}
              </p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 rounded-xl text-xs font-semibold transition-colors shadow-sm"
          >
            <LogOut size={16} />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>

      {/* Overlay untuk mobile sidebar */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
        />
      )}
    </>
  );
}
