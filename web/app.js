/**
 * Main Application Logic
 */

let chart = null;

// Measure execution time with warm-up for more stable results
function measureTime(fn, text, pattern, iterations = 50) {
    // Warm-up runs (tidak dihitung) - untuk stabilkan JIT compiler
    for (let i = 0; i < 5; i++) {
        fn(text, pattern);
    }
    
    // Actual measurement
    const times = [];
    let result;
    
    for (let i = 0; i < iterations; i++) {
        const start = performance.now();
        result = fn(text, pattern);
        const end = performance.now();
        times.push((end - start) * 1000); // Convert to microseconds
    }
    
    // Remove outliers (top and bottom 10%) for more stable results
    times.sort((a, b) => a - b);
    const trimCount = Math.floor(times.length * 0.1);
    const trimmedTimes = times.slice(trimCount, times.length - trimCount);
    
    const avgTime = trimmedTimes.reduce((a, b) => a + b, 0) / trimmedTimes.length;
    
    return {
        time: avgTime,
        result: result
    };
}

// Run search with all algorithms - using same text for fair comparison
function runSearch() {
    const text = document.getElementById('text').value;
    const pattern = document.getElementById('pattern').value;
    const statusEl = document.getElementById('status');
    
    if (!text || !pattern) {
        statusEl.className = 'status show error';
        statusEl.textContent = '❌ Mohon isi teks dan pattern!';
        return;
    }
    
    if (pattern.length > text.length) {
        statusEl.className = 'status show error';
        statusEl.textContent = '❌ Pattern lebih panjang dari teks!';
        return;
    }
    
    // Run all algorithms with the SAME text simultaneously for fair comparison
    const results = runAllAlgorithmsSimultaneous(text, pattern, 50);
    
    // Get actual match results (run once to get positions)
    const kmpResult = algorithms.kmpIterative(text, pattern);
    const kmpRecResult = algorithms.kmpRecursive(text, pattern);
    const bmResult = algorithms.bmIterative(text, pattern);
    const bmRecResult = algorithms.bmRecursive(text, pattern);
    
    // Update UI
    document.getElementById('kmp-iter-time').textContent = results.kmpIter.toFixed(2);
    document.getElementById('kmp-iter-matches').textContent = `${kmpResult.length} match`;
    
    document.getElementById('kmp-rec-time').textContent = results.kmpRec.toFixed(2);
    document.getElementById('kmp-rec-matches').textContent = `${kmpRecResult.length} match`;
    
    document.getElementById('bm-iter-time').textContent = results.bmIter.toFixed(2);
    document.getElementById('bm-iter-matches').textContent = `${bmResult.length} match`;
    
    document.getElementById('bm-rec-time').textContent = results.bmRec.toFixed(2);
    document.getElementById('bm-rec-matches').textContent = `${bmRecResult.length} match`;
    
    // Show positions
    const posEl = document.getElementById('positions');
    const posListEl = document.getElementById('pos-list');
    
    if (kmpResult.length > 0) {
        posEl.style.display = 'block';
        posListEl.textContent = kmpResult.join(', ');
    } else {
        posEl.style.display = 'block';
        posListEl.textContent = 'Pattern tidak ditemukan';
    }
    
    // Verify all results match
    const allMatch = JSON.stringify(kmpResult) === JSON.stringify(kmpRecResult) &&
                     JSON.stringify(kmpResult) === JSON.stringify(bmResult) &&
                     JSON.stringify(kmpResult) === JSON.stringify(bmRecResult);
    
    if (allMatch) {
        statusEl.className = 'status show success';
        statusEl.textContent = `✅ Pencarian selesai! Semua algoritma menghasilkan hasil yang sama (dijalankan bersamaan dengan teks yang sama).`;
    } else {
        statusEl.className = 'status show error';
        statusEl.textContent = '⚠️ Peringatan: Hasil algoritma berbeda!';
    }
}

// Generate random text and pattern
function generateRandom() {
    const sizeSelect = document.getElementById('textSize');
    const size = sizeSelect.value === 'custom' ? 100 : parseInt(sizeSelect.value);
    const patternLength = Math.floor(Math.random() * 5) + 3;
    
    const text = algorithms.generateRandomText(size);
    const pattern = algorithms.generateRandomPattern(patternLength);
    
    document.getElementById('text').value = text;
    document.getElementById('pattern').value = pattern;
    updateTextLength();
    
    document.getElementById('status').className = 'status show success';
    document.getElementById('status').textContent = `🎲 Generated: Teks ${size} karakter, Pattern ${patternLength} karakter`;
}

// Generate text by selected size
function generateTextBySize() {
    const sizeSelect = document.getElementById('textSize');
    const size = parseInt(sizeSelect.value);
    
    if (sizeSelect.value === 'custom') {
        document.getElementById('status').className = 'status show success';
        document.getElementById('status').textContent = `📝 Mode custom: Ketik teks manual di textarea`;
        return;
    }
    
    // Base text yang akan diulang
    const baseText = 'Analisis efisiensi dari algoritma algoritma yang diterapkan dengan menentukan kelas kompleksitas waktunya serta dengan menganalisis running time dari kedua program yang telah dibuat dalam berbagai macam ukuran masukan algoritma KMP dan Boyer Moore adalah dua algoritma pencarian string yang populer algoritma ini digunakan untuk mencari pola dalam teks dengan efisien ';
    
    let text = '';
    while (text.length < size) {
        text += baseText;
    }
    text = text.substring(0, size);
    
    document.getElementById('text').value = text;
    updateTextLength();
    
    document.getElementById('status').className = 'status show success';
    document.getElementById('status').textContent = `📄 Teks dengan ${size} karakter berhasil di-generate!`;
}

