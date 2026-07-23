import { Search } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedPosition: string;
  setSelectedPosition: (position: string) => void;
}

export default function SearchBar({
  searchQuery,
  setSearchQuery,
  selectedPosition,
  setSelectedPosition,
}: SearchBarProps) {
  const hasFilter = searchQuery !== "" || selectedPosition !== "Semua Jabatan";

  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row items-center gap-3">
      {/* Input Search Text */}
      <div className="flex-1 flex items-center gap-3 w-full bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-pink-500 transition-all">
        <Search size={18} className="text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Cari user berdasarkan Nama atau Email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent text-sm focus:outline-none text-slate-700 font-medium placeholder:text-slate-400"
        />
      </div>

      {/* Filter Dropdown Jabatan */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <select
          value={selectedPosition}
          onChange={(e) => setSelectedPosition(e.target.value)}
          className="w-full sm:w-48 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer transition-all"
        >
          <option value="Semua Jabatan">Semua Jabatan</option>
          <option value="Kepala Sekolah">Kepala Sekolah</option>
          <option value="Operator">Operator</option>
          <option value="Guru">Guru</option>
        </select>

        {hasFilter && (
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedPosition("Semua Jabatan");
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
