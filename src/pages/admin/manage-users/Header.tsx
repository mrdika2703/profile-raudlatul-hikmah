import { Plus } from "lucide-react";

interface HeaderProps {
  handleOpenCreate: () => void;
}

export default function Header({ handleOpenCreate }: HeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
          Kelola User / Staff
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Daftar akun kepala sekolah, operator, guru, dan staff administrasi sekolah.
        </p>
      </div>

      <button
        onClick={handleOpenCreate}
        className="flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 active:bg-pink-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-pink-200 hover:shadow-lg transition-all self-start sm:self-auto"
      >
        <Plus size={16} />
        <span>Tambah User</span>
      </button>
    </div>
  );
}
