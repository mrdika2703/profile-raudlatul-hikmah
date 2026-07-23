import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  DoorClosed,
  UserRoundPlus,
  BookOpen,
  QrCode,
  // ArrowUpRight,
  TrendingUp,
  Activity,
  History,
  Loader2,
  NotebookPen,
} from "lucide-react";
import api from "../../../lib/axios";

interface DashboardData {
  stats: {
    total_siswa: number;
    total_kelas: number;
    total_users: number;
    total_rapor: number;
  };
  gender_breakdown: {
    laki_laki: number;
    perempuan: number;
  };
  absensi_today: {
    hadir: number;
    sakit: number;
    izin: number;
    alpa: number;
  };
  kelas_stats: Array<{
    id: number;
    kelas: string;
    semester: string;
    tahun_ajaran: string;
    total_siswa: number;
  }>;
  recent_histories: Array<{
    id: number;
    user_name: string;
    category: string;
    keterangan: string;
    date: string;
  }>;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/dashboard");
      setData(response.data);
    } catch (error) {
      console.error("Gagal memuat data dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400">
        <Loader2 size={40} className="animate-spin text-pink-500 mb-2" />
        <p className="text-sm font-semibold">Memuat dashboard...</p>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Siswa",
      value: data?.stats.total_siswa ?? 0,
      desc: "Anak didik terdaftar",
      icon: Users,
      color: "bg-pink-50 text-pink-600 border-pink-100",
    },
    {
      title: "Kelas Aktif",
      value: data?.stats.total_kelas ?? 0,
      desc: "Kelompok belajar aktif",
      icon: DoorClosed,
      color: "bg-purple-50 text-purple-600 border-purple-100",
    },
    {
      title: "Data Rapor",
      value: data?.stats.total_rapor ?? 0,
      desc: "Catatan harian siswa",
      icon: BookOpen,
      color: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    {
      title: "Pengguna Sistem",
      value: data?.stats.total_users ?? 0,
      desc: "Guru & Staf terdaftar",
      icon: UserRoundPlus,
      color: "bg-amber-50 text-amber-600 border-amber-100",
    },
  ];

  // Colors for history categories
  const getCategoryStyles = (category: string) => {
    switch (category.toLowerCase()) {
      case "absen":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "tambah":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "edit":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "hapus":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. HERO BANNER: SCAN QR HIGHLIGHT */}
      <div className="bg-gradient-to-r from-pink-600 via-pink-500 to-purple-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-pink-200 flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="max-w-xl text-center lg:text-left">
          <span className="bg-white/20 text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Presensi Cepat QR Code
          </span>
          <h2 className="text-2xl font-black mt-3 leading-tight">
            Scan QR Code Absensi Siswa
          </h2>
          <p className="text-pink-100 text-sm mt-2 leading-relaxed">
            Pindai kartu QR Code milik siswa untuk melakukan absensi otomatis
            tanpa repot mengetik data.
          </p>
        </div>
        <div className="flex w-full flex-col gap-4 md:items-end">
          <Link
            to="/admin/absen?scan=true"
            className="px-10 py-5 bg-white text-pink-600 hover:bg-pink-50 active:bg-pink-100 rounded-2xl font-black text-base shadow-lg hover:shadow-xl transition-all flex justify-center gap-3 shrink-0 transform hover:-translate-y-0.5"
          >
            <QrCode size={24} className="text-pink-600 animate-pulse" />
            <span>Kamera Absensi</span>
            {/* <ArrowUpRight size={16} className="text-pink-400" /> */}
          </Link>
          <Link
            to="/admin/rapor"
            className="px-10 py-5 bg-white text-pink-600 hover:bg-pink-50 active:bg-pink-100 rounded-2xl font-black text-base shadow-lg hover:shadow-xl transition-all flex justify-center gap-3 shrink-0 transform hover:-translate-y-0.5"
          >
            <NotebookPen size={24} className="text-pink-600 animate-pulse" />
            <span>Rapor Siswa</span>
            {/* <ArrowUpRight size={16} className="text-pink-400" /> */}
          </Link>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-2xs hover:shadow-sm transition-all hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center border ${stat.color}`}
                >
                  <Icon size={24} />
                </div>
              </div>
              <h3 className="text-3xl font-black text-slate-800">
                {stat.value}
              </h3>
              <p className="text-sm font-extrabold text-slate-700 mt-1">
                {stat.title}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{stat.desc}</p>
            </div>
          );
        })}
      </div>

      {/* 3. MIDDLE SECTION: PRESENSI & KELAS STATS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Presensi Hari Ini */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-lg text-slate-800">
                  Kehadiran Hari Ini
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Statistik absensi tanggal{" "}
                  {new Date().toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
              <Activity className="text-pink-600" size={20} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4 text-center">
                <span className="text-xs font-extrabold text-emerald-700 block uppercase">
                  Hadir
                </span>
                <span className="text-2xl font-black text-emerald-600 block mt-1">
                  {data?.absensi_today.hadir ?? 0}
                </span>
              </div>
              <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4 text-center">
                <span className="text-xs font-extrabold text-amber-700 block uppercase">
                  Izin
                </span>
                <span className="text-2xl font-black text-amber-600 block mt-1">
                  {data?.absensi_today.izin ?? 0}
                </span>
              </div>
              <div className="bg-sky-50/50 border border-sky-100 rounded-xl p-4 text-center">
                <span className="text-xs font-extrabold text-sky-700 block uppercase">
                  Sakit
                </span>
                <span className="text-2xl font-black text-sky-600 block mt-1">
                  {data?.absensi_today.sakit ?? 0}
                </span>
              </div>
              <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4 text-center">
                <span className="text-xs font-extrabold text-rose-700 block uppercase">
                  Alpa
                </span>
                <span className="text-2xl font-black text-rose-600 block mt-1">
                  {data?.absensi_today.alpa ?? 0}
                </span>
              </div>
            </div>
          </div>

          <Link
            to="/admin/absen"
            className="w-full mt-6 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl text-xs text-center block transition-all"
          >
            Lihat Detail Absensi
          </Link>
        </div>

        {/* Siswa Per Kelas Aktif */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-lg text-slate-800">
                  Daftar Kelas Aktif
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Jumlah siswa per kelompok kelas aktif saat ini
                </p>
              </div>
              <TrendingUp className="text-pink-600" size={20} />
            </div>

            <div className="space-y-4">
              {data?.kelas_stats.length === 0 ? (
                <p className="text-sm text-slate-400 italic text-center py-6">
                  Tidak ada data kelas aktif.
                </p>
              ) : (
                data?.kelas_stats.map((k) => (
                  <div
                    key={k.id}
                    className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl"
                  >
                    <div className="flex flex-col">
                      <span className="font-extrabold text-sm text-slate-800">
                        Kelas {k.kelas}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        Tahun Ajaran {k.tahun_ajaran} | Sem.{" "}
                        {k.semester === "Ganjil" ? "1" : "2"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 font-extrabold text-xs bg-pink-50 border border-pink-100 text-pink-600 px-3 py-1.5 rounded-lg shadow-2xs">
                      <Users size={12} />
                      <span>{k.total_siswa} Siswa</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link
            to="/admin/kelas"
            className="w-full mt-6 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl text-xs text-center block transition-all"
          >
            Kelola Kelas
          </Link>
        </div>
      </div>

      {/* 4. RECENT HISTORY SECTION */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-lg text-slate-800">
              Riwayat Aktivitas Terbaru
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              5 log aktivitas guru dan sistem paling baru
            </p>
          </div>
          <History className="text-pink-600" size={20} />
        </div>

        <div className="divide-y divide-slate-100">
          {data?.recent_histories.length === 0 ? (
            <p className="text-sm text-slate-400 italic text-center py-6">
              Belum ada riwayat aktivitas log.
            </p>
          ) : (
            data?.recent_histories.map((log) => {
              const logDate = new Date(log.date);
              const formattedTime = logDate.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              });
              const formattedDate = logDate.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });

              return (
                <div
                  key={log.id}
                  className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={`px-2.5 py-1.5 rounded-lg text-[10px] font-extrabold border shrink-0 ${getCategoryStyles(
                        log.category,
                      )}`}
                    >
                      {log.category}
                    </span>
                    <div className="flex flex-col">
                      <p className="text-xs font-bold text-slate-700 leading-normal">
                        {log.keterangan}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-0.5">
                        Oleh:{" "}
                        <span className="font-semibold text-slate-500">
                          {log.user_name}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-1">
                    <span className="text-[10px] font-bold text-slate-500">
                      {formattedTime} WIB
                    </span>
                    <span className="text-[9px] text-slate-400">
                      {formattedDate}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
