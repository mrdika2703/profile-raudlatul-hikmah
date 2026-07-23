import { useState, useEffect } from "react";
import { toast } from "sonner";
import api from "../../../lib/axios";

import Header from "./Header";
import Table from "./Table";

export interface HistoryData {
  id: number;
  user_id: number;
  category: string;
  keterangan: string;
  date: string;
  created_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export default function ManageHistory() {
  const [histories, setHistories] = useState<HistoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua Kategori");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchHistories = async () => {
    setLoading(true);
    try {
      const response = await api.get("/history");
      setHistories(response.data);
    } catch (error) {
      console.error("Gagal mengambil data history:", error);
      toast.error("Gagal memuat data riwayat dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistories();
  }, []);

  // Filter logic on client side
  const categories = Array.from(new Set(histories.map((h) => h.category)));

  const filteredHistories = histories.filter((h) => {
    const matchesSearch =
      h.keterangan.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.user?.name?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "Semua Kategori" || h.category === selectedCategory;

    const matchesDate =
      !filterDate || h.date.split("T")[0] === filterDate;

    return matchesSearch && matchesCategory && matchesDate;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <Header
        filterDate={filterDate}
        setFilterDate={setFilterDate}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        fetchHistories={fetchHistories}
      />

      <Table loading={loading} filteredHistories={filteredHistories} />
    </div>
  );
}
