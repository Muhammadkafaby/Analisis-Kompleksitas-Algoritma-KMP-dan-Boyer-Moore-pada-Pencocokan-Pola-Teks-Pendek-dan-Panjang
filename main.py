"""
Main Application
Perbandingan Algoritma KMP dan Boyer-Moore (Iteratif vs Rekursif)
"""
import sys
import time

# Import algorithms
from algorithms import kmp_iterative, kmp_recursive, bm_iterative, bm_recursive
from benchmark.runner import BenchmarkRunner
from visualization.plotter import Plotter
from utils.text_generator import generate_random_text, generate_pattern


def print_header():
    """Print header aplikasi"""
    print("=" * 70)
    print("  ANALISIS PERBANDINGAN ALGORITMA KMP DAN BOYER-MOORE")
    print("  (Versi Iteratif vs Rekursif)")
    print("=" * 70)
    print()


def print_results_table(results: dict, pattern: str):
    """Print tabel hasil pencarian"""
    print("\n" + "=" * 70)
    print(f"Pattern: '{pattern}' (panjang: {len(pattern)})")
    print("-" * 70)
    print(f"{'Algoritma':<25} {'Matches':<10} {'Waktu (μs)':<15}")
    print("-" * 70)
    
    for name, data in results.items():
        matches = len(data['indices'])
        time_us = data['time']
        print(f"{name:<25} {matches:<10} {time_us:<15.2f}")
    
    print("=" * 70)


def run_search_demo():
    """Demo pencarian dengan input user"""
    print("\n--- MODE DEMO PENCARIAN ---\n")
    
    # Input dari user
    text = input("Masukkan teks (atau tekan Enter untuk random): ").strip()
    if not text:
        size = int(input("Ukuran teks random (default 100): ") or "100")
        text = generate_random_text(size)
        print(f"Teks random: {text[:50]}..." if len(text) > 50 else f"Teks: {text}")
    
    pattern = input("Masukkan pattern yang dicari: ").strip()
    if not pattern:
        pattern = generate_pattern(5)
        print(f"Pattern random: {pattern}")
    
    # Jalankan semua algoritma
    algorithms = {
        'KMP Iterative': kmp_iterative.search,
        'KMP Recursive': kmp_recursive.search,
        'Boyer-Moore Iterative': bm_iterative.search,
        'Boyer-Moore Recursive': bm_recursive.search,
    }
    
    results = {}
    for name, algo in algorithms.items():
        start = time.perf_counter()
        indices = algo(text, pattern)
        end = time.perf_counter()
        exec_time = (end - start) * 1_000_000
        results[name] = {'indices': indices, 'time': exec_time}
    
    print_results_table(results, pattern)
    
    # Tampilkan posisi match
    if results['KMP Iterative']['indices']:
        print(f"\nPattern ditemukan di posisi: {results['KMP Iterative']['indices']}")
    else:
        print("\nPattern tidak ditemukan dalam teks.")


def run_benchmark():
    """Jalankan benchmark lengkap"""
    print("\n--- MODE BENCHMARK ---\n")
    
    pattern_length = int(input("Panjang pattern (default 10): ") or "10")
    
    algorithms = {
        'KMP Iterative': kmp_iterative.search,
        'KMP Recursive': kmp_recursive.search,
        'Boyer-Moore Iterative': bm_iterative.search,
        'Boyer-Moore Recursive': bm_recursive.search,
    }
    
    print("\nMemulai benchmark...")
    print("Input sizes: 1, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000\n")
    
    runner = BenchmarkRunner(iterations=10)
    results = runner.run_all(algorithms, pattern_length)
    
    # Export ke CSV
    runner.export_csv(results, "output/data/benchmark_results.csv")
    
    # Generate grafik
    print("\nMembuat grafik...")
    plotter = Plotter()
    plotter.plot_all(results)
    
    print("\n" + "=" * 70)
    print("Benchmark selesai!")
    print("- Data CSV: output/data/benchmark_results.csv")
    print("- Grafik: output/graphs/")
    print("=" * 70)


def run_quick_test():
    """Quick test untuk verifikasi algoritma"""
    print("\n--- QUICK TEST ---\n")
    
    test_cases = [
        ("ABABDABACDABABCABAB", "ABABCABAB"),
        ("AAAAAA", "AAA"),
        ("ABCDEF", "XYZ"),
        ("ABCABCABC", "ABC"),
    ]
    
    algorithms = {
        'KMP Iter': kmp_iterative.search,
        'KMP Rec': kmp_recursive.search,
        'BM Iter': bm_iterative.search,
        'BM Rec': bm_recursive.search,
    }
    
    print(f"{'Text':<25} {'Pattern':<15} ", end="")
    for name in algorithms.keys():
        print(f"{name:<12}", end="")
    print()
    print("-" * 80)
    
    all_passed = True
    for text, pattern in test_cases:
        text_display = text[:20] + "..." if len(text) > 20 else text
        print(f"{text_display:<25} {pattern:<15} ", end="")
        
        results = []
        for name, algo in algorithms.items():
            result = algo(text, pattern)
            results.append(result)
            print(f"{str(result):<12}", end="")
        
        # Verifikasi semua hasil sama
        if not all(r == results[0] for r in results):
            print(" [MISMATCH!]", end="")
            all_passed = False
        
        print()
    
    print("-" * 80)
    if all_passed:
        print("✓ Semua algoritma menghasilkan output yang sama!")
    else:
        print("✗ Ada perbedaan hasil antar algoritma!")


def main():
    """Main function"""
    print_header()
    
    while True:
        print("\nPilih mode:")
        print("1. Demo Pencarian (input manual)")
        print("2. Benchmark (ukuran 1-10000)")
        print("3. Quick Test (verifikasi algoritma)")
        print("4. Keluar")
        
        choice = input("\nPilihan (1-4): ").strip()
        
        if choice == '1':
            run_search_demo()
        elif choice == '2':
            run_benchmark()
        elif choice == '3':
            run_quick_test()
        elif choice == '4':
            print("\nTerima kasih!")
            break
        else:
            print("Pilihan tidak valid. Silakan pilih 1-4.")


if __name__ == "__main__":
    main()
