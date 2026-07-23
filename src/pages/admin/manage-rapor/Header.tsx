import { CalendarIcon, Plus, RefreshCw, Search, BookOpen } from "lucide-react";

interface HeaderProps {
  filterDate: string;
  setFilterDate: (date: string) => void;
  daftarKelas: { id: string; display: string }[];
  filterKelas: string;
  setFilterKelas: (kelas: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  fetchRapors: () => void;
  handleOpenCreate: () => void;
}

export default function Header({
  filterDate,
  setFilterDate,
  daftarKelas,
  filterKelas,
  setFilterKelas,
  searchQuery,
  setSearchQuery,
  fetchRapors,
  handleOpenCreate,
}: HeaderProps) {
  return (
    <>
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen className="text-pink-600" />
            <span>Kegiatan Harian Siswa</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola catatan kegiatan harian per kelas dan tanggal
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md shadow-pink-200 flex items-center justify-center gap-2 text-sm transition-all w-full sm:w-auto"
        >
          <Plus size={18} />
          <span>Tambah Kegiatan</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Filter Tanggal */}
          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200">
            <CalendarIcon size={18} className="text-pink-600" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-transparent text-sm font-bold text-slate-700 focus:outline-none cursor-pointer"
            />
          </div>

          {/* Filter Kelas */}
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer"
          >
            {daftarKelas.length === 0 && (
              <option value="">Tidak ada kelas aktif</option>
            )}
            {daftarKelas.map((k) => (
              <option key={k.id} value={k.id}>
                {k.display}
              </option>
            ))}
          </select>

          {/* Search Bar */}
          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 flex-1 min-w-[200px]">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm w-full font-medium focus:outline-none text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Tombol Refresh */}
        <button
          onClick={fetchRapors}
          className="p-3 text-slate-600 hover:text-pink-600 bg-slate-50 hover:bg-pink-50 rounded-xl border border-slate-200 transition-colors"
          title="Refresh Data"
        >
          <RefreshCw size={18} />
        </button>
      </div>
    </>
  );
}
