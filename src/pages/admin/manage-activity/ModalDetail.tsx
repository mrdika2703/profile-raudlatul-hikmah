import { X, Tag, Info } from "lucide-react";
import * as Icons from "lucide-react";
import type { Activity } from "./Index";
import { getStorageUrl } from "../../../lib/axios";

interface ModalDetailProps {
  isDetailOpen: boolean;
  setIsDetailOpen: (open: boolean) => void;
  selectedActivity: Activity | null;
}

export default function ModalDetail({
  isDetailOpen,
  setIsDetailOpen,
  selectedActivity,
}: ModalDetailProps) {
  if (!isDetailOpen || !selectedActivity) return null;

  const getImageUrl = getStorageUrl;

  const images = [
    selectedActivity.gambar_1 ? getImageUrl(selectedActivity.gambar_1) : null,
    selectedActivity.gambar_2 ? getImageUrl(selectedActivity.gambar_2) : null,
    selectedActivity.gambar_3 ? getImageUrl(selectedActivity.gambar_3) : null,
  ].filter(Boolean);

  const renderIcon = (iconName: string | null) => {
    if (!iconName) return <Icons.Compass className="text-slate-400" size={16} />;
    const IconComp = (Icons as any)[iconName];
    if (IconComp) {
      return <IconComp className="text-pink-600" size={16} />;
    }
    return <Icons.Compass className="text-slate-400" size={16} />;
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-pink-100 relative my-8 animate-scale-up">
        <button
          onClick={() => setIsDetailOpen(false)}
          className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 p-1 rounded-lg bg-slate-50"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2 text-xs font-bold text-pink-600 uppercase mb-2">
          <Tag size={14} />
          <span>{selectedActivity.kategori}</span>
          <span>•</span>
          <div className="flex items-center gap-1 bg-pink-50 border border-pink-100 px-2 py-0.5 rounded-lg">
            {renderIcon(selectedActivity.icon)}
            <span className="text-[10px] lowercase first-letter:uppercase">{selectedActivity.icon || "Compass"}</span>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          {selectedActivity.judul}
        </h2>

        {/* Galeri Gambar */}
        {images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img!}
                alt={`Gambar ${idx + 1}`}
                className="w-full h-40 object-cover rounded-2xl border border-slate-200 shadow-xs"
                decoding="async"
                loading="lazy"
              />
            ))}
          </div>
        ) : (
          <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-2.5 text-xs text-slate-500 font-medium">
            <Info size={16} className="text-slate-400" />
            <span>Belum ada foto kegiatan diunggah.</span>
          </div>
        )}

        {/* Content / Keterangan */}
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {selectedActivity.keterangan || "Tidak ada keterangan tambahan."}
        </div>

        <div className="pt-4 flex justify-end border-t border-slate-100 mt-6">
          <button
            onClick={() => setIsDetailOpen(false)}
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
