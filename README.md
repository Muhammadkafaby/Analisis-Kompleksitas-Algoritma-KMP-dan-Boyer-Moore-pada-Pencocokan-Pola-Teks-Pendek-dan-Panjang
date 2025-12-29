# Analisis Perbandingan Algoritma KMP dan Boyer-Moore

Tugas Besar Mata Kuliah Analisis Kompleksitas Algoritma - Telkom University

## Deskripsi

Aplikasi untuk menganalisis dan membandingkan performa algoritma pencarian pola (string pattern matching):
- **KMP (Knuth-Morris-Pratt)** - Iteratif & Rekursif
- **Boyer-Moore** - Iteratif & Rekursif

## Struktur Proyek

```
├── algorithms/           # Implementasi algoritma Python
│   ├── kmp_iterative.py
│   ├── kmp_recursive.py
│   ├── bm_iterative.py
│   └── bm_recursive.py
├── benchmark/            # Modul benchmark
│   └── runner.py
├── visualization/        # Modul visualisasi grafik
│   └── plotter.py
├── utils/                # Utilitas
│   └── text_generator.py
├── web/                  # Aplikasi web
│   ├── index.html
│   ├── app.js
│   └── algorithms.js
├── output/               # Hasil output
│   ├── data/             # Data CSV
│   └── graphs/           # Grafik PNG
├── main.py               # Aplikasi CLI utama
├── generate_report.py    # Generator dokumen Word
└── verify_algorithms.py  # Verifikasi konsistensi algoritma
```

## Instalasi

### 1. Clone Repository
```bash
git clone <repository-url>
cd <folder-project>
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

Dependencies yang dibutuhkan:
- `matplotlib` - untuk visualisasi grafik
- `python-docx` - untuk generate dokumen Word
- `pytest` - untuk testing (opsional)

## Cara Menjalankan

### Aplikasi CLI (Python)

```bash
python main.py
```

Menu yang tersedia:
1. **Demo Pencarian** - Input teks dan pattern manual
2. **Benchmark** - Jalankan benchmark dengan berbagai ukuran input
3. **Quick Test** - Verifikasi konsistensi semua algoritma
4. **Keluar**

### Aplikasi Web

Buka file `web/index.html` di browser:
```bash
# Windows
start web/index.html

# Linux/Mac
open web/index.html
```

Atau gunakan live server di VS Code.

### Generate Dokumen Word

```bash
python generate_report.py
```

Output: `output/Laporan_Tugas_Besar_AKA.docx`

Dokumen berisi:
- Cover page
- Pendahuluan (Latar Belakang, Rumusan Masalah, Tujuan)
- Tinjauan Pustaka
- Metode Penelitian
- Pembahasan dengan kode program dan analisis
- Hasil Benchmark dengan tabel dan grafik
- Kesimpulan
- Daftar Pustaka
- Lampiran (Source Code)

### Verifikasi Algoritma

```bash
python verify_algorithms.py
```

Memastikan semua implementasi algoritma menghasilkan hasil yang konsisten.

## Hasil Output

Setelah menjalankan benchmark, hasil tersimpan di:
- `output/data/benchmark_results.csv` - Data benchmark
- `output/graphs/comparison_all.png` - Grafik perbandingan semua algoritma
- `output/graphs/kmp_comparison.png` - Grafik KMP Iteratif vs Rekursif
- `output/graphs/bm_comparison.png` - Grafik Boyer-Moore Iteratif vs Rekursif
- `output/graphs/iterative_vs_recursive.png` - Grafik Iteratif vs Rekursif

## Kompleksitas Algoritma

| Algoritma | Waktu (Best) | Waktu (Worst) | Ruang |
|-----------|--------------|---------------|-------|
| KMP Iteratif | O(n + m) | O(n + m) | O(m) |
| KMP Rekursif | O(n + m) | O(n + m) | O(n + m) |
| BM Iteratif | O(n/m) | O(n × m) | O(k) |
| BM Rekursif | O(n/m) | O(n × m) | O(n/m + k) |

Keterangan:
- n = panjang teks
- m = panjang pattern
- k = ukuran alfabet

## Teknologi

- **Python 3.x** - Backend dan analisis
- **JavaScript** - Frontend web
- **Matplotlib** - Visualisasi grafik
- **python-docx** - Generate dokumen Word
- **Chart.js** - Grafik di web

## Anggota Kelompok

- [Nama Mahasiswa 1] (NIM)
- [Nama Mahasiswa 2] (NIM)
- [Nama Mahasiswa 3] (NIM)

## Lisensi

MIT License
