import { useState, useEffect } from "react";
import { Loader2, ChevronLeft, ChevronRight, Clock, User } from "lucide-react";
import type { HistoryData } from "./Index";

const PER_PAGE = 20;

interface TableProps {
  loading: boolean;
  filteredHistories: HistoryData[];
}

export default function Table({ loading, filteredHistories }: TableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredHistories.length]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredHistories.length / PER_PAGE),
  );
  const startIdx = (currentPage - 1) * PER_PAGE;
  const paginatedHistories = filteredHistories.slice(
    startIdx,
    startIdx + PER_PAGE,
  );

  const getCategoryStyles = (category: string) => {
    switch (category.toLowerCase()) {
      case "absen":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "tambah":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "edit":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "hapus":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400">
          <Loader2 size={32} className="animate-spin text-pink-500 mb-2" />
          <p className="text-sm font-medium">Memuat riwayat aktivitas...</p>
        </div>
      ) : filteredHistories.length === 0 ? (
        <div className="py-16 text-center text-slate-500">
          <p className="font-bold text-base text-slate-700">
            Tidak ada riwayat aktivitas ditemukan 🔍
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Gunakan filter lain atau refresh data log.
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-pink-50/50 text-pink-900 font-bold uppercase text-xs border-b border-pink-100">
                <tr>
                  <th className="py-4 px-6">Waktu</th>
                  <th className="py-4 px-6">Kategori</th>
                  <th className="py-4 px-6">Pengguna</th>
                  <th className="py-4 px-6">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedHistories.map((log) => {
                  const logDate = new Date(log.date);
                  const formattedTime = logDate.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });
                  const formattedDate = logDate.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });

                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex flex-col leading-tight">
                          <span className="font-bold text-xs text-slate-700 flex items-center gap-1">
                            <Clock size={12} className="text-pink-500" />
                            {formattedTime} WIB
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            {formattedDate}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${getCategoryStyles(
                            log.category,
                          )}`}
                        >
                          {log.category}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-xs text-slate-800">
                          {log.user?.name || "Sistem"}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-700 max-w-md font-medium">
                        {log.keterangan}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination & Count Info */}
          {filteredHistories.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
              <p className="text-xs font-medium text-slate-500">
                Menampilkan {startIdx + 1}–
                {Math.min(startIdx + PER_PAGE, filteredHistories.length)} dari{" "}
                {filteredHistories.length} log riwayat
              </p>
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`min-w-[36px] h-9 rounded-xl text-xs font-bold transition-colors ${
                          currentPage === page
                            ? "bg-pink-600 text-white shadow-md shadow-pink-200"
                            : "text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