// Update text length display
function updateTextLength() {
    const text = document.getElementById('text').value;
    document.getElementById('textLength').textContent = text.length;
}

// Sample text for demo
function useSampleText() {
    const sampleText = `Analisis efisiensi dari algoritma algoritma yang diterapkan dengan menentukan kelas kompleksitas waktunya serta dengan menganalisis running time dari kedua program yang telah dibuat dalam berbagai macam ukuran masukan misalkan ukuran masukan satu sepuluh dua puluh hingga sepuluh ribu dan gambarkan grafiknya serta tentukan kelas kompleksitas masing masing algoritma tersebut. Algoritma KMP dan Boyer Moore adalah dua algoritma pencarian string yang populer. Algoritma ini digunakan untuk mencari pola dalam teks dengan efisien.`;
    
    document.getElementById('text').value = sampleText;
    document.getElementById('pattern').value = 'algoritma';
    updateTextLength();
    
    document.getElementById('status').className = 'status show success';
    document.getElementById('status').textContent = `📄 Contoh teks dimuat! Teks ${sampleText.length} karakter, Pattern: "algoritma"`;
}

// Measure time for single run (no averaging) - untuk fair comparison
function measureTimeSingle(fn, text, pattern) {
    const start = performance.now();
    const result = fn(text, pattern);
    const end = performance.now();
    return {
        time: (end - start) * 1000, // Convert to microseconds
        result: result
    };
}

// Run all algorithms simultaneously with the SAME text for fair comparison
function runAllAlgorithmsSimultaneous(text, pattern, iterations = 30) {
    // Warm-up semua algoritma dulu
    for (let i = 0; i < 5; i++) {
        algorithms.kmpIterative(text, pattern);
        algorithms.kmpRecursive(text, pattern);
        algorithms.bmIterative(text, pattern);
        algorithms.bmRecursive(text, pattern);
    }
    
    // Collect times for each algorithm
    const times = {
        kmpIter: [],
        kmpRec: [],
        bmIter: [],
        bmRec: []
    };
    
    // Run all algorithms in interleaved fashion for fairness
    for (let i = 0; i < iterations; i++) {
        // Randomize order each iteration to avoid bias
        const order = [0, 1, 2, 3].sort(() => Math.random() - 0.5);
        
        for (const idx of order) {
            switch(idx) {
                case 0:
                    times.kmpIter.push(measureTimeSingle(algorithms.kmpIterative, text, pattern).time);
                    break;
                case 1:
                    times.kmpRec.push(measureTimeSingle(algorithms.kmpRecursive, text, pattern).time);
                    break;
                case 2:
                    times.bmIter.push(measureTimeSingle(algorithms.bmIterative, text, pattern).time);
                    break;
                case 3:
                    times.bmRec.push(measureTimeSingle(algorithms.bmRecursive, text, pattern).time);
                    break;
            }
        }
    }
    
    // Calculate median (more stable than mean)
    const getMedian = (arr) => {
        const sorted = [...arr].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
    };
    
    return {
        kmpIter: getMedian(times.kmpIter),
        kmpRec: getMedian(times.kmpRec),
        bmIter: getMedian(times.bmIter),
        bmRec: getMedian(times.bmRec)
    };
}

// Run benchmark with random text (pattern disisipkan ke dalam teks)
function runBenchmark() {
    console.log('Starting benchmark...');
    const statusEl = document.getElementById('benchmarkStatus');
    
    try {
        // Get user input for sizes
        const sizesInput = document.getElementById('benchmarkSizes').value;
        const sizes = sizesInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n > 0);
        
        if (sizes.length === 0) {
            statusEl.className = 'status show error';
            statusEl.textContent = '❌ Masukkan ukuran input yang valid!';
            return;
        }
        
        // Get pattern from user input
        const pattern = document.getElementById('pattern').value || 'test';
        
        if (!pattern) {
            statusEl.className = 'status show error';
            statusEl.textContent = '❌ Mohon isi pattern terlebih dahulu!';
            return;
        }
        
        statusEl.className = 'status show success';
        statusEl.textContent = `⏳ Menjalankan benchmark dengan ${sizes.length} ukuran input, pattern: "${pattern}"...`;
        
        const data = {
            kmpIter: [],
            kmpRec: [],
            bmIter: [],
            bmRec: []
        };
        
        // Use setTimeout to allow UI update
        setTimeout(() => {
            for (const size of sizes) {
                // Generate text SEKALI untuk semua algoritma (fair comparison)
                const text = generateTextWithPattern(size, pattern);
                
                // Run all algorithms with the SAME text simultaneously
                const results = runAllAlgorithmsSimultaneous(text, pattern, 30);
                
                data.kmpIter.push(results.kmpIter);
                data.kmpRec.push(results.kmpRec);
                data.bmIter.push(results.bmIter);
                data.bmRec.push(results.bmRec);
            }
            
            console.log('Benchmark data:', data);
            
            // Store for separate charts
            window.benchmarkData = { sizes, data };
            
            // Update all charts
            updateChart(sizes, data);
            updateKMPChart(sizes, data);
            updateBMChart(sizes, data);
            updateBenchmarkTable(sizes, data);
            updateAnalysisSection(sizes, data);
            
            statusEl.className = 'status show success';
            statusEl.textContent = `✅ Benchmark selesai! Ukuran: [${sizes.join(', ')}], Pattern: "${pattern}" (semua algoritma dijalankan dengan teks yang sama)`;
            
            console.log('Charts updated!');
        }, 100);
        
    } catch (error) {
        console.error('Benchmark error:', error);
        statusEl.className = 'status show error';
        statusEl.textContent = '❌ Error: ' + error.message;
    }
}

