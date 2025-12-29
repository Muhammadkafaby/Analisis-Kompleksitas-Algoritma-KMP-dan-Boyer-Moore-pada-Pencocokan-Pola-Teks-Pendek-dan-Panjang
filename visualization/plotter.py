"""
Visualization Module
Untuk membuat grafik perbandingan performa algoritma
"""
import matplotlib.pyplot as plt
from typing import List, Dict
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from benchmark.runner import BenchmarkResult


class Plotter:
    """Class untuk membuat grafik perbandingan"""
    
    def __init__(self, output_dir: str = "output/graphs"):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)
        
        # Color scheme untuk konsistensi
        self.colors = {
            'KMP Iterative': '#2ecc71',      # Green
            'KMP Recursive': '#27ae60',       # Dark Green
            'Boyer-Moore Iterative': '#3498db',  # Blue
            'Boyer-Moore Recursive': '#2980b9',  # Dark Blue
        }
        
        self.markers = {
            'KMP Iterative': 'o',
            'KMP Recursive': 's',
            'Boyer-Moore Iterative': '^',
            'Boyer-Moore Recursive': 'D',
        }
    
    def _group_results(self, results: List[BenchmarkResult]) -> Dict[str, Dict[int, float]]:
        """Group results by algorithm name"""
        grouped = {}
        for r in results:
            if r.algorithm_name not in grouped:
                grouped[r.algorithm_name] = {}
            grouped[r.algorithm_name][r.input_size] = r.execution_time
        return grouped
    
    def plot_comparison(self, results: List[BenchmarkResult], 
                        title: str = "Perbandingan Semua Algoritma",
                        filename: str = "comparison_all.png") -> None:
        """
        Generate grafik perbandingan semua algoritma.
        
        Args:
            results: List BenchmarkResult
            title: Judul grafik
            filename: Nama file output
        """
        grouped = self._group_results(results)
        
        plt.figure(figsize=(12, 8))
        
        for algo_name, data in grouped.items():
            sizes = sorted(data.keys())
            times = [data[s] for s in sizes]
            
            color = self.colors.get(algo_name, '#333333')
            marker = self.markers.get(algo_name, 'o')
            
            plt.plot(sizes, times, marker=marker, label=algo_name, 
                    color=color, linewidth=2, markersize=8)
        
        plt.xlabel('Ukuran Input (karakter)', fontsize=12)
        plt.ylabel('Waktu Eksekusi (μs)', fontsize=12)
        plt.title(title, fontsize=14, fontweight='bold')
        plt.legend(loc='upper left', fontsize=10)
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        
        filepath = os.path.join(self.output_dir, filename)
        plt.savefig(filepath, dpi=150, bbox_inches='tight')
        plt.close()
        print(f"Graph saved to {filepath}")
    
    def plot_kmp_comparison(self, results: List[BenchmarkResult],
                            filename: str = "kmp_comparison.png") -> None:
        """
        Generate grafik KMP iteratif vs rekursif.
        """
        kmp_results = [r for r in results if 'KMP' in r.algorithm_name]
        self.plot_comparison(
            kmp_results, 
            "Perbandingan KMP: Iteratif vs Rekursif",
            filename
        )
    
    def plot_bm_comparison(self, results: List[BenchmarkResult],
                           filename: str = "bm_comparison.png") -> None:
        """
        Generate grafik Boyer-Moore iteratif vs rekursif.
        """
        bm_results = [r for r in results if 'Boyer-Moore' in r.algorithm_name]
        self.plot_comparison(
            bm_results,
            "Perbandingan Boyer-Moore: Iteratif vs Rekursif",
            filename
        )
    
    def plot_iterative_vs_recursive(self, results: List[BenchmarkResult],
                                     filename: str = "iterative_vs_recursive.png") -> None:
        """
        Generate grafik semua iteratif vs semua rekursif.
        """
        grouped = self._group_results(results)
        
        plt.figure(figsize=(12, 8))
        
        # Separate iterative and recursive
        iterative_data = {}
        recursive_data = {}
        
        for algo_name, data in grouped.items():
            if 'Iterative' in algo_name:
                for size, time in data.items():
                    if size not in iterative_data:
                        iterative_data[size] = []
                    iterative_data[size].append(time)
            else:
                for size, time in data.items():
                    if size not in recursive_data:
                        recursive_data[size] = []
                    recursive_data[size].append(time)
        
        # Calculate averages
        sizes = sorted(iterative_data.keys())
        iter_avg = [sum(iterative_data[s])/len(iterative_data[s]) for s in sizes]
        rec_avg = [sum(recursive_data[s])/len(recursive_data[s]) for s in sizes]
        
        plt.plot(sizes, iter_avg, 'o-', label='Rata-rata Iteratif', 
                color='#2ecc71', linewidth=2, markersize=8)
        plt.plot(sizes, rec_avg, 's-', label='Rata-rata Rekursif',
                color='#e74c3c', linewidth=2, markersize=8)
        
        plt.xlabel('Ukuran Input (karakter)', fontsize=12)
        plt.ylabel('Waktu Eksekusi (μs)', fontsize=12)
        plt.title('Perbandingan: Iteratif vs Rekursif', fontsize=14, fontweight='bold')
        plt.legend(loc='upper left', fontsize=10)
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        
        filepath = os.path.join(self.output_dir, filename)
        plt.savefig(filepath, dpi=150, bbox_inches='tight')
        plt.close()
        print(f"Graph saved to {filepath}")
    
    def plot_all(self, results: List[BenchmarkResult]) -> None:
        """Generate semua grafik sekaligus."""
        self.plot_comparison(results)
        self.plot_kmp_comparison(results)
        self.plot_bm_comparison(results)
        self.plot_iterative_vs_recursive(results)
        print("All graphs generated successfully!")
