"""
KMP (Knuth-Morris-Pratt) Algorithm - Iterative Version
"""
from typing import List


def compute_failure_function(pattern: str) -> List[int]:
    """
    Menghitung failure function (prefix table) menggunakan loop.
    
    failure[i] = panjang prefix terpanjang dari pattern[0:i+1] 
                 yang juga merupakan suffix
    """
    m = len(pattern)
    if m == 0:
        return []
    
    failure = [0] * m
    j = 0  # panjang prefix yang cocok
    
    for i in range(1, m):
        # Mundur sampai menemukan prefix yang cocok atau j = 0
        while j > 0 and pattern[i] != pattern[j]:
            j = failure[j - 1]
        
        # Jika karakter cocok, tambah panjang prefix
        if pattern[i] == pattern[j]:
            j += 1
        
        failure[i] = j
    
    return failure


def search(text: str, pattern: str) -> List[int]:
    """
    Mencari semua kemunculan pattern dalam text menggunakan KMP iteratif.
    
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
    
    n = len(text)
    m = len(pattern)
    results = []
    
    # Hitung failure function
    failure = compute_failure_function(pattern)
    
    j = 0  # indeks di pattern
    
    for i in range(n):
        # Mundur sampai menemukan prefix yang cocok atau j = 0
        while j > 0 and text[i] != pattern[j]:
            j = failure[j - 1]
        
        # Jika karakter cocok, maju di pattern
        if text[i] == pattern[j]:
            j += 1
        
        # Jika seluruh pattern cocok
        if j == m:
            results.append(i - m + 1)
            j = failure[j - 1]  # Lanjut mencari kemunculan berikutnya
    
    return results
