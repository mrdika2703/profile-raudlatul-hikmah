import { Trash2, Loader2, X } from "lucide-react";

export interface ModalDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  itemName?: string;
  loading?: boolean;
}

export default function ModalDelete({
  isOpen,
  onClose,
  onConfirm,
  title = "Hapus Data",
  description,
  itemName,
  loading = false,
}: ModalDeleteProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-pink-100 relative animate-scale-up text-center">
        {/* Tombol Close */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-lg bg-slate-50 transition-colors disabled:opacity-50"
        >
          <X size={18} />
        </button>

        {/* Icon Peringatan Hapus */}
        <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-4 shadow-sm">
          <Trash2 size={28} />
        </div>

        {/* Judul & Deskripsi */}
        <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          {description ? (
            description
          ) : (
            <>
              Apakah Anda yakin ingin menghapus{" "}
              {itemName ? (
                <span className="font-bold text-slate-700">"{itemName}"</span>
              ) : (
                "data ini"
              )}
              ? Tindakan ini tidak dapat dibatalkan.
            </>
          )}
        </p>

        {/* Tombol Aksi */}
        <div className="flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-1/2 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="w-1/2 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm shadow-md shadow-red-200 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Menghapus...</span>
              </>
            ) : (
              <span>Ya, Hapus</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
