import { useState, useEffect } from "react";
import {
  Edit3,
  Trash2,
  Loader2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { News } from "./Index";
import ModalDelete from "../../../components/layout/Admin/ModalDelete";

const PER_PAGE = 20;

interface TableProps {
  filteredNews: News[];
  newsList: News[];
  setNewsList: (news: News[]) => void;
  api: any;
  loading: boolean;
  handleOpenEdit: (news: News) => void;
  handleOpenDetail: (news: News) => void;
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
}

export default function Table({
  filteredNews,
  newsList,
  setNewsList,
  api,
  loading,
  handleOpenEdit,
  handleOpenDetail,
  showSuccess,
  showError,
}: TableProps) {
  const [deleteTarget, setDeleteTarget] = useState<News | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredNews.length]);

  const totalPages = Math.max(1, Math.ceil(filteredNews.length / PER_PAGE));
  const startIdx = (currentPage - 1) * PER_PAGE;
  const paginatedNews = filteredNews.slice(startIdx, startIdx + PER_PAGE);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.delete(`/news/${deleteTarget.id}`);
      showSuccess(`Berita "${deleteTarget.judul}" berhasil dihapus.`);
      setNewsList(newsList.filter((n) => n.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      showError("Gagal menghapus berita. Silakan coba lagi.");
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 size={32} className="animate-spin text-pink-500 mb-2" />
            <p className="text-sm font-medium">Memuat data berita...</p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <p className="font-semibold">Data berita tidak ditemukan 🔍</p>
            <p className="text-xs text-slate-400 mt-1">
              Coba kata kunci lain atau tambah berita baru.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-pink-50/50 text-pink-900 font-bold uppercase text-xs border-b border-pink-100">
                  <tr>
                    <th className="py-4 px-6">No</th>
                    <th className="py-4 px-6">Judul Berita</th>
                    <th className="py-4 px-6">Kategori</th>
                    <th className="py-4 px-6">Tanggal Kegiatan</th>
                    <th className="py-4 px-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedNews.map((item, idx) => {
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-4 px-6 font-semibold text-slate-400">
                          {startIdx + idx + 1}
                        </td>
                        <td className="py-4 px-6 font-bold text-slate-800 max-w-xs truncate">
                          {item.judul}
                        </td>
                        <td className="py-4 px-6">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-pink-100 text-pink-700 border border-pink-200">
                            {item.kategori}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-medium text-slate-700 whitespace-nowrap">
                          {formatDate(item.tanggal_kegiatan)}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenDetail(item)}
                              className="p-2 text-sky-600 hover:bg-sky-50 rounded-xl transition-colors"
                              title="Lihat Detail"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                              title="Edit Berita"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(item)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                              title="Hapus Berita"
                            >
                              <Trash2 size={18} />
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
            {filteredNews.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                <p className="text-xs font-medium text-slate-500">
                  Menampilkan {startIdx + 1}–
                  {Math.min(startIdx + PER_PAGE, filteredNews.length)} dari{" "}
                  {filteredNews.length} berita
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
        title="Hapus Berita"
        itemName={deleteTarget?.judul}
        loading={isDeleting}
      />
    </>
  );
}
