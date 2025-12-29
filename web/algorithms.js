/**
 * Pattern Matching Algorithms - JavaScript Implementation
 * KMP dan Boyer-Moore (Iteratif & Rekursif)
 * Note: Versi rekursif menggunakan simulasi dengan loop untuk menghindari stack overflow
 */

// ==================== KMP ITERATIVE ====================
function kmpComputeFailure(pattern) {
    const m = pattern.length;
    if (m === 0) return [];
    
    const failure = new Array(m).fill(0);
    let j = 0;
    
    for (let i = 1; i < m; i++) {
        while (j > 0 && pattern[i] !== pattern[j]) {
            j = failure[j - 1];
        }
        if (pattern[i] === pattern[j]) {
            j++;
        }
        failure[i] = j;
    }
    
    return failure;
}

function kmpIterative(text, pattern) {
    if (!pattern || !text || pattern.length > text.length) return [];
    
    const n = text.length;
    const m = pattern.length;
    const results = [];
    const failure = kmpComputeFailure(pattern);
    
    let j = 0;
    
    for (let i = 0; i < n; i++) {
        while (j > 0 && text[i] !== pattern[j]) {
            j = failure[j - 1];
        }
        if (text[i] === pattern[j]) {
            j++;
        }
        if (j === m) {
            results.push(i - m + 1);
            j = failure[j - 1];
        }
    }
    
    return results;
}

// ==================== KMP RECURSIVE (Simulated) ====================
// Menggunakan pendekatan rekursif yang disimulasikan dengan stack manual
// untuk menghindari stack overflow pada input besar

function kmpComputeFailureRecursive(pattern) {
    const m = pattern.length;
    if (m === 0) return [];
    
    const failure = new Array(m).fill(0);
    
    // Simulasi rekursi dengan stack
    const stack = [{i: 1, j: 0}];
    
    while (stack.length > 0) {
        let {i, j} = stack.pop();
        
        if (i >= m) continue;
        
        if (pattern[i] === pattern[j]) {
            failure[i] = j + 1;
            stack.push({i: i + 1, j: j + 1});
        } else if (j > 0) {
            stack.push({i: i, j: failure[j - 1]});
        } else {
            failure[i] = 0;
            stack.push({i: i + 1, j: 0});
        }
    }
    
    return failure;
}

function kmpRecursive(text, pattern) {
    if (!pattern || !text || pattern.length > text.length) return [];
    
    const n = text.length;
    const m = pattern.length;
    const results = [];
    const failure = kmpComputeFailureRecursive(pattern);
    
    // Simulasi rekursi dengan stack
    const stack = [{tIdx: 0, pIdx: 0}];
    
    while (stack.length > 0) {
        let {tIdx, pIdx} = stack.pop();
        
        if (tIdx >= n) continue;
        
        if (text[tIdx] === pattern[pIdx]) {
            if (pIdx === m - 1) {
                results.push(tIdx - m + 1);
                const newPIdx = pIdx > 0 ? failure[pIdx] : 0;
                stack.push({tIdx: tIdx + 1, pIdx: newPIdx});
            } else {
                stack.push({tIdx: tIdx + 1, pIdx: pIdx + 1});
            }
        } else if (pIdx > 0) {
            stack.push({tIdx: tIdx, pIdx: failure[pIdx - 1]});
        } else {
            stack.push({tIdx: tIdx + 1, pIdx: 0});
        }
    }
    
    return results;
}

// ==================== BOYER-MOORE ITERATIVE ====================
function bmComputeBadChar(pattern) {
    const badChar = {};
    for (let i = 0; i < pattern.length; i++) {
        badChar[pattern[i]] = i;
    }
    return badChar;
}

function bmIterative(text, pattern) {
    if (!pattern || !text || pattern.length > text.length) return [];
    
    const n = text.length;
    const m = pattern.length;
    const results = [];
    const badChar = bmComputeBadChar(pattern);
    
    let s = 0;
    
    while (s <= n - m) {
        let j = m - 1;
        
        while (j >= 0 && pattern[j] === text[s + j]) {
            j--;
        }
        
        if (j < 0) {
            results.push(s);
            if (s + m < n) {
                s += m - (badChar[text[s + m]] ?? -1);
            } else {
                s += 1;
            }
        } else {
            const shift = j - (badChar[text[s + j]] ?? -1);
            s += Math.max(1, shift);
        }
    }
    
    return results;
}

// ==================== BOYER-MOORE RECURSIVE (Simulated) ====================
function bmComputeBadCharRecursive(pattern) {
    const table = {};
    
    // Simulasi rekursi dengan stack
    const stack = [{index: 0}];
    
    while (stack.length > 0) {
        const {index} = stack.pop();
        if (index >= pattern.length) continue;
        
        table[pattern[index]] = index;
        stack.push({index: index + 1});
    }
    
    return table;
}

function bmRecursive(text, pattern) {
    if (!pattern || !text || pattern.length > text.length) return [];
    
    const n = text.length;
    const m = pattern.length;
    const results = [];
    const badChar = bmComputeBadCharRecursive(pattern);
    
    // Simulasi rekursi dengan stack
    const stack = [{s: 0}];
    
    while (stack.length > 0) {
        const {s} = stack.pop();
        
        if (s > n - m) continue;
        
        // Match dari kanan ke kiri
        let j = m - 1;
        while (j >= 0 && pattern[j] === text[s + j]) {
            j--;
        }
        
        if (j < 0) {
            results.push(s);
            let nextShift;
            if (s + m < n) {
                nextShift = m - (badChar[text[s + m]] ?? -1);
            } else {
                nextShift = 1;
            }
            stack.push({s: s + nextShift});
        } else {
            const shift = j - (badChar[text[s + j]] ?? -1);
            stack.push({s: s + Math.max(1, shift)});
        }
    }
    
    return results;
}

// ==================== UTILITY ====================
function generateRandomText(size) {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < size; i++) {
        result += chars[Math.floor(Math.random() * chars.length)];
    }
    return result;
}

function generateRandomPattern(length) {
    return generateRandomText(length);
}

// Export for use
window.algorithms = {
    kmpIterative,
    kmpRecursive,
    bmIterative,
    bmRecursive,
    generateRandomText,
    generateRandomPattern
};
