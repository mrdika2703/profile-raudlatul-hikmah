import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
}

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  selectedStatus,
  setSelectedStatus,
}: SearchBarProps) {
  const hasFilter = searchQuery !== "" || selectedStatus !== "Semua Status";

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-3">
      {/* Input Search Text */}
      <div className="flex-1 flex items-center gap-3 w-full bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-pink-500 transition-all">
        <Search size={18} className="text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Cari berdasarkan Kelas atau Tahun Ajaran (misal: 2022/2023)..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-sm focus:outline-none text-slate-700 font-medium placeholder:text-slate-400"
        />
      </div>

      {/* Filter Dropdown Status */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full sm:w-48 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer transition-all"
        >
          <option value="Semua Status">Semua Status</option>
          <option value="Aktif">Aktif</option>
          <option value="Lulus">Lulus</option>
        </select>

        {hasFilter && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedStatus("Semua Status");
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
