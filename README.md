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
