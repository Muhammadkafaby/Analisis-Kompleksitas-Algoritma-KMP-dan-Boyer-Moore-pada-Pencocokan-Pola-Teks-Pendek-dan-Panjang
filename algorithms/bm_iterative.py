"""
Boyer-Moore Algorithm - Iterative Version
Menggunakan Bad Character Rule
"""
from typing import List, Dict


def compute_bad_character_table(pattern: str) -> Dict[str, int]:
    """
    Menghitung bad character table menggunakan loop.
    
    Untuk setiap karakter dalam pattern, simpan posisi terakhir kemunculannya.
    
    Args:
        pattern: Pola untuk dihitung bad character table-nya
        
    Returns:
        Dictionary mapping karakter ke posisi terakhirnya di pattern
    """
    bad_char = {}
    m = len(pattern)
    
    for i in range(m):
        bad_char[pattern[i]] = i
    
    return bad_char


def search(text: str, pattern: str) -> List[int]:
    """
    Mencari semua kemunculan pattern dalam text menggunakan Boyer-Moore iteratif.
    
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
    
    # Hitung bad character table
    bad_char = compute_bad_character_table(pattern)
    
    # Mulai dari posisi 0
    s = 0  # shift - posisi pattern relatif terhadap text
    
    while s <= n - m:
        # Mulai pencocokan dari kanan pattern
        j = m - 1
        
        # Cocokkan karakter dari kanan ke kiri
        while j >= 0 and pattern[j] == text[s + j]:
            j -= 1
        
        # Jika pattern ditemukan (j < 0 berarti semua karakter cocok)
        if j < 0:
            results.append(s)
            # Geser pattern untuk mencari kemunculan berikutnya
            if s + m < n:
                # Geser berdasarkan karakter setelah pattern di text
                s += m - bad_char.get(text[s + m], -1)
            else:
                s += 1
        else:
            # Geser pattern berdasarkan bad character rule
            # Geser sehingga karakter yang tidak cocok di text
            # sejajar dengan kemunculan terakhirnya di pattern
            bad_char_shift = j - bad_char.get(text[s + j], -1)
            s += max(1, bad_char_shift)
    
    return results
