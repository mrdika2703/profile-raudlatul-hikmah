import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedKelas: string;
  setSelectedKelas: (kelas: string) => void;
  daftarKelas: any[];
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
}

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  selectedKelas,
  setSelectedKelas,
  daftarKelas,
  selectedStatus,
  setSelectedStatus,
}: SearchBarProps) {
  const hasFilter = searchQuery !== "" || selectedKelas !== "Semua Kelas" || selectedStatus !== "Aktif";

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-3">
      {/* Input Search Text */}
      <div className="flex-1 flex items-center gap-3 w-full bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-pink-500 transition-all">
        <Search size={18} className="text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Cari berdasarkan Nama atau NISN..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-sm focus:outline-none text-slate-700 font-medium placeholder:text-slate-400"
        />
      </div>

      {/* Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        {/* Status Kelas Filter */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full sm:w-36 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer transition-all"
        >
          <option value="Semua Status">Semua Status</option>
          <option value="Aktif">Aktif</option>
          <option value="Lulus">Lulus</option>
        </select>

        {/* Kelas Filter */}
        <select
          value={selectedKelas}
          onChange={(e) => setSelectedKelas(e.target.value)}
          className="w-full sm:w-48 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer transition-all"
        >
          {daftarKelas.map((k) => {
            const id = typeof k === "object" ? k.id : k;
            const display = typeof k === "object" ? k.display : k;
            return (
              <option key={id} value={id}>
                {display}
              </option>
            );
          })}
        </select>

        {hasFilter && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedKelas("Semua Kelas");
              setSelectedStatus("Aktif");
            }}
            className="text-slate-500 hover:text-slate-700 text-xs font-bold px-3 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl whitespace-nowrap transition-colors"
          >
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
