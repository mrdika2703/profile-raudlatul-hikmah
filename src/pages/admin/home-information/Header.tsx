import { House, Plus, Sparkles, Target } from "lucide-react";

interface HeaderProps {
  activeTab: "program_unggulan" | "visi_misi";
  setActiveTab: (tab: "program_unggulan" | "visi_misi") => void;
  handleOpenCreate: () => void;
  programCount: number;
}

export default function Header({
  activeTab,
  setActiveTab,
  handleOpenCreate,
  programCount,
}: HeaderProps) {
  const isProgramDisabled = activeTab === "program_unggulan" && programCount >= 4;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <House className="text-pink-600" />
            <span>Kelola Informasi Beranda</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola data Program Unggulan serta Visi & Misi TK Raudlatul Hikmah
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          disabled={isProgramDisabled}
          title={
            isProgramDisabled
              ? "Batas maksimal 4 Program Unggulan telah tercapai"
              : undefined
          }
          className="bg-pink-600 hover:bg-pink-700 text-white font-bold px-4 py-2.5 rounded-xl shadow-md shadow-pink-200 flex items-center justify-center gap-2 text-sm transition-all w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:bg-slate-300 disabled:text-slate-600"
        >
          <Plus size={18} />
          <span>
            {activeTab === "program_unggulan"
              ? programCount >= 4
                ? "Tambah Program (Maks 4)"
                : "Tambah Program Unggulan"
              : "Tambah Visi / Misi"}
          </span>
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-100 pb-1">
        <button
          onClick={() => setActiveTab("program_unggulan")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === "program_unggulan"
              ? "bg-pink-600 text-white shadow-md shadow-pink-200"
              : "text-slate-600 hover:bg-pink-50 hover:text-pink-600"
          }`}
        >
          <Sparkles size={16} />
          <span>Program Unggulan ({programCount}/4)</span>
        </button>

        <button
          onClick={() => setActiveTab("visi_misi")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all ${
            activeTab === "visi_misi"
              ? "bg-pink-600 text-white shadow-md shadow-pink-200"
              : "text-slate-600 hover:bg-pink-50 hover:text-pink-600"
          }`}
        >
          <Target size={16} />
          <span>Visi & Misi</span>
        </button>
      </div>
    </div>
  );
}
