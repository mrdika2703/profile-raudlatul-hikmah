import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router";
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import api from "../../lib/axios";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Tembak API Login Laravel
      const response = await api.post("/login", {
        email,
        password,
      });

      // 2. Simpan token dan data user ke localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // 3. Arahkan ke halaman dashboard admin (contoh: /admin/dashboard)
      navigate("/admin/dashboard");
    } catch (err: any) {
      // Tangkap pesan error dari backend Laravel (misal error 401)
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Terjadi kesalahan pada server. Pastikan backend aktif.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-pink-100 flex items-center justify-center p-4 font-sans text-slate-800">
      {/* Tombol Kembali ke Beranda */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-pink-600 transition-colors bg-white/80 backdrop-blur-md px-4 py-2 rounded-xl border border-pink-100 shadow-sm"
      >
        <ArrowLeft size={16} /> Kembali ke Beranda
      </Link>

      <div className="max-w-md w-full bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-pink-100 p-8 sm:p-10 relative overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-pink-200 rounded-full blur-2xl opacity-50 pointer-events-none"></div>

        {/* Header Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-pink-600 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-pink-200">
            <GraduationCap size={36} />
          </div>
          <h1 className="text-2xl font-bold text-pink-700">Login Guru</h1>
          <p className="text-sm text-slate-500 mt-1">
            RA Raudlatul Hikmah, Silakan login untuk mengelola data
          </p>
        </div>

        {/* Alert Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-700 text-sm animate-shake">
            <AlertCircle size={20} className="shrink-0 mt-0.5 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Alamat Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Mail size={20} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="guru@tkraudlatulhikmah.sch.id"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Kata Sandi
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                <Lock size={20} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="•••••••• font-mono"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 bg-pink-600 hover:bg-pink-700 active:bg-pink-800 text-white font-semibold rounded-xl shadow-md shadow-pink-200 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span>Memeriksa Akun...</span>
              </>
            ) : (
              <>
                <span>Masuk ke Portal</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        {/* Footer info kecil */}
        <p className="text-center text-xs text-slate-400 mt-8">
          KB RA Raudatul Hikmah Dsn. Juwet, Ds. Dukuhdimoro, Kec. Mojoagung,
          Jombang
        </p>
      </div>
    </div>
  );
}
