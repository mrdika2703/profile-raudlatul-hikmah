import { Menu } from "lucide-react";

interface HeaderProps {
  setIsSidebarOpen: (isOpen: boolean) => void;
  menuItems: { name: string; path: string }[];
  user: { name: string; position: string };
  isActive: (path: string) => boolean;
}

export default function Header({
  setIsSidebarOpen,
  menuItems,
  user,
  isActive,
}: HeaderProps) {
  return (
    <>
      {/* Top Bar (Mobile Menu Trigger & Greetings) */}
      <header className="h-20 bg-white border-b border-pink-100 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden p-2 text-slate-600 hover:text-pink-600 focus:outline-none rounded-lg hover:bg-pink-50"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-lg font-bold text-slate-800">
            {menuItems.find((m) => isActive(m.path))?.name || "Dashboard"}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600 px-3 py-1.5">
            {user.position}
          </span>
        </div>
      </header>
    </>
  );
}