// Update analysis section with benchmark results
function updateAnalysisSection(sizes, data) {
    const analysisEl = document.getElementById('analysisSection');
    if (!analysisEl) return;
    
    // Get pattern length (m)
    const pattern = document.getElementById('pattern').value || '';
    const m = pattern.length;
    
    // Get min and max n from sizes
    const minN = Math.min(...sizes);
    const maxN = Math.max(...sizes);
    
    // Calculate statistics
    const totalKmpIter = data.kmpIter.reduce((a, b) => a + b, 0);
    const totalKmpRec = data.kmpRec.reduce((a, b) => a + b, 0);
    const totalBmIter = data.bmIter.reduce((a, b) => a + b, 0);
    const totalBmRec = data.bmRec.reduce((a, b) => a + b, 0);
    
    const avgKmpIter = totalKmpIter / data.kmpIter.length;
    const avgKmpRec = totalKmpRec / data.kmpRec.length;
    const avgBmIter = totalBmIter / data.bmIter.length;
    const avgBmRec = totalBmRec / data.bmRec.length;
    
    // Find min/max
    const minKmpIter = Math.min(...data.kmpIter);
    const maxKmpIter = Math.max(...data.kmpIter);
    const minKmpRec = Math.min(...data.kmpRec);
    const maxKmpRec = Math.max(...data.kmpRec);
    const minBmIter = Math.min(...data.bmIter);
    const maxBmIter = Math.max(...data.bmIter);
    const minBmRec = Math.min(...data.bmRec);
    const maxBmRec = Math.max(...data.bmRec);
    
    // Determine fastest algorithm overall
    const avgTimes = [
        { name: 'KMP Iteratif', avg: avgKmpIter },
        { name: 'KMP Rekursif', avg: avgKmpRec },
        { name: 'Boyer-Moore Iteratif', avg: avgBmIter },
        { name: 'Boyer-Moore Rekursif', avg: avgBmRec }
    ];
    avgTimes.sort((a, b) => a.avg - b.avg);
    
    // Calculate growth rate (approximate complexity)
    const growthKmpIter = data.kmpIter.length > 1 ? (data.kmpIter[data.kmpIter.length-1] / data.kmpIter[0]).toFixed(2) : '-';
    const growthKmpRec = data.kmpRec.length > 1 ? (data.kmpRec[data.kmpRec.length-1] / data.kmpRec[0]).toFixed(2) : '-';
    const growthBmIter = data.bmIter.length > 1 ? (data.bmIter[data.bmIter.length-1] / data.bmIter[0]).toFixed(2) : '-';
    const growthBmRec = data.bmRec.length > 1 ? (data.bmRec[data.bmRec.length-1] / data.bmRec[0]).toFixed(2) : '-';
    
    const html = `
        <h3 style="color: #00d4ff; margin-bottom: 15px; font-size: 1rem;">📊 Hasil Perhitungan Benchmark</h3>
        
        <!-- Parameter Info -->
        <div style="background: rgba(0,212,255,0.1); padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #00d4ff;">
            <h4 style="color: #00d4ff; margin-bottom: 10px;">📐 Parameter Benchmark</h4>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                <div>
                    <span style="color: #888;">n (panjang teks):</span>
                    <span style="color: #fff; font-weight: bold;"> ${minN.toLocaleString()} - ${maxN.toLocaleString()} karakter</span>
                </div>
                <div>
                    <span style="color: #888;">m (panjang pattern):</span>
                    <span style="color: #fff; font-weight: bold;"> ${m} karakter</span>
                </div>
                <div>
                    <span style="color: #888;">Pattern:</span>
                    <span style="color: #f39c12; font-weight: bold;"> "${pattern}"</span>
                </div>
                <div>
                    <span style="color: #888;">Ukuran diuji:</span>
                    <span style="color: #fff;"> ${sizes.length} variasi</span>
                </div>
            </div>
        </div>
        
        <!-- Summary Cards -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 20px;">
            <div style="background: rgba(46,204,113,0.15); padding: 15px; border-radius: 8px; text-align: center;">
                <div style="color: #2ecc71; font-size: 1.5rem; font-weight: bold;">${avgKmpIter.toFixed(2)}</div>
                <div style="color: #888; font-size: 0.8rem;">KMP Iteratif (μs)</div>
            </div>
            <div style="background: rgba(231,76,60,0.15); padding: 15px; border-radius: 8px; text-align: center;">
                <div style="color: #e74c3c; font-size: 1.5rem; font-weight: bold;">${avgKmpRec.toFixed(2)}</div>
                <div style="color: #888; font-size: 0.8rem;">KMP Rekursif (μs)</div>
            </div>
            <div style="background: rgba(52,152,219,0.15); padding: 15px; border-radius: 8px; text-align: center;">
                <div style="color: #3498db; font-size: 1.5rem; font-weight: bold;">${avgBmIter.toFixed(2)}</div>
                <div style="color: #888; font-size: 0.8rem;">BM Iteratif (μs)</div>
            </div>
            <div style="background: rgba(155,89,182,0.15); padding: 15px; border-radius: 8px; text-align: center;">
                <div style="color: #9b59b6; font-size: 1.5rem; font-weight: bold;">${avgBmRec.toFixed(2)}</div>
                <div style="color: #888; font-size: 0.8rem;">BM Rekursif (μs)</div>
            </div>
        </div>
        
        <!-- Detailed Statistics Table -->
        <div style="overflow-x: auto; margin-bottom: 20px;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                <thead>
                    <tr style="background: rgba(0,212,255,0.2);">
                        <th style="padding: 10px; border: 1px solid rgba(255,255,255,0.2);">Statistik</th>
                        <th style="padding: 10px; border: 1px solid rgba(255,255,255,0.2); color: #2ecc71;">KMP Iteratif</th>
                        <th style="padding: 10px; border: 1px solid rgba(255,255,255,0.2); color: #e74c3c;">KMP Rekursif</th>
                        <th style="padding: 10px; border: 1px solid rgba(255,255,255,0.2); color: #3498db;">BM Iteratif</th>
                        <th style="padding: 10px; border: 1px solid rgba(255,255,255,0.2); color: #9b59b6;">BM Rekursif</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="background: rgba(0,0,0,0.2);">
                        <td style="padding: 8px; border: 1px solid rgba(255,255,255,0.2);">Minimum (μs)</td>
                        <td style="padding: 8px; border: 1px solid rgba(255,255,255,0.2); text-align: center;">${minKmpIter.toFixed(2)}</td>
                        <td style="padding: 8px; border: 1px solid rgba(255,255,255,0.2); text-align: center;">${minKmpRec.toFixed(2)}</td>
                        <td style="padding: 8px; border: 1px solid rgba(255,255,255,0.2); text-align: center;">${minBmIter.toFixed(2)}</td>
                        <td style="padding: 8px; border: 1px solid rgba(255,255,255,0.2); text-align: center;">${minBmRec.toFixed(2)}</td>
                    </tr>
                    <tr style="background: rgba(0,0,0,0.1);">
                        <td style="padding: 8px; border: 1px solid rgba(255,255,255,0.2);">Maksimum (μs)</td>
                        <td style="padding: 8px; border: 1px solid rgba(255,255,255,0.2); text-align: center;">${maxKmpIter.toFixed(2)}</td>
                        <td style="padding: 8px; border: 1px solid rgba(255,255,255,0.2); text-align: center;">${maxKmpRec.toFixed(2)}</td>
                        <td style="padding: 8px; border: 1px solid rgba(255,255,255,0.2); text-align: center;">${maxBmIter.toFixed(2)}</td>
                        <td style="padding: 8px; border: 1px solid rgba(255,255,255,0.2); text-align: center;">${maxBmRec.toFixed(2)}</td>
                    </tr>
                    <tr style="background: rgba(0,0,0,0.2);">
                        <td style="padding: 8px; border: 1px solid rgba(255,255,255,0.2);">Rata-rata (μs)</td>
                        <td style="padding: 8px; border: 1px solid rgba(255,255,255,0.2); text-align: center; font-weight: bold;">${avgKmpIter.toFixed(2)}</td>
                        <td style="padding: 8px; border: 1px solid rgba(255,255,255,0.2); text-align: center; font-weight: bold;">${avgKmpRec.toFixed(2)}</td>
                        <td style="padding: 8px; border: 1px solid rgba(255,255,255,0.2); text-align: center; font-weight: bold;">${avgBmIter.toFixed(2)}</td>
                        <td style="padding: 8px; border: 1px solid rgba(255,255,255,0.2); text-align: center; font-weight: bold;">${avgBmRec.toFixed(2)}</td>
                    </tr>
                    <tr style="background: rgba(0,0,0,0.1);">
                        <td style="padding: 8px; border: 1px solid rgba(255,255,255,0.2);">Total (μs)</td>
                        <td style="padding: 8px; border: 1px solid rgba(255,255,255,0.2); text-align: center;">${totalKmpIter.toFixed(2)}</td>
                        <td style="padding: 8px; border: 1px solid rgba(255,255,255,0.2); text-align: center;">${totalKmpRec.toFixed(2)}</td>
                        <td style="padding: 8px; border: 1px solid rgba(255,255,255,0.2); text-align: center;">${totalBmIter.toFixed(2)}</td>
                        <td style="padding: 8px; border: 1px solid rgba(255,255,255,0.2); text-align: center;">${totalBmRec.toFixed(2)}</td>
                    </tr>
                    <tr style="background: rgba(0,0,0,0.2);">
                        <td style="padding: 8px; border: 1px solid rgba(255,255,255,0.2);">Rasio Pertumbuhan (n=${minN}→${maxN})</td>
                        <td style="padding: 8px; border: 1px solid rgba(255,255,255,0.2); text-align: center;">${growthKmpIter}x</td>
                        <td style="padding: 8px; border: 1px solid rgba(255,255,255,0.2); text-align: center;">${growthKmpRec}x</td>
                        <td style="padding: 8px; border: 1px solid rgba(255,255,255,0.2); text-align: center;">${growthBmIter}x</td>
                        <td style="padding: 8px; border: 1px solid rgba(255,255,255,0.2); text-align: center;">${growthBmRec}x</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <!-- Ranking -->
        <div style="background: rgba(243,156,18,0.1); padding: 15px; border-radius: 8px; border-left: 4px solid #f39c12;">
            <h4 style="color: #f39c12; margin-bottom: 10px;">🏆 Peringkat Algoritma (Tercepat ke Terlambat)</h4>
            <p style="color: #666; font-size: 0.8rem; margin-bottom: 10px;">Berdasarkan rata-rata waktu eksekusi dengan n = ${minN}-${maxN}, m = ${m}</p>
            <ol style="margin-left: 20px; color: #aaa;">
                ${avgTimes.map((t, i) => `<li style="margin: 5px 0;"><strong>${t.name}</strong> - ${t.avg.toFixed(2)} μs ${i === 0 ? '⭐' : ''}</li>`).join('')}
            </ol>
        </div>
        
        <!-- Comparison Analysis -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
            <div style="background: rgba(46,204,113,0.1); padding: 15px; border-radius: 8px;">
                <h4 style="color: #2ecc71; margin-bottom: 10px;">KMP: Iteratif vs Rekursif</h4>
                <p style="color: #aaa; font-size: 0.9rem;">
                    Rekursif <strong>${((avgKmpRec / avgKmpIter - 1) * 100).toFixed(1)}%</strong> lebih lambat<br>
                    <span style="color: #666;">Iteratif: ${avgKmpIter.toFixed(2)} μs | Rekursif: ${avgKmpRec.toFixed(2)} μs</span>
                </p>
            </div>
            <div style="background: rgba(52,152,219,0.1); padding: 15px; border-radius: 8px;">
                <h4 style="color: #3498db; margin-bottom: 10px;">Boyer-Moore: Iteratif vs Rekursif</h4>
                <p style="color: #aaa; font-size: 0.9rem;">
                    Rekursif <strong>${((avgBmRec / avgBmIter - 1) * 100).toFixed(1)}%</strong> lebih lambat<br>
                    <span style="color: #666;">Iteratif: ${avgBmIter.toFixed(2)} μs | Rekursif: ${avgBmRec.toFixed(2)} μs</span>
                </p>
            </div>
        </div>
        
        <!-- KMP vs BM -->
        <div style="background: rgba(155,89,182,0.1); padding: 15px; border-radius: 8px; margin-top: 15px;">
            <h4 style="color: #9b59b6; margin-bottom: 10px;">KMP vs Boyer-Moore (Iteratif)</h4>
            <p style="color: #aaa; font-size: 0.9rem;">
                Dengan n = ${minN}-${maxN} dan m = ${m}, 
                <strong>${avgKmpIter < avgBmIter ? 'KMP' : 'Boyer-Moore'}</strong> lebih cepat dengan selisih 
                <strong>${Math.abs(avgKmpIter - avgBmIter).toFixed(2)} μs</strong> 
                (${Math.abs(((avgBmIter / avgKmpIter - 1) * 100)).toFixed(1)}%)
            </p>
        </div>
    `;
    
    analysisEl.innerHTML = html;
    
    // Update dynamic calculations in theory section
    updateDynamicCalculations(sizes, data, m, pattern);
}

