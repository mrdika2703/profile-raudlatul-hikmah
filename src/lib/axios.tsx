import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let requestTimes: number[] = [];

// Interceptor: Otomatis tempelkan Bearer Token jika ada di localStorage & Batasi rate limit (max 2/detik)
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Batasi maksimal 2 request per detik
  while (true) {
    const now = Date.now();
    requestTimes = requestTimes.filter((t) => now - t < 1000);

    if (requestTimes.length < 2) {
      requestTimes.push(now);
      break;
    }

    // Tunggu sisa waktu sampai slot kosong
    const delay = requestTimes[0] + 1000 - now;
    if (delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return config;
});

// Helper: URL storage file dari backend
export function getStorageUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = import.meta.env.VITE_STORAGE_URL;
  return `${base}/${path}`;
}

export default api;
