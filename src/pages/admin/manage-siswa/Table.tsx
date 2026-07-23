import { useState, useEffect } from "react";
import {
  Edit3,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { Siswa } from "./Index";
import ModalDelete from "../../../components/layout/Admin/ModalDelete";

const PER_PAGE = 20;

interface TableProps {
  filteredSiswas: Siswa[];
  siswas: Siswa[];
  setSiswas: (siswas: Siswa[]) => void;
  api: any;
  loading: boolean;
  handleOpenEdit: (siswa: Siswa) => void;
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
}

export default function Table({
  filteredSiswas,
  siswas,
  setSiswas,
  api,
  loading,
  handleOpenEdit,
  showSuccess,
  showError,
}: TableProps) {
  const [deleteTarget, setDeleteTarget] = useState<Siswa | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset ke halaman 1 saat filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredSiswas.length]);

  const totalPages = Math.max(1, Math.ceil(filteredSiswas.length / PER_PAGE));
  const startIdx = (currentPage - 1) * PER_PAGE;
  const paginatedSiswas = filteredSiswas.slice(startIdx, startIdx + PER_PAGE);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.delete(`/siswas/${deleteTarget.id}`);
      showSuccess(`Siswa "${deleteTarget.nama_lengkap}" berhasil dihapus.`);
      setSiswas(siswas.filter((s) => s.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      showError("Gagal menghapus data siswa. Silakan coba lagi.");
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
            <p className="text-sm font-medium">Memuat data siswa...</p>
          </div>
        ) : filteredSiswas.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <p className="font-semibold">Data siswa tidak ditemukan 🔍</p>
            <p className="text-xs text-slate-400 mt-1">
              Coba kata kunci lain atau tambah siswa baru.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-pink-50/50 text-pink-900 font-bold uppercase text-xs border-b border-pink-100">
                  <tr>
                    <th className="py-4 px-6">No</th>
                    <th className="py-4 px-6">NISN</th>
                    <th className="py-4 px-6">Nama Lengkap</th>
                    <th className="py-4 px-6">L/P</th>
                    <th className="py-4 px-6">Kelas</th>
                    <th className="py-4 px-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedSiswas.map((siswa, idx) => (
                    <tr
                      key={siswa.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-4 px-6 font-semibold text-slate-400">
                        {startIdx + idx + 1}
                      </td>
                      <td className="py-4 px-6 font-mono font-medium text-slate-700">
                        {siswa.nisn}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-800">
                        {siswa.nama_lengkap}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            siswa.jenis_kelamin === "Laki-laki"
                              ? "bg-sky-100 text-sky-700 border border-sky-200"
                              : "bg-pink-100 text-pink-700 border border-pink-200"
                          }`}
                        >
                          {siswa.jenis_kelamin === "Laki-laki" ? "L" : "P"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {(() => {
                          const kelas = siswa.kelas;
                          if (!kelas) return "-";
                          if (typeof kelas === "object") {
                            const sem = kelas.semester === "Ganjil" ? "1" : kelas.semester === "Genap" ? "2" : kelas.semester;
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
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleOpenEdit(siswa)}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                            title="Edit Siswa"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(siswa)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            title="Hapus Siswa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination & Count Info */}
            {filteredSiswas.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                <p className="text-xs font-medium text-slate-500">
                  Menampilkan {startIdx + 1}–
                  {Math.min(startIdx + PER_PAGE, filteredSiswas.length)} dari{" "}
                  {filteredSiswas.length} siswa
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
        title="Hapus Data Siswa"
        itemName={deleteTarget?.nama_lengkap}
        loading={isDeleting}
      />
    </>
  );
}
