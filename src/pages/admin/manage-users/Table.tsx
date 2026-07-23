import { useState, useEffect } from "react";
import {
  Edit3,
  Trash2,
  Loader2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { User } from "./Index";
import ModalDelete from "../../../components/layout/Admin/ModalDelete";
import { getStorageUrl } from "../../../lib/axios";

const PER_PAGE = 20;

interface TableProps {
  filteredUsers: User[];
  usersList: User[];
  setUsersList: (users: User[]) => void;
  api: any;
  loading: boolean;
  handleOpenEdit: (user: User) => void;
  handleOpenDetail: (user: User) => void;
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
}

export default function Table({
  filteredUsers,
  usersList,
  setUsersList,
  api,
  loading,
  handleOpenEdit,
  handleOpenDetail,
  showSuccess,
  showError,
}: TableProps) {
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredUsers.length]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / PER_PAGE));
  const startIdx = (currentPage - 1) * PER_PAGE;
  const paginatedUsers = filteredUsers.slice(startIdx, startIdx + PER_PAGE);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.delete(`/users/${deleteTarget.id}`);
      showSuccess(`User "${deleteTarget.name}" berhasil dihapus.`);
      setUsersList(usersList.filter((u) => u.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (error) {
      showError("Gagal menghapus user. Silakan coba lagi.");
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
            <p className="text-sm font-medium">Memuat data user...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <p className="font-semibold">Data user tidak ditemukan 🔍</p>
            <p className="text-xs text-slate-400 mt-1">
              Coba kata kunci lain atau tambah user baru.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-pink-50/50 text-pink-900 font-bold uppercase text-xs border-b border-pink-100">
                  <tr>
                    <th className="py-4 px-6">No</th>
                    <th className="py-4 px-6">Foto</th>
                    <th className="py-4 px-6">Nama / Email</th>
                    <th className="py-4 px-6">Jabatan</th>
                    <th className="py-4 px-6">Kategori / Peran</th>
                    <th className="py-4 px-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedUsers.map((item, idx) => {
                    const avatarUrl = item.photo
                      ? getStorageUrl(item.photo)
                      : "/default/user-icon.webp";

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-4 px-6 font-semibold text-slate-400">
                          {startIdx + idx + 1}
                        </td>
                        <td className="py-4 px-6">
                          <img
                            src={avatarUrl || "/default/user-icon.webp"}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-full border border-slate-100"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "/default/user-icon.webp";
                            }}
                          />
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-800">{item.name}</span>
                            <span className="text-xs text-slate-400 font-mono mt-0.5">{item.email}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              item.position === "Kepala Sekolah"
                                ? "bg-purple-100 text-purple-700 border border-purple-200"
                                : item.position === "Operator"
                                ? "bg-amber-100 text-amber-700 border border-amber-200"
                                : "bg-sky-100 text-sky-700 border border-sky-200"
                            }`}
                          >
                            {item.position}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-semibold text-slate-700">
                          {item.category || "-"}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenDetail(item)}
                              className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                              title="Detail User"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                              title="Edit User"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(item)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                              title="Hapus User"
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

            {/* Pagination Panel */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
                <span className="text-xs text-slate-500 font-semibold">
                  Menampilkan {startIdx + 1} - {Math.min(startIdx + PER_PAGE, filteredUsers.length)} dari {filteredUsers.length} user
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        currentPage === p
                          ? "bg-pink-600 text-white shadow-md shadow-pink-100"
                          : "text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 text-slate-600 hover:bg-slate-200 rounded-lg disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ModalDelete
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title="Hapus Data User"
        description={`Apakah Anda yakin ingin menghapus user "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
        loading={isDeleting}
      />
    </>
  );
}
