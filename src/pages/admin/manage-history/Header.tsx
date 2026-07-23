import { CalendarIcon, RefreshCw, Search, History } from "lucide-react";

interface HeaderProps {
  filterDate: string;
  setFilterDate: (date: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  categories: string[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  fetchHistories: () => void;
}

export default function Header({
  filterDate,
  setFilterDate,
  selectedCategory,
  setSelectedCategory,
  categories,
  searchQuery,
  setSearchQuery,
  fetchHistories,
}: HeaderProps) {
  return (
    <>
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <History className="text-pink-600" />
            <span>Riwayat Aktivitas</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Log aktivitas sistem dan aksi yang dilakukan oleh pengguna/guru
          </p>
        </div>
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

          {/* Filter Kategori */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500 cursor-pointer"
          >
            <option value="Semua Kategori">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Search Bar */}
          <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2.5 rounded-xl border border-slate-200 flex-1 min-w-[200px]">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Cari aktivitas atau nama pengguna..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm w-full font-medium focus:outline-none text-slate-700 placeholder:text-slate-400"
            />
          </div>

          {(filterDate || selectedCategory !== "Semua Kategori" || searchQuery) && (
            <button
              onClick={() => {
                setFilterDate("");
                setSelectedCategory("Semua Kategori");
                setSearchQuery("");
              }}
              className="text-slate-500 hover:text-slate-700 text-xs font-bold px-3 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl whitespace-nowrap transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* Tombol Refresh */}
        <button
          onClick={fetchHistories}
          className="p-3 text-slate-600 hover:text-pink-600 bg-slate-50 hover:bg-pink-50 rounded-xl border border-slate-200 transition-colors"
          title="Refresh Data"
        >
          <RefreshCw size={18} />
        </button>
      </div>
    </>
  );
}
