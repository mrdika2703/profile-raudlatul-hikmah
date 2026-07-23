import { CalendarIcon, Plus, RefreshCw, Search } from "lucide-react";

export default function Header({
  fetchAbsensis,
  filterDate,
  setFilterDate,
  daftarKelas,
  filterKelas,
  setFilterKelas,
  searchQuery,
  setSearchQuery,
  handleOpenCreate,
}: any) {
  return (
    <>
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
            {daftarKelas.map((k: any) => {
              const id = typeof k === "object" ? k.id : k;
              const display = typeof k === "object" ? k.display : k;
              return (
                <option key={id} value={id}>
                  {display}
                </option>
              );
            })}
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

        {/* Tombol Refresh & Tambah Manual */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={fetchAbsensis}
            className="p-3 text-slate-600 hover:text-pink-600 bg-slate-50 hover:bg-pink-50 rounded-xl border border-slate-200 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={handleOpenCreate}
            className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-5 py-3 rounded-xl shadow-md flex items-center justify-center gap-2 text-sm transition-all flex-1 sm:flex-initial"
          >
            <Plus size={18} />
            <span>Input Manual / Izin</span>
          </button>
        </div>
      </div>
    </>
  );
}
