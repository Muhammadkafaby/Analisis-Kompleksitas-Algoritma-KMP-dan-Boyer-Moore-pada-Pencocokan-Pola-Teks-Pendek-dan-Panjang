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

Dependencies:
- `matplotlib` - visualisasi grafik
- `python-docx` - generate dokumen Word

## Cara Menjalankan

### 1. Aplikasi CLI (Python)

```bash
python main.py
```

Menu:
1. Demo Pencarian - Input teks dan pattern manual
2. Benchmark - Jalankan benchmark berbagai ukuran input
3. Quick Test - Verifikasi konsistensi algoritma
4. Keluar

### 2. Aplikasi Web

Buka file di browser:
```bash
# Windows
start web/index.html

# Atau double-click file web/index.html
```

### 3. Generate Dokumen Word

```bash
python generate_report.py
```

Output: `output/Laporan_Tugas_Besar_AKA.docx`

### 4. Verifikasi Algoritma

```bash
python verify_algorithms.py
```

## Hasil Output

Setelah benchmark:
- `output/data/benchmark_results.csv` - Data benchmark
- `output/graphs/comparison_all.png` - Grafik semua algoritma
- `output/graphs/kmp_comparison.png` - KMP Iteratif vs Rekursif
- `output/graphs/bm_comparison.png` - Boyer-Moore Iteratif vs Rekursif

## Kompleksitas Algoritma

| Algoritma | Waktu | Ruang |
|-----------|-------|-------|
| KMP Iteratif | O(n + m) | O(m) |
| KMP Rekursif | O(n + m) | O(n + m) |
| BM Iteratif | O(n/m) - O(nm) | O(k) |
| BM Rekursif | O(n/m) - O(nm) | O(n/m + k) |

n = panjang teks, m = panjang pattern, k = ukuran alfabet

## Anggota Kelompok

- [Davi Pramudya Putra] (103012580056)
- [Muhammad Kafaby] (103012580045)
- [M. Faishal Rafid] (103012580034)

## Lisensi

MIT License
