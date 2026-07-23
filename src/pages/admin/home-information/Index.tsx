import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../../../lib/axios";

import Header from "./Header";
import Table from "./Table";
import ModalCrud from "./ModalCrud";

export interface ProgramUnggulan {
  id: number;
  judul: string;
  keterangan: string;
  icon: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface VisiMisi {
  id: number;
  kategori: "Visi" | "Misi";
  keterangan: string;
  created_at?: string;
  updated_at?: string;
}

export default function ManageHomeInformation() {
  const [activeTab, setActiveTab] = useState<"program_unggulan" | "visi_misi">(
    "program_unggulan",
  );
  const [programList, setProgramList] = useState<ProgramUnggulan[]>([]);
  const [visiMisiList, setVisiMisiList] = useState<VisiMisi[]>([]);

  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  // Modal CRUD State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Form States
  const [programForm, setProgramForm] = useState({
    judul: "",
    keterangan: "",
    icon: "Sparkles",
  });

  const [visiMisiForm, setVisiMisiForm] = useState<{
    kategori: "Visi" | "Misi";
    keterangan: string;
  }>({
    kategori: "Visi",
    keterangan: "",
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/home-information");
      if (response.data) {
        if (Array.isArray(response.data.program_unggulan)) {
          setProgramList(response.data.program_unggulan);
        }
        if (Array.isArray(response.data.visi_misi)) {
          setVisiMisiList(response.data.visi_misi);
        }
      }
    } catch (error) {
      console.error("Gagal mengambil data informasi beranda:", error);
      toast.error("Gagal memuat data informasi beranda dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Filtered Data (tanpa search bar)
  const filteredData =
    activeTab === "program_unggulan" ? programList : visiMisiList;

  // Cek apakah Visi sudah ada
  const hasVisi = visiMisiList.some(
    (v) => v.kategori === "Visi" && v.id !== selectedId,
  );

  const handleOpenCreate = () => {
    if (activeTab === "program_unggulan" && programList.length >= 4) {
      toast.error("Batas maksimal 4 Program Unggulan telah tercapai.");
      return;
    }

    setModalMode("create");
    setSelectedId(null);
    if (activeTab === "program_unggulan") {
      setProgramForm({ judul: "", keterangan: "", icon: "Sparkles" });
    } else {
      const existingVisi = visiMisiList.some((v) => v.kategori === "Visi");
      setVisiMisiForm({
        kategori: existingVisi ? "Misi" : "Visi",
        keterangan: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setModalMode("edit");
    setSelectedId(item.id);
    if (activeTab === "program_unggulan") {
      setProgramForm({
        judul: item.judul,
        keterangan: item.keterangan,
        icon: item.icon || "Sparkles",
      });
    } else {
      setVisiMisiForm({
        kategori: item.kategori,
        keterangan: item.keterangan,
      });
    }
    setIsModalOpen(true);
  };

  const showSuccess = (msg: string) => {
    toast.success(msg);
  };

  const showError = (msg: string) => {
    toast.error(msg);
  };

  return (
    <div className="space-y-6">
      {/* Header & Tab Switcher */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        handleOpenCreate={handleOpenCreate}
        programCount={programList.length}
      />

      {/* Tabel Data Information */}
      <Table
        activeTab={activeTab}
        programList={programList}
        setProgramList={setProgramList}
        visiMisiList={visiMisiList}
        setVisiMisiList={setVisiMisiList}
        filteredData={filteredData}
        api={api}
        loading={loading}
        handleOpenEdit={handleOpenEdit}
        showSuccess={showSuccess}
        showError={showError}
      />

      {/* Modal CRUD Form */}
      <ModalCrud
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        modalMode={modalMode}
        activeTab={activeTab}
        api={api}
        selectedId={selectedId}
        fetchData={fetchData}
        programForm={programForm}
        setProgramForm={setProgramForm}
        visiMisiForm={visiMisiForm}
        setVisiMisiForm={setVisiMisiForm}
        hasVisi={hasVisi}
        showSuccess={showSuccess}
        showError={showError}
      />
    </div>
  );
}
