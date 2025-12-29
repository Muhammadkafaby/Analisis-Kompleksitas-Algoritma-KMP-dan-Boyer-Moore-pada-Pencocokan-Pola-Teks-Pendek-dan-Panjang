"""
Boyer-Moore Algorithm - Recursive Version
Menggunakan Bad Character Rule
"""
from typing import List, Dict
import sys

# Increase recursion limit for large inputs
sys.setrecursionlimit(20000)


def compute_bad_character_recursive(pattern: str, index: int = 0, 
                                     table: Dict[str, int] = None) -> Dict[str, int]:
    """
    Menghitung bad character table menggunakan rekursi.
    
    Args:
        pattern: Pola untuk dihitung bad character table-nya
        index: Indeks saat ini di pattern
        table: Dictionary untuk menyimpan hasil
        
    Returns:
        Dictionary mapping karakter ke posisi terakhirnya di pattern
    """
    # Initialize table on first call
    if table is None:
        table = {}
    
    # Base case: sudah selesai memproses semua karakter
    if index >= len(pattern):
        return table
    
    # Simpan posisi karakter saat ini (akan di-overwrite jika ada duplikat)
    table[pattern[index]] = index
    
    # Rekursi ke karakter berikutnya
    return compute_bad_character_recursive(pattern, index + 1, table)


def match_pattern_recursive(text: str, pattern: str, s: int, j: int) -> int:
    """
    Mencocokkan pattern dengan text secara rekursif dari kanan ke kiri.
    
    Args:
        text: Teks utama
        pattern: Pola yang dicari
        s: Posisi shift saat ini
        j: Indeks saat ini di pattern (dari kanan)
        
    Returns:
        Indeks j di mana mismatch terjadi, atau -1 jika semua cocok
    """
    # Base case: semua karakter cocok
    if j < 0:
        return -1
    
    # Jika karakter tidak cocok
    if pattern[j] != text[s + j]:
        return j
    
    # Rekursi ke karakter sebelumnya (ke kiri)
    return match_pattern_recursive(text, pattern, s, j - 1)


def search_recursive(text: str, pattern: str, s: int, n: int, m: int,
                     bad_char: Dict[str, int], results: List[int]) -> List[int]:
    """
    Pencarian Boyer-Moore menggunakan rekursi.
    
    Args:
        text: Teks utama
        pattern: Pola yang dicari
        s: Posisi shift saat ini
        n: Panjang text
        m: Panjang pattern
        bad_char: Bad character table
        results: List untuk menyimpan hasil
        
    Returns:
        List indeks di mana pattern ditemukan
    """
    # Base case: sudah melewati akhir text
    if s > n - m:
        return results
    
    # Cocokkan pattern dari kanan ke kiri
    j = match_pattern_recursive(text, pattern, s, m - 1)
    
    # Jika pattern ditemukan (j == -1 berarti semua karakter cocok)
    if j < 0:
        results.append(s)
        # Hitung shift untuk kemunculan berikutnya
        if s + m < n:
            next_shift = m - bad_char.get(text[s + m], -1)
        else:
            next_shift = 1
        return search_recursive(text, pattern, s + next_shift, n, m, bad_char, results)
    
    # Hitung shift berdasarkan bad character rule
    bad_char_shift = j - bad_char.get(text[s + j], -1)
    next_shift = max(1, bad_char_shift)
    
    return search_recursive(text, pattern, s + next_shift, n, m, bad_char, results)


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
    
    n = len(text)
    m = len(pattern)
    
    # Hitung bad character table secara rekursif
    bad_char = compute_bad_character_recursive(pattern)
    
    # Cari pattern secara rekursif
    return search_recursive(text, pattern, 0, n, m, bad_char, [])
