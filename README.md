# JakInfra - Jakarta Infrastructure Dashboard

JakInfra adalah platform pemetaan dan analitik untuk memantau infrastruktur dan data demografi/kepadatan di wilayah Jakarta. Proyek web ini dibangun menggunakan ekosistem React modern yang berfokus pada performa dan pengalaman pengguna.

## 🚀 Teknologi Utama

- **Framework & Build Tool:** React + TypeScript + Vite
- **Routing:** TanStack Router (File-based routing)
- **State Management & Data Fetching:** React Query & Axios
- **Styling & UI:** Tailwind CSS, Shadcn UI, Framer Motion (Background Beams)
- **Worker:** Web Worker khusus (`geo.worker.ts`) untuk komputasi data geospasial tanpa memblokir UI thread.

## 📁 Struktur Proyek Utama

- `src/components`: Komponen UI dan view, termasuk analitik dan elemen umum.
- `src/routes`: Rute aplikasi (`/`, `/about`, `/analytics`, `/map`) dengan arsitektur TanStack Router.
- `src/lib`: Logic bisnis dan koneksi API (Services, Hooks, Actions, Types).
- `src/workers`: Off-thread Web Workers untuk memproses data geospasial dengan efisien.

## 🛠️ Cara Menjalankan Proyek

1. **Install Dependensi:**
   ```bash
   pnpm install
   ```

2. **Jalankan Server Development:**
   ```bash
   pnpm dev
   ```

3. **Build untuk Produksi:**
   ```bash
   pnpm build
   ```

## 📈 Fitur

- **Peta Interaktif (Geospasial):** Memvisualisasikan infrastruktur dan analitik (Map route).
- **Dashboard Analitik:** Menyajikan insight data melalui DataTable dan KPIs (Analytics route).
- **Pemrosesan Asinkron (Off-thread):** Web worker untuk render geo tanpa membuat antarmuka menjadi lambat.
- **Tema Variabel:** Animasi peralihan mode gelap/terang.

## 🗄️ Data

Data bersumber dari data publik [Pemerintah DKI Jakarta](https://satudata.jakarta.go.id/open-data), yang kemudian diolah dan dirapikan oleh [@Ghifariezra](https://github.com/Ghifariezra) agar bisa diakses lewat API yang lebih terstruktur.

Kalau kamu mau pakai datanya, boleh banget — asal tetap cantumkan kredit ya 🙏

## 📄 License

Kode: [MIT](./LICENSE)  
Data: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/)

---

Built by [@Ghifariezra](https://github.com/Ghifariezra)