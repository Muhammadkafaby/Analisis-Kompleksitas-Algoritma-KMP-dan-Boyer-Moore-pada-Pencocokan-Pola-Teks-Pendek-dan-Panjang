"""
Benchmark Runner Module
Untuk mengukur dan membandingkan performa algoritma
"""
import time
import csv
from dataclasses import dataclass, field
from typing import Callable, List, Dict
import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.text_generator import generate_random_text, generate_pattern


@dataclass
class BenchmarkResult:
    """Data class untuk menyimpan hasil benchmark"""
    algorithm_name: str
    input_size: int
    execution_time: float  # dalam microseconds
    iterations: int
    pattern_length: int = 10


@dataclass
class BenchmarkRunner:
    """Class untuk menjalankan benchmark"""
    iterations: int = 10
    input_sizes: List[int] = field(default_factory=lambda: [
        1, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000
    ])
    
    def run_single(self, algorithm: Callable, text: str, pattern: str) -> float:
        """
        Menjalankan satu benchmark dan return waktu eksekusi.
        
        Args:
            algorithm: Fungsi search algorithm
            text: Teks untuk pencarian
            pattern: Pattern yang dicari
            
        Returns:
            Waktu eksekusi dalam microseconds
        """
        start = time.perf_counter()
        algorithm(text, pattern)
        end = time.perf_counter()
        return (end - start) * 1_000_000  # Convert to microseconds
    
    def run_benchmark(self, algorithm: Callable, algorithm_name: str,
                      text: str, pattern: str, input_size: int) -> BenchmarkResult:
        """
        Menjalankan benchmark dengan multiple iterations.
        
        Args:
            algorithm: Fungsi search algorithm
            algorithm_name: Nama algoritma
            text: Teks untuk pencarian
            pattern: Pattern yang dicari
            input_size: Ukuran input
            
        Returns:
            BenchmarkResult dengan rata-rata waktu eksekusi
        """
        times = []
        for _ in range(self.iterations):
            try:
                exec_time = self.run_single(algorithm, text, pattern)
                times.append(exec_time)
            except RecursionError:
                times.append(float('inf'))
            except Exception as e:
                print(f"Error in {algorithm_name}: {e}")
                times.append(float('inf'))
        
        avg_time = sum(times) / len(times) if times else 0
        
        return BenchmarkResult(
            algorithm_name=algorithm_name,
            input_size=input_size,
            execution_time=avg_time,
            iterations=self.iterations,
            pattern_length=len(pattern)
        )
    
    def run_all(self, algorithms: Dict[str, Callable], 
                pattern_length: int = 10) -> List[BenchmarkResult]:
        """
        Menjalankan benchmark untuk semua algoritma dan ukuran input.
        
        Args:
            algorithms: Dictionary {nama: fungsi} algoritma
            pattern_length: Panjang pattern untuk testing
            
        Returns:
            List BenchmarkResult untuk semua kombinasi
        """
        results = []
        pattern = generate_pattern(pattern_length)
        
        for input_size in self.input_sizes:
            print(f"Testing input size: {input_size}")
            text = generate_random_text(input_size)
            
            for name, algorithm in algorithms.items():
                result = self.run_benchmark(
                    algorithm, name, text, pattern, input_size
                )
                results.append(result)
                print(f"  {name}: {result.execution_time:.2f} μs")
        
        return results
    
    def export_csv(self, results: List[BenchmarkResult], filename: str) -> None:
        """
        Export hasil ke file CSV.
        
        Args:
            results: List BenchmarkResult
            filename: Nama file output
        """
        # Ensure output directory exists
        os.makedirs(os.path.dirname(filename) if os.path.dirname(filename) else '.', exist_ok=True)
        
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([
                'algorithm', 'input_size', 'pattern_length', 
                'execution_time_us', 'iterations'
            ])
            
            for r in results:
                writer.writerow([
                    r.algorithm_name, r.input_size, r.pattern_length,
                    f"{r.execution_time:.2f}", r.iterations
                ])
        
        print(f"Results exported to {filename}")
