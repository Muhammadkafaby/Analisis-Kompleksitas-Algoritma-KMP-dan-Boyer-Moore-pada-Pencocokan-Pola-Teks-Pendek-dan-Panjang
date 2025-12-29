"""
Text Generator Utility
Untuk menghasilkan teks dan pattern random untuk benchmarking
"""
import random
import string


def generate_random_text(size: int, alphabet: str = string.ascii_lowercase) -> str:
    """
    Generate random text dengan ukuran tertentu.
    
    Args:
        size: Panjang teks yang diinginkan
        alphabet: Karakter yang digunakan (default: huruf kecil a-z)
        
    Returns:
        String random dengan panjang size
    """
    if size <= 0:
        return ""
    return ''.join(random.choice(alphabet) for _ in range(size))


def generate_pattern(length: int, alphabet: str = string.ascii_lowercase) -> str:
    """
    Generate random pattern.
    
    Args:
        length: Panjang pattern yang diinginkan
        alphabet: Karakter yang digunakan (default: huruf kecil a-z)
        
    Returns:
        String random dengan panjang length
    """
    if length <= 0:
        return ""
    return ''.join(random.choice(alphabet) for _ in range(length))


def generate_text_with_pattern(text_size: int, pattern: str, 
                                occurrences: int = 1,
                                alphabet: str = string.ascii_lowercase) -> str:
    """
    Generate text yang dijamin mengandung pattern tertentu.
    
    Args:
        text_size: Panjang teks yang diinginkan
        pattern: Pattern yang harus ada dalam teks
        occurrences: Jumlah kemunculan pattern yang diinginkan
        alphabet: Karakter yang digunakan
        
    Returns:
        String dengan panjang text_size yang mengandung pattern
    """
    if text_size <= 0:
        return ""
    if not pattern:
        return generate_random_text(text_size, alphabet)
    
    m = len(pattern)
    
    # Jika text_size terlalu kecil untuk pattern
    if text_size < m:
        return generate_random_text(text_size, alphabet)
    
    # Generate text dengan menyisipkan pattern
    result = []
    remaining = text_size
    patterns_inserted = 0
    
    while remaining > 0:
        if patterns_inserted < occurrences and remaining >= m:
            # Sisipkan pattern
            result.append(pattern)
            remaining -= m
            patterns_inserted += 1
            
            # Tambahkan random text di antara pattern
            if remaining > 0 and patterns_inserted < occurrences:
                gap = random.randint(1, min(remaining, 10))
                result.append(generate_random_text(gap, alphabet))
                remaining -= gap
        else:
            # Isi sisa dengan random text
            result.append(generate_random_text(remaining, alphabet))
            remaining = 0
    
    text = ''.join(result)
    return text[:text_size]  # Pastikan panjang tepat
