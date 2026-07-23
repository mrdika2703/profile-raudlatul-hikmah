import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../../../lib/axios";

import Header from "./Header";
import SearchBar from "./SearchBar";
import Table from "./Table";
import ModalCrud from "./ModalCrud";
import ModalDetail from "./ModalDetail";

export interface News {
  id: number;
  judul: string;
  kategori: string;
  keterangan: string | null;
  tanggal_kegiatan: string;
  gambar_1: string | null;
  gambar_2: string | null;
  gambar_3: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface NewsFormData {
  judul: string;
  kategori: string;
  keterangan: string;
  tanggal_kegiatan: string;
}

export default function ManageNews() {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  const [loading, setLoading] = useState(true);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");

  // Modal CRUD State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Modal Detail State
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  // Form Data State
  const [formData, setFormData] = useState<NewsFormData>({
    judul: "",
    kategori: "Kegiatan",
    keterangan: "",
    tanggal_kegiatan: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0],
  });

  // Files State
  const [files, setFiles] = useState<{
    gambar_1: File | null;
    gambar_2: File | null;
    gambar_3: File | null;
  }>({
    gambar_1: null,
    gambar_2: null,
    gambar_3: null,
  });

  // Existing images state for edit mode
  const [existingImages, setExistingImages] = useState<{
    gambar_1: string | null;
    gambar_2: string | null;
    gambar_3: string | null;
  }>({
    gambar_1: null,
    gambar_2: null,
    gambar_3: null,
  });

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await api.get("/news");
      setNewsList(response.data);
    } catch (error) {
      console.error("Gagal mengambil data berita:", error);
      toast.error("Gagal memuat data berita dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  // Dynamic Categories options
  const defaultCategories = [
    "Kegiatan",
    "Pengumuman",
    "Prestasi",
    "Acara",
    "Lainnya",
  ];
  const dynamicCategories = Array.from(
    new Set(newsList.map((n) => n.kategori).filter(Boolean)),
  );
  const categories = [
    "Semua Kategori",
    ...Array.from(new Set([...defaultCategories, ...dynamicCategories])),
  ];

  const filteredNews = newsList.filter((n) => {
    const matchesSearch = n.judul
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Semua Kategori" || n.kategori === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleOpenCreate = () => {
    setModalMode("create");
    setFormData({
      judul: "",
      kategori: "Kegiatan",
      keterangan: "",
      tanggal_kegiatan: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0],
    });
    setFiles({
      gambar_1: null,
      gambar_2: null,
      gambar_3: null,
    });
    setExistingImages({
      gambar_1: null,
      gambar_2: null,
      gambar_3: null,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: News) => {
    setModalMode("edit");
    setSelectedId(item.id);
    setFormData({
      judul: item.judul,
      kategori: item.kategori,
      keterangan: item.keterangan || "",
      tanggal_kegiatan: item.tanggal_kegiatan.split("T")[0],
    });
    setFiles({
      gambar_1: null,
      gambar_2: null,
      gambar_3: null,
    });
    setExistingImages({
      gambar_1: item.gambar_1,
      gambar_2: item.gambar_2,
      gambar_3: item.gambar_3,
    });
    setIsModalOpen(true);
  };

  const handleOpenDetail = (item: News) => {
    setSelectedNews(item);
    setIsDetailOpen(true);
  };

  const showSuccess = (msg: string) => {
    toast.success(msg);
  };

  const showError = (msg: string) => {
    toast.error(msg);
  };

  return (
    <div className="space-y-6">
      {/* Header & Action Button */}
      <Header handleOpenCreate={handleOpenCreate} />

      {/* Search Bar & Filter Kategori */}
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      {/* Tabel Data Berita */}
      <Table
        filteredNews={filteredNews}
        newsList={newsList}
        setNewsList={setNewsList}
        api={api}
        loading={loading}
        handleOpenEdit={handleOpenEdit}
        handleOpenDetail={handleOpenDetail}
        showSuccess={showSuccess}
        showError={showError}
      />

      {/* Modal Form CRUD */}
      <ModalCrud
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        modalMode={modalMode}
        api={api}
        selectedId={selectedId}
        fetchNews={fetchNews}
        formData={formData}
        setFormData={setFormData}
        files={files}
        setFiles={setFiles}
        existingImages={existingImages}
        showSuccess={showSuccess}
        showError={showError}
      />

      {/* Modal Detail Berita */}
      <ModalDetail
        isDetailOpen={isDetailOpen}
        setIsDetailOpen={setIsDetailOpen}
        selectedNews={selectedNews}
      />
    </div>
  );
}
