import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../../../lib/axios";

import Header from "./Header";
import Table from "./Table";
import ModalCreate from "./ModalCreate";
import ModalEdit from "./ModalEdit";

export interface Rapor {
  id: number;
  siswa_id: number;
  tanggal: string;
  kegiatan: string;
  siswa: {
    id: number;
    nisn: string;
    nama_lengkap: string;
    kelas: any;
  };
}

export default function ManageRapor() {
  const [rapors, setRapors] = useState<Rapor[]>([]);
  const [kelasList, setKelasList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterDate, setFilterDate] = useState(
    new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0],
  );
  const [filterKelas, setFilterKelas] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<{
    tanggal: string;
    kelas_id: string;
    kegiatan: string;
  } | null>(null);

  const fetchKelasList = async () => {
    try {
      const response = await api.get("/kelas");
      const active = response.data.filter((k: any) => k.status === "Aktif");
      setKelasList(active);
      // Default to first active kelas if none selected
      if (active.length > 0 && !filterKelas) {
        setFilterKelas(active[0].id.toString());
      }
    } catch (error) {
      console.error("Gagal memuat data kelas:", error);
    }
  };

  const fetchRapors = async () => {
    if (!filterKelas) return;
    setLoading(true);
    try {
      const response = await api.get(
        `/rapor?tanggal=${filterDate}&kelas_id=${filterKelas}`,
      );
      setRapors(response.data);
    } catch (error) {
      console.error("Gagal memuat data rapor:", error);
      toast.error("Gagal memuat data rapor dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKelasList();
  }, []);

  useEffect(() => {
    fetchRapors();
  }, [filterDate, filterKelas]);

  const filteredRapors = rapors.filter((r) =>
    r.siswa?.nama_lengkap?.toLowerCase().includes(searchQuery.toLowerCase()),
  );  const handleOpenEdit = (rapor: Rapor) => {
    setEditTarget({
      tanggal: rapor.tanggal,
      kelas_id: rapor.siswa?.kelas?.id?.toString() || "",
      kegiatan: rapor.kegiatan,
    });
  };
  const daftarKelas = kelasList.map((k) => {
    const displaySemester =
      k.semester === "Ganjil" ? "1" : k.semester === "Genap" ? "2" : k.semester;
    return {
      id: k.id.toString(),
      display: `Kelas ${k.kelas} ${k.tahun_ajaran} - ${displaySemester}`,
    };
  });

  const showSuccess = (msg: string) => toast.success(msg);
  const showError = (msg: string) => toast.error(msg);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Filter */}
      <Header
        filterDate={filterDate}
        setFilterDate={setFilterDate}
        daftarKelas={daftarKelas}
        filterKelas={filterKelas}
        setFilterKelas={setFilterKelas}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        fetchRapors={fetchRapors}
        handleOpenCreate={() => setIsCreateOpen(true)}
      />

      {/* Tabel Data Rapor */}
      <Table
        loading={loading}
        filteredRapors={filteredRapors}
        rapors={rapors}
        setRapors={setRapors}
        api={api}
        handleOpenEdit={handleOpenEdit}
        showSuccess={showSuccess}
        showError={showError}
      />

      {/* Modal Tambah Kegiatan (Bulk Create) */}
      <ModalCreate
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        kelasList={kelasList}
        fetchRapors={fetchRapors}
        showSuccess={showSuccess}
        showError={showError}
      />

      {/* Modal Edit Kegiatan (Bulk Edit) */}
      <ModalEdit
        isOpen={!!editTarget}
        onClose={() => setEditTarget(null)}
        kelasList={kelasList}
        fetchRapors={fetchRapors}
        showSuccess={showSuccess}
        showError={showError}
        defaultData={editTarget}
      />
    </div>
  );
}
