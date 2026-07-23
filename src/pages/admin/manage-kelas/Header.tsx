import { DoorClosed, Plus } from "lucide-react";

interface HeaderProps {
  handleOpenCreate: () => void;
}

export default function Header({ handleOpenCreate }: HeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <DoorClosed className="text-pink-600" />
          <span>Kelola Data Kelas</span>
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Daftar seluruh kelas, semester, dan tahun ajaran TK Raudlatul Hikmah
        </p>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button
          onClick={handleOpenCreate}
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md shadow-pink-200 flex items-center justify-center gap-2 text-sm transition-all w-full sm:w-auto"
        >
          <Plus size={18} />
          <span>Tambah Kelas</span>
        </button>
      </div>
    </div>
  );
}
