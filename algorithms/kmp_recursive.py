"""
KMP (Knuth-Morris-Pratt) Algorithm - Recursive Version
"""
from typing import List
import sys

# Increase recursion limit for large inputs
sys.setrecursionlimit(20000)


def compute_failure_function_recursive(pattern: str, i: int = 1, j: int = 0, 
                                        failure: List[int] = None) -> List[int]:
    """
    Menghitung failure function menggunakan rekursi.
    
    Args:
        pattern: Pola untuk dihitung failure function-nya
        i: Indeks saat ini di pattern (dimulai dari 1)
        j: Panjang prefix yang cocok saat ini
        failure: List untuk menyimpan hasil
        
    Returns:
        List failure function
    """
    m = len(pattern)
    
    # Initialize failure array on first call
    if failure is None:
        if m == 0:
            return []
        failure = [0] * m
    
    # Base case: sudah selesai memproses semua karakter
    if i >= m:
        return failure
    
    # Jika karakter cocok
    if pattern[i] == pattern[j]:
        failure[i] = j + 1
        return compute_failure_function_recursive(pattern, i + 1, j + 1, failure)
    
    # Jika tidak cocok dan j > 0, mundur
    if j > 0:
        return compute_failure_function_recursive(pattern, i, failure[j - 1], failure)
    
    # Jika tidak cocok dan j = 0
    failure[i] = 0
    return compute_failure_function_recursive(pattern, i + 1, 0, failure)


def search_recursive(text: str, pattern: str, t_idx: int, p_idx: int,
                     failure: List[int], results: List[int]) -> List[int]:
    """
    Pencarian KMP menggunakan rekursi.
    
    Args:
        text: Teks utama
        pattern: Pola yang dicari
        t_idx: Indeks saat ini di text
        p_idx: Indeks saat ini di pattern
        failure: Failure function
        results: List untuk menyimpan hasil
        
    Returns:
        List indeks di mana pattern ditemukan
    """
    n = len(text)
    m = len(pattern)
    
    # Base case: sudah selesai memproses text
    if t_idx >= n:
        return results
    
    # Jika karakter cocok
    if text[t_idx] == pattern[p_idx]:
        # Jika seluruh pattern cocok
        if p_idx == m - 1:
            results.append(t_idx - m + 1)
            # Lanjut mencari dengan menggunakan failure function
            new_p_idx = failure[p_idx] if p_idx > 0 else 0
            return search_recursive(text, pattern, t_idx + 1, new_p_idx, failure, results)
        else:
            return search_recursive(text, pattern, t_idx + 1, p_idx + 1, failure, results)
    
    # Jika tidak cocok dan p_idx > 0, mundur menggunakan failure function
    if p_idx > 0:
        return search_recursive(text, pattern, t_idx, failure[p_idx - 1], failure, results)
    
    # Jika tidak cocok dan p_idx = 0, maju di text
    return search_recursive(text, pattern, t_idx + 1, 0, failure, results)


def search(text: str, pattern: str) -> List[int]:
    """
    Wrapper function untuk interface konsisten.
    
    Args:
        text: Teks utama untuk pencarian
        pattern: Pola yang dicari
        
    Returns:
        List indeks awal di mana pattern ditemukan
    """
    # Handle edge cases
    if not pattern:
        return []
    if not text:
        return []
    if len(pattern) > len(text):
        return []
    
    # Hitung failure function secara rekursif
    failure = compute_failure_function_recursive(pattern)
    
    # Cari pattern secara rekursif
    return search_recursive(text, pattern, 0, 0, failure, [])
