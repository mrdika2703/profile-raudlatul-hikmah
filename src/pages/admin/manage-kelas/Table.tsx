import { useState, useEffect } from "react";
import {
  Edit3,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import type { Kelas } from "./Index";
import ModalDelete from "../../../components/layout/Admin/ModalDelete";

const PER_PAGE = 20;

interface TableProps {
  filteredKelas: Kelas[];
  kelasList: Kelas[];
  setKelasList: (kelas: Kelas[]) => void;
  api: any;
  loading: boolean;
  handleOpenEdit: (kelas: Kelas) => void;
  handleNaikKelas: (kelas: Kelas) => Promise<void>;
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
}

export default function Table({
  filteredKelas,
  kelasList,
  setKelasList,
  api,
  loading,
  handleOpenEdit,
  handleNaikKelas,
  showSuccess,
  showError,
}: TableProps) {
  const [deleteTarget, setDeleteTarget] = useState<Kelas | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [naikLoadingMap, setNaikLoadingMap] = useState<Record<number, boolean>>({});

  // Reset to page 1 when filtered list length changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredKelas.length]);

  const totalPages = Math.max(1, Math.ceil(filteredKelas.length / PER_PAGE));
  const startIdx = (currentPage - 1) * PER_PAGE;
  const paginatedKelas = filteredKelas.slice(startIdx, startIdx + PER_PAGE);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.delete(`/kelas/${deleteTarget.id}`);
      showSuccess(`Kelas "${deleteTarget.kelas}" berhasil dihapus.`);
      setKelasList(kelasList.filter((k) => k.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      showError("Gagal menghapus data kelas. Silakan coba lagi.");
    } finally {
      setIsDeleting(false);
    }
  };


  const triggerNaikKelas = async (kelas: Kelas) => {
    naikLoadingMap[kelas.id] = true;
    setNaikLoadingMap({ ...naikLoadingMap });
    try {
      await handleNaikKelas(kelas);
    } finally {
      naikLoadingMap[kelas.id] = false;
      setNaikLoadingMap({ ...naikLoadingMap });
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 size={32} className="animate-spin text-pink-500 mb-2" />
            <p className="text-sm font-medium">Memuat data kelas...</p>
          </div>
        ) : filteredKelas.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <p className="font-semibold">Data kelas tidak ditemukan 🔍</p>
            <p className="text-xs text-slate-400 mt-1">
              Coba kata kunci lain atau tambah kelas baru.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-pink-50/50 text-pink-900 font-bold uppercase text-xs border-b border-pink-100">
                  <tr>
                    <th className="py-4 px-6">No</th>
                    <th className="py-4 px-6">Kelas / Kelompok</th>
                    <th className="py-4 px-6">Semester</th>
                    <th className="py-4 px-6">Tahun Ajaran</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedKelas.map((item, idx) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-4 px-6 font-semibold text-slate-400">
                        {startIdx + idx + 1}
                      </td>
                      <td className="py-4 px-6 font-bold text-slate-800">
                        {item.kelas}
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-700">
                        {item.semester}
                      </td>
                      <td className="py-4 px-6 font-mono font-medium text-slate-700">
                        {item.tahun_ajaran}
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            item.status === "Aktif"
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {/* Naik Kelas Button */}
                          <button
                            onClick={() => triggerNaikKelas(item)}
                            disabled={naikLoadingMap[item.id]}
                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-xl transition-colors disabled:opacity-50"
                            title="Naik Semester / Tahun Ajaran"
                          >
                            {naikLoadingMap[item.id] ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <TrendingUp size={18} />
                            )}
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEdit(item)}
                            className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                            title="Edit Kelas"
                          >
                            <Edit3 size={18} />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => setDeleteTarget(item)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                            title="Hapus Kelas"
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
            {filteredKelas.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                <p className="text-xs font-medium text-slate-500">
                  Menampilkan {startIdx + 1}–
                  {Math.min(startIdx + PER_PAGE, filteredKelas.length)} dari{" "}
                  {filteredKelas.length} kelas
                </p>
                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentPage(i + 1)}
                        className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                          currentPage === i + 1
                            ? "bg-pink-600 text-white shadow-sm"
                            : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent transition-all"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <ModalDelete
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Hapus Data Kelas"
        itemName={deleteTarget ? deleteTarget.kelas : ""}
        loading={isDeleting}
      />
    </>
  );
}
