import { useState, useEffect } from "react";
import {
  Edit3,
  Loader2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import ModalDelete from "../../../components/layout/Admin/ModalDelete";

const PER_PAGE = 20;

interface TableProps {
  loading: boolean;
  filteredAbsensis: any[];
  absensis: any[];
  setAbsensis: (list: any[]) => void;
  api: any;
  handleOpenEdit: (absen: any) => void;
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
}

export default function Table({
  loading,
  filteredAbsensis,
  absensis,
  setAbsensis,
  api,
  handleOpenEdit,
  showSuccess,
  showError,
}: TableProps) {
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredAbsensis.length]);

  const totalPages = Math.max(1, Math.ceil(filteredAbsensis.length / PER_PAGE));
  const startIdx = (currentPage - 1) * PER_PAGE;
  const paginatedAbsensis = filteredAbsensis.slice(
    startIdx,
    startIdx + PER_PAGE,
  );

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.delete(`/absensis/${deleteTarget.id}`);
      showSuccess(
        `Data absensi "${deleteTarget.siswa?.nama_lengkap}" berhasil dihapus.`,
      );
      setAbsensis(absensis.filter((a: any) => a.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      showError("Gagal menghapus data absensi. Silakan coba lagi.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 size={32} className="animate-spin text-pink-500 mb-2" />
            <p className="text-sm font-medium">Memuat riwayat absensi...</p>
          </div>
        ) : filteredAbsensis.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <p className="font-bold text-base text-slate-700">
              Belum ada siswa yang absen pada tanggal ini 🔍
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Klik tombol "Buka Kamera Absensi" di atas untuk mulai memindai QR
              Code siswa.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-pink-50/50 text-pink-900 font-bold uppercase text-xs border-b border-pink-100">
                  <tr>
                    <th className="py-4 px-6">Waktu</th>
                    <th className="py-4 px-6">Nama Siswa</th>
                    <th className="py-4 px-6">Kelas</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6">Keterangan</th>
                    <th className="py-4 px-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedAbsensis.map((absen: any) => {
                    const jam = new Date(absen.absen_date).toLocaleTimeString(
                      "id-ID",
                      { hour: "2-digit", minute: "2-digit" },
                    );
                    return (
                      <tr
                        key={absen.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-4 px-6 font-mono font-bold text-slate-700">
                          {jam} WIB
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-800">
                          {absen.siswa?.nama_lengkap}
                        </td>
                        <td className="py-4 px-6">
                          {(() => {
                            const kelas = absen.siswa?.kelas;
                            if (!kelas) return "-";
                            if (typeof kelas === "object") {
                              const sem =
                                kelas.semester === "Ganjil"
                                  ? "1"
                                  : kelas.semester === "Genap"
                                    ? "2"
                                    : kelas.semester;
                              return (
                                <div className="flex flex-col text-slate-700 leading-tight">
                                  <span className="font-bold text-xs">
                                    Kelas {kelas.kelas} | {sem}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                                    {kelas.tahun_ajaran}
                                  </span>
                                </div>
                              );
                            }
                            return (
                              <span className="bg-slate-100 text-slate-700 font-semibold text-xs px-2.5 py-1 rounded-lg">
                                {String(kelas)}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${
                              absen.status === "Hadir"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : absen.status === "Izin"
                                  ? "bg-sky-50 text-sky-700 border-sky-200"
                                  : absen.status === "Sakit"
                                    ? "bg-amber-50 text-amber-700 border-amber-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            {absen.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-xs text-slate-500 italic max-w-xs truncate">
                          {absen.keterangan || "-"}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <button
                              onClick={() => handleOpenEdit(absen)}
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                              title="Edit Status"
                            >
                              <Edit3 size={16} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(absen)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                              title="Hapus Absen"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination & Count Info */}
            {filteredAbsensis.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                <p className="text-xs font-medium text-slate-500">
                  Menampilkan {startIdx + 1}–
                  {Math.min(startIdx + PER_PAGE, filteredAbsensis.length)} dari{" "}
                  {filteredAbsensis.length} data absensi
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

      {/* Modal Konfirmasi Hapus */}
      <ModalDelete
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Hapus Riwayat Absen"
        itemName={deleteTarget?.siswa?.nama_lengkap}
        loading={isDeleting}
      />
    </>
  );
}
