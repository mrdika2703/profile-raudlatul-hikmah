import { useState, useEffect } from "react";
import {
  Edit3,
  Trash2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import type { ProgramUnggulan, VisiMisi } from "./Index";
import ModalDelete from "../../../components/layout/Admin/ModalDelete";

const PER_PAGE = 20;

interface TableProps {
  activeTab: "program_unggulan" | "visi_misi";
  programList: ProgramUnggulan[];
  setProgramList: React.Dispatch<React.SetStateAction<ProgramUnggulan[]>>;
  visiMisiList: VisiMisi[];
  setVisiMisiList: React.Dispatch<React.SetStateAction<VisiMisi[]>>;
  filteredData: any[];
  api: any;
  loading: boolean;
  handleOpenEdit: (item: any) => void;
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
}

export default function Table({
  activeTab,
  programList,
  setProgramList,
  visiMisiList,
  setVisiMisiList,
  filteredData,
  api,
  loading,
  handleOpenEdit,
  showSuccess,
  showError,
}: TableProps) {
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredData.length, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PER_PAGE));
  const startIdx = (currentPage - 1) * PER_PAGE;
  const paginatedData = filteredData.slice(startIdx, startIdx + PER_PAGE);

  const renderLucideIcon = (iconName: string | null) => {
    if (!iconName) return <Sparkles size={20} className="text-pink-600" />;
    const MaybeIcon = (LucideIcons as Record<string, any>)[iconName];
    const IconComponent =
      typeof MaybeIcon === "function" || (MaybeIcon && typeof MaybeIcon === "object" && "$$typeof" in MaybeIcon)
        ? MaybeIcon
        : Sparkles;
    return <IconComponent size={20} className="text-pink-600" />;
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await api.delete(`/home-information/${deleteTarget.id}?type=${activeTab}`);
      if (activeTab === "program_unggulan") {
        showSuccess(`Program "${deleteTarget.judul}" berhasil dihapus.`);
        setProgramList(programList.filter((item) => item.id !== deleteTarget.id));
      } else {
        showSuccess(`Data ${deleteTarget.kategori} berhasil dihapus.`);
        setVisiMisiList(
          visiMisiList.filter((item) => item.id !== deleteTarget.id),
        );
      }
      setDeleteTarget(null);
    } catch (error) {
      showError("Gagal menghapus data. Silakan coba lagi.");
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
            <p className="text-sm font-medium">Memuat data informasi...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-16 text-center text-slate-500">
            <p className="font-semibold">Data tidak ditemukan 🔍</p>
            <p className="text-xs text-slate-400 mt-1">
              Coba kata kunci lain atau tambah data baru.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-pink-50/50 text-pink-900 font-bold uppercase text-xs border-b border-pink-100">
                  <tr>
                    <th className="py-4 px-6">No</th>
                    {activeTab === "program_unggulan" ? (
                      <>
                        <th className="py-4 px-6">Icon</th>
                        <th className="py-4 px-6">Judul Program</th>
                        <th className="py-4 px-6">Keterangan</th>
                      </>
                    ) : (
                      <>
                        <th className="py-4 px-6">Kategori</th>
                        <th className="py-4 px-6">Isi Visi / Misi</th>
                      </>
                    )}
                    <th className="py-4 px-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedData.map((item, idx) => {
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="py-4 px-6 font-semibold text-slate-400">
                          {startIdx + idx + 1}
                        </td>

                        {activeTab === "program_unggulan" ? (
                          <>
                            <td className="py-4 px-6">
                              <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-100 flex items-center justify-center shrink-0 shadow-xs">
                                {renderLucideIcon(item.icon)}
                              </div>
                            </td>
                            <td className="py-4 px-6 font-bold text-slate-800">
                              {item.judul}
                            </td>
                            <td className="py-4 px-6 text-slate-600 max-w-md">
                              {item.keterangan}
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="py-4 px-6">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  item.kategori === "Visi"
                                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                                    : "bg-pink-100 text-pink-700 border border-pink-200"
                                }`}
                              >
                                {item.kategori}
                              </span>
                            </td>
                            <td className="py-4 px-6 font-medium text-slate-700 max-w-lg">
                              {item.keterangan}
                            </td>
                          </>
                        )}

                        <td className="py-4 px-6 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-2 text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                              title="Edit Data"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button
                              onClick={() => setDeleteTarget(item)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                              title="Hapus Data"
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
            {filteredData.length > 0 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                <p className="text-xs font-medium text-slate-500">
                  Menampilkan {startIdx + 1}–
                  {Math.min(startIdx + PER_PAGE, filteredData.length)} dari{" "}
                  {filteredData.length} data
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
        title={`Hapus ${activeTab === "program_unggulan" ? "Program Unggulan" : "Visi / Misi"}`}
        itemName={deleteTarget?.judul || deleteTarget?.kategori}
        loading={isDeleting}
      />
    </>
  );
}
