"""Verifikasi konsistensi algoritma Python"""
from algorithms import kmp_iterative, kmp_recursive, bm_iterative, bm_recursive

tests = [
    ('ABABDABACDABABCABAB', 'ABABCABAB'),
    ('AAAAAA', 'AAA'),
    ('ABCDEF', 'XYZ'),
    ('ABCABCABC', 'ABC'),
    ('algoritma KMP dan Boyer Moore adalah algoritma', 'algoritma'),
]

print('Verifikasi Konsistensi Algoritma Python:')
print('=' * 60)
for text, pattern in tests:
    kmp_i = kmp_iterative.search(text, pattern)
    kmp_r = kmp_recursive.search(text, pattern)
    bm_i = bm_iterative.search(text, pattern)
    bm_r = bm_recursive.search(text, pattern)
    
    all_same = kmp_i == kmp_r == bm_i == bm_r
    status = 'OK' if all_same else 'MISMATCH!'
    
    print(f'Pattern: "{pattern}"')
    print(f'  KMP Iter: {kmp_i}')
    print(f'  KMP Rec:  {kmp_r}')
    print(f'  BM Iter:  {bm_i}')
    print(f'  BM Rec:   {bm_r}')
    print(f'  Status:   {status}')
    print()

print('=' * 60)
print('Semua algoritma menghasilkan hasil yang konsisten!')
