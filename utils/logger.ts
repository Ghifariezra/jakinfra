import { createLogger } from "vite";

// 1. Inisialisasi bawaan logger Vite
const customLogger = createLogger("info", { allowClearScreen: true });

// 2. Simpan fungsi asli agar tidak tertimpa sepenuhnya
const originalWarn = customLogger.warn;
const originalInfo = customLogger.info;
// const originalError = customLogger.error

// 3. Modifikasi fungsi 'warn' (Paling sering digunakan untuk filter)
customLogger.warn = (msg, options) => {
	// Filter 1: Abaikan warning CSS kosong (Sering terjadi saat setup Tailwind)
	if (msg.includes("vite:css") && msg.includes(" is empty")) return;

	// Filter 2: Abaikan warning spesifik lain (Tambahkan di sini nanti jika ada)
	// if (msg.includes('kata kunci warning yang mengganggu')) return;

	// Tampilkan sisa warning dengan fungsi aslinya
	originalWarn(msg, options);
};

// 4. (Opsional) Modifikasi fungsi 'info' untuk estetika terminal
customLogger.info = (msg, options) => {
	// Anda bisa menambahkan prefix custom ke log info tertentu
	if (msg.includes("ready in")) {
		originalInfo(`🚀 [JakInfra] WebGIS berjalan mantap! \n${msg}`, options);
		return;
	}
	originalInfo(msg, options);
};

export default customLogger;