// Update dynamic calculations in theory section
function updateDynamicCalculations(sizes, data, m, pattern) {
    const minN = Math.min(...sizes);
    const maxN = Math.max(...sizes);
    
    // Calculate averages
    const avgKmpIter = data.kmpIter.reduce((a, b) => a + b, 0) / data.kmpIter.length;
    const avgKmpRec = data.kmpRec.reduce((a, b) => a + b, 0) / data.kmpRec.length;
    const avgBmIter = data.bmIter.reduce((a, b) => a + b, 0) / data.bmIter.length;
    const avgBmRec = data.bmRec.reduce((a, b) => a + b, 0) / data.bmRec.length;
    
    // Growth rates
    const growthKmpIter = data.kmpIter.length > 1 ? (data.kmpIter[data.kmpIter.length-1] / data.kmpIter[0]) : 1;
    const growthBmIter = data.bmIter.length > 1 ? (data.bmIter[data.bmIter.length-1] / data.bmIter[0]) : 1;
    
    // Speedup calculations
    const speedupKmp = avgKmpRec / avgKmpIter;
    const speedupBm = avgBmRec / avgBmIter;
    const speedupKmpVsBm = avgBmIter / avgKmpIter;
    
    // Update dynamic variables
    const dynamicVars = document.getElementById('dynamicVariables');
    if (dynamicVars) {
        dynamicVars.style.display = 'block';
        dynamicVars.innerHTML = `
            <p style="color: #888; font-size: 0.85rem; margin-bottom: 5px;"><strong>Nilai dari Benchmark:</strong></p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; color: #aaa;">
                <div><strong style="color: #2ecc71;">n</strong> = ${minN.toLocaleString()} - ${maxN.toLocaleString()} karakter</div>
                <div><strong style="color: #2ecc71;">m</strong> = ${m} karakter (pattern: "${pattern}")</div>
            </div>
        `;
    }
    
    // Update KMP calculation
    const kmpCalc = document.getElementById('kmpCalculation');
    if (kmpCalc) {
        kmpCalc.style.display = 'block';
        kmpCalc.innerHTML = `
            <div style="padding: 10px; background: rgba(46,204,113,0.15); border-radius: 5px; margin-top: 10px;">
                <p style="color: #2ecc71; font-size: 0.85rem; margin-bottom: 8px;"><strong>📊 Perhitungan (n=${maxN}, m=${m}):</strong></p>
                <div style="color: #aaa; font-size: 0.8rem; line-height: 1.6;">
                    <div>O(n + m) = O(${maxN} + ${m}) = <strong style="color: #2ecc71;">O(${maxN + m})</strong></div>
                    <div style="margin-top: 5px;">Waktu aktual: <strong style="color: #fff;">${avgKmpIter.toFixed(2)} μs</strong></div>
                    <div>Rasio pertumbuhan: <strong style="color: #fff;">${growthKmpIter.toFixed(2)}x</strong></div>
                </div>
            </div>
        `;
    }
    
    // Update BM calculation
    const bmCalc = document.getElementById('bmCalculation');
    if (bmCalc) {
        bmCalc.style.display = 'block';
        bmCalc.innerHTML = `
            <div style="padding: 10px; background: rgba(52,152,219,0.15); border-radius: 5px; margin-top: 10px;">
                <p style="color: #3498db; font-size: 0.85rem; margin-bottom: 8px;"><strong>📊 Perhitungan (n=${maxN}, m=${m}):</strong></p>
                <div style="color: #aaa; font-size: 0.8rem; line-height: 1.6;">
                    <div>Best: O(n/m) = O(${maxN}/${m}) = <strong style="color: #3498db;">O(${Math.floor(maxN/m)})</strong></div>
                    <div>Worst: O(n×m) = O(${maxN}×${m}) = <strong style="color: #e74c3c;">O(${maxN * m})</strong></div>
                    <div style="margin-top: 5px;">Waktu aktual: <strong style="color: #fff;">${avgBmIter.toFixed(2)} μs</strong></div>
                    <div>Rasio pertumbuhan: <strong style="color: #fff;">${growthBmIter.toFixed(2)}x</strong></div>
                </div>
            </div>
        `;
    }
    
    // Update dynamic calculations section
    const dynCalc = document.getElementById('dynamicCalculations');
    if (dynCalc) {
        dynCalc.style.display = 'block';
        dynCalc.innerHTML = `
            <div class="result-card" style="text-align: left; border-left: 4px solid #9b59b6;">
                <h3 style="color: #9b59b6; font-size: 1.1rem;">🔢 Hasil Perhitungan dengan Rumus</h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px;">
                    <div style="padding: 12px; background: rgba(0,0,0,0.2); border-radius: 5px;">
                        <p style="color: #2ecc71; font-size: 0.9rem; margin-bottom: 8px;"><strong>KMP Iteratif vs Rekursif</strong></p>
                        <div style="color: #aaa; font-size: 0.8rem; line-height: 1.8;">
                            <div>Δ% = ((${avgKmpRec.toFixed(2)} - ${avgKmpIter.toFixed(2)}) / ${avgKmpIter.toFixed(2)}) × 100</div>
                            <div>Δ% = <strong style="color: #e74c3c;">${((avgKmpRec / avgKmpIter - 1) * 100).toFixed(2)}%</strong> lebih lambat</div>
                            <div style="margin-top: 5px;">Speedup = ${avgKmpRec.toFixed(2)} / ${avgKmpIter.toFixed(2)} = <strong style="color: #2ecc71;">${speedupKmp.toFixed(2)}x</strong></div>
                        </div>
                    </div>
                    <div style="padding: 12px; background: rgba(0,0,0,0.2); border-radius: 5px;">
                        <p style="color: #3498db; font-size: 0.9rem; margin-bottom: 8px;"><strong>BM Iteratif vs Rekursif</strong></p>
                        <div style="color: #aaa; font-size: 0.8rem; line-height: 1.8;">
                            <div>Δ% = ((${avgBmRec.toFixed(2)} - ${avgBmIter.toFixed(2)}) / ${avgBmIter.toFixed(2)}) × 100</div>
                            <div>Δ% = <strong style="color: #e74c3c;">${((avgBmRec / avgBmIter - 1) * 100).toFixed(2)}%</strong> lebih lambat</div>
                            <div style="margin-top: 5px;">Speedup = ${avgBmRec.toFixed(2)} / ${avgBmIter.toFixed(2)} = <strong style="color: #3498db;">${speedupBm.toFixed(2)}x</strong></div>
                        </div>
                    </div>
                    <div style="padding: 12px; background: rgba(0,0,0,0.2); border-radius: 5px; grid-column: span 2;">
                        <p style="color: #f39c12; font-size: 0.9rem; margin-bottom: 8px;"><strong>KMP vs Boyer-Moore (Iteratif)</strong></p>
                        <div style="color: #aaa; font-size: 0.8rem; line-height: 1.8;">
                            <div>Perbandingan: KMP = ${avgKmpIter.toFixed(2)} μs, BM = ${avgBmIter.toFixed(2)} μs</div>
                            <div>Selisih = |${avgKmpIter.toFixed(2)} - ${avgBmIter.toFixed(2)}| = <strong style="color: #fff;">${Math.abs(avgKmpIter - avgBmIter).toFixed(2)} μs</strong></div>
                            <div>Δ% = ${Math.abs(((avgBmIter / avgKmpIter - 1) * 100)).toFixed(2)}%</div>
                            <div style="margin-top: 5px;">Kesimpulan: <strong style="color: #f39c12;">${avgKmpIter < avgBmIter ? 'KMP' : 'Boyer-Moore'} lebih cepat ${(Math.max(avgKmpIter, avgBmIter) / Math.min(avgKmpIter, avgBmIter)).toFixed(2)}x</strong></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// Update benchmark results table
function updateBenchmarkTable(sizes, data) {
    const tableContainer = document.getElementById('benchmarkTable');
    if (!tableContainer) return;
    
    // Calculate statistics
    const avgKmpIter = data.kmpIter.reduce((a, b) => a + b, 0) / data.kmpIter.length;
    const avgKmpRec = data.kmpRec.reduce((a, b) => a + b, 0) / data.kmpRec.length;
    const avgBmIter = data.bmIter.reduce((a, b) => a + b, 0) / data.bmIter.length;
    const avgBmRec = data.bmRec.reduce((a, b) => a + b, 0) / data.bmRec.length;
    
    let html = `
        <h3 style="color: #00d4ff; margin-bottom: 15px;">📋 Tabel Hasil Benchmark (dalam μs)</h3>
        <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
                <thead>
                    <tr style="background: rgba(0,212,255,0.2);">
                        <th style="padding: 12px; border: 1px solid rgba(255,255,255,0.2); text-align: center;">Ukuran (n)</th>
                        <th style="padding: 12px; border: 1px solid rgba(255,255,255,0.2); text-align: center; color: #2ecc71;">KMP Iteratif</th>
                        <th style="padding: 12px; border: 1px solid rgba(255,255,255,0.2); text-align: center; color: #e74c3c;">KMP Rekursif</th>
                        <th style="padding: 12px; border: 1px solid rgba(255,255,255,0.2); text-align: center; color: #3498db;">BM Iteratif</th>
                        <th style="padding: 12px; border: 1px solid rgba(255,255,255,0.2); text-align: center; color: #9b59b6;">BM Rekursif</th>
                        <th style="padding: 12px; border: 1px solid rgba(255,255,255,0.2); text-align: center; color: #f39c12;">Tercepat</th>
                    </tr>
                </thead>
                <tbody>`;
    
    for (let i = 0; i < sizes.length; i++) {
        const times = [
            { name: 'KMP Iter', time: data.kmpIter[i] },
            { name: 'KMP Rec', time: data.kmpRec[i] },
            { name: 'BM Iter', time: data.bmIter[i] },
            { name: 'BM Rec', time: data.bmRec[i] }
        ];
        const fastest = times.reduce((a, b) => a.time < b.time ? a : b);
        
        html += `
            <tr style="background: ${i % 2 === 0 ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.1)'};">
                <td style="padding: 10px; border: 1px solid rgba(255,255,255,0.2); text-align: center; font-weight: bold;">${sizes[i].toLocaleString()}</td>
                <td style="padding: 10px; border: 1px solid rgba(255,255,255,0.2); text-align: center; ${data.kmpIter[i] === fastest.time ? 'color: #2ecc71; font-weight: bold;' : ''}">${data.kmpIter[i].toFixed(2)}</td>
                <td style="padding: 10px; border: 1px solid rgba(255,255,255,0.2); text-align: center; ${data.kmpRec[i] === fastest.time ? 'color: #2ecc71; font-weight: bold;' : ''}">${data.kmpRec[i].toFixed(2)}</td>
                <td style="padding: 10px; border: 1px solid rgba(255,255,255,0.2); text-align: center; ${data.bmIter[i] === fastest.time ? 'color: #2ecc71; font-weight: bold;' : ''}">${data.bmIter[i].toFixed(2)}</td>
                <td style="padding: 10px; border: 1px solid rgba(255,255,255,0.2); text-align: center; ${data.bmRec[i] === fastest.time ? 'color: #2ecc71; font-weight: bold;' : ''}">${data.bmRec[i].toFixed(2)}</td>
                <td style="padding: 10px; border: 1px solid rgba(255,255,255,0.2); text-align: center; color: #f39c12; font-weight: bold;">${fastest.name}</td>
            </tr>`;
    }
    
    html += `
                    <tr style="background: rgba(0,212,255,0.1); font-weight: bold;">
                        <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.2); text-align: center;">Rata-rata</td>
                        <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.2); text-align: center; color: #2ecc71;">${avgKmpIter.toFixed(2)}</td>
                        <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.2); text-align: center; color: #e74c3c;">${avgKmpRec.toFixed(2)}</td>
                        <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.2); text-align: center; color: #3498db;">${avgBmIter.toFixed(2)}</td>
                        <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.2); text-align: center; color: #9b59b6;">${avgBmRec.toFixed(2)}</td>
                        <td style="padding: 12px; border: 1px solid rgba(255,255,255,0.2); text-align: center;">-</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div style="margin-top: 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
            <div style="background: rgba(46,204,113,0.1); padding: 15px; border-radius: 8px; border-left: 4px solid #2ecc71;">
                <div style="color: #888; font-size: 0.8rem;">KMP Iteratif vs Rekursif</div>
                <div style="font-size: 1.2rem; font-weight: bold; color: #2ecc71;">${((avgKmpRec / avgKmpIter - 1) * 100).toFixed(1)}% lebih lambat</div>
                <div style="color: #666; font-size: 0.75rem;">Rekursif dibanding Iteratif</div>
            </div>
            <div style="background: rgba(52,152,219,0.1); padding: 15px; border-radius: 8px; border-left: 4px solid #3498db;">
                <div style="color: #888; font-size: 0.8rem;">BM Iteratif vs Rekursif</div>
                <div style="font-size: 1.2rem; font-weight: bold; color: #3498db;">${((avgBmRec / avgBmIter - 1) * 100).toFixed(1)}% lebih lambat</div>
                <div style="color: #666; font-size: 0.75rem;">Rekursif dibanding Iteratif</div>
            </div>
            <div style="background: rgba(243,156,18,0.1); padding: 15px; border-radius: 8px; border-left: 4px solid #f39c12;">
                <div style="color: #888; font-size: 0.8rem;">KMP vs Boyer-Moore (Iteratif)</div>
                <div style="font-size: 1.2rem; font-weight: bold; color: #f39c12;">${avgKmpIter < avgBmIter ? 'KMP' : 'BM'} lebih cepat</div>
                <div style="color: #666; font-size: 0.75rem;">${Math.abs(((avgBmIter / avgKmpIter - 1) * 100)).toFixed(1)}% perbedaan</div>
            </div>
        </div>
    `;
    
    tableContainer.innerHTML = html;
    tableContainer.style.display = 'block';
}

// Generate text dengan pattern disisipkan secara berkala
function generateTextWithPattern(size, pattern) {
    if (size <= pattern.length) {
        return pattern.substring(0, size);
    }
    
    let text = '';
    const insertInterval = Math.max(50, Math.floor(size / 10)); // Sisipkan pattern setiap ~10% teks
    
    while (text.length < size) {
        // Tambah random text
        const randomPart = algorithms.generateRandomText(Math.min(insertInterval, size - text.length));
        text += randomPart;
        
        // Sisipkan pattern jika masih cukup ruang
        if (text.length + pattern.length <= size) {
            text += pattern;
        }
    }
    
    return text.substring(0, size);
}

// Run benchmark with user's text (scaled)
function runBenchmarkWithUserText() {
    console.log('Starting benchmark with user text...');
    const statusEl = document.getElementById('benchmarkStatus');
    
    try {
        const userText = document.getElementById('text').value;
        const pattern = document.getElementById('pattern').value;
        
        if (!userText || !pattern) {
            statusEl.className = 'status show error';
            statusEl.textContent = '❌ Mohon isi teks dan pattern terlebih dahulu!';
            return;
        }
        
        // Get user input for sizes
        const sizesInput = document.getElementById('benchmarkSizes').value;
        const sizes = sizesInput.split(',').map(s => parseInt(s.trim())).filter(n => !isNaN(n) && n > 0);
        
        if (sizes.length === 0) {
            statusEl.className = 'status show error';
            statusEl.textContent = '❌ Masukkan ukuran input yang valid!';
            return;
        }
        
        statusEl.className = 'status show success';
        statusEl.textContent = `⏳ Menjalankan benchmark dengan teks user, pattern: "${pattern}"...`;
        
        const data = {
            kmpIter: [],
            kmpRec: [],
            bmIter: [],
            bmRec: []
        };
        
        // Use setTimeout to allow UI update
        setTimeout(() => {
            for (const size of sizes) {
                // Scale user text to desired size - SAME text for all algorithms
                let text = '';
                while (text.length < size) {
                    text += userText + ' ';
                }
                text = text.substring(0, size);
                
                // Run all algorithms with the SAME text simultaneously
                const results = runAllAlgorithmsSimultaneous(text, pattern, 30);
                
                data.kmpIter.push(results.kmpIter);
                data.kmpRec.push(results.kmpRec);
                data.bmIter.push(results.bmIter);
                data.bmRec.push(results.bmRec);
            }
            
            console.log('Benchmark data:', data);
            
            // Store for separate charts
            window.benchmarkData = { sizes, data };
            
            // Update all charts
            updateChart(sizes, data);
            updateKMPChart(sizes, data);
            updateBMChart(sizes, data);
            updateBenchmarkTable(sizes, data);
            updateAnalysisSection(sizes, data);
            
            statusEl.className = 'status show success';
            statusEl.textContent = `✅ Benchmark selesai! Ukuran: [${sizes.join(', ')}], Pattern: "${pattern}" (teks user, semua algoritma dijalankan bersamaan)`;
            
            console.log('Charts updated!');
        }, 100);
        
    } catch (error) {
        console.error('Benchmark error:', error);
        statusEl.className = 'status show error';
        statusEl.textContent = '❌ Error: ' + error.message;
    }
}

// Update chart
function updateChart(labels, data) {
    console.log('Updating main chart...');
    const canvas = document.getElementById('chart');
    if (!canvas) {
        console.error('Canvas #chart not found!');
        return;
    }
    const ctx = canvas.getContext('2d');
    
    if (chart) {
        chart.destroy();
    }
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'KMP Iteratif',
                    data: data.kmpIter,
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    tension: 0.3,
                    pointRadius: 5
                },
                {
                    label: 'KMP Rekursif',
                    data: data.kmpRec,
                    borderColor: '#27ae60',
                    backgroundColor: 'rgba(39, 174, 96, 0.1)',
                    borderDash: [5, 5],
                    tension: 0.3,
                    pointRadius: 5
                },
                {
                    label: 'Boyer-Moore Iteratif',
                    data: data.bmIter,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.3,
                    pointRadius: 5
                },
                {
                    label: 'Boyer-Moore Rekursif',
                    data: data.bmRec,
                    borderColor: '#2980b9',
                    backgroundColor: 'rgba(41, 128, 185, 0.1)',
                    borderDash: [5, 5],
                    tension: 0.3,
                    pointRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Perbandingan Waktu Eksekusi (μs)',
                    color: '#fff',
                    font: { size: 16 }
                },
                legend: {
                    labels: { color: '#fff' }
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Ukuran Input (karakter)',
                        color: '#888'
                    },
                    ticks: { color: '#888' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Waktu (μs)',
                        color: '#888'
                    },
                    ticks: { color: '#888' },
                    grid: { color: 'rgba(255,255,255,0.1)' }
                }
            }
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Update text length on load
    updateTextLength();
    // Generate initial text based on selected size
    generateTextBySize();
    // Run initial search with default values
    runSearch();
});


// KMP Comparison Chart
let kmpChart = null;
function updateKMPChart(labels, data) {
    const ctx = document.getElementById('kmpChart');
    if (!ctx) return;
    
    if (kmpChart) kmpChart.destroy();
    
    kmpChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'KMP Iteratif',
                    data: data.kmpIter,
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    tension: 0.3,
                    pointRadius: 5
                },
                {
                    label: 'KMP Rekursif',
                    data: data.kmpRec,
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    tension: 0.3,
                    pointRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'KMP: Iteratif vs Rekursif',
                    color: '#fff',
                    font: { size: 14 }
                },
                legend: { labels: { color: '#fff' } }
            },
            scales: {
                x: { ticks: { color: '#888' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                y: { ticks: { color: '#888' }, grid: { color: 'rgba(255,255,255,0.1)' } }
            }
        }
    });
}

// Boyer-Moore Comparison Chart
let bmChart = null;
function updateBMChart(labels, data) {
    const ctx = document.getElementById('bmChart');
    if (!ctx) return;
    
    if (bmChart) bmChart.destroy();
    
    bmChart = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Boyer-Moore Iteratif',
                    data: data.bmIter,
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.3,
                    pointRadius: 5
                },
                {
                    label: 'Boyer-Moore Rekursif',
                    data: data.bmRec,
                    borderColor: '#9b59b6',
                    backgroundColor: 'rgba(155, 89, 182, 0.1)',
                    tension: 0.3,
                    pointRadius: 5
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'Boyer-Moore: Iteratif vs Rekursif',
                    color: '#fff',
                    font: { size: 14 }
                },
                legend: { labels: { color: '#fff' } }
            },
            scales: {
                x: { ticks: { color: '#888' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                y: { ticks: { color: '#888' }, grid: { color: 'rgba(255,255,255,0.1)' } }
            }
        }
    });
}
