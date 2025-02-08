// Function to generate random bytes
function getRandomValues(array: Uint8Array): Uint8Array {
    // Use crypto.getRandomValues if available
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        return crypto.getRandomValues(array);
    }
    
    // Fallback to Math.random
    for (let i = 0; i < array.length; i++) {
        array[i] = Math.floor(Math.random() * 256);
    }
    return array;
}

// Function to generate UUID v4
function generateUUIDv4(): string {
    const rnds = new Uint8Array(16);
    getRandomValues(rnds);

    // Set version (4) and variant (2) bits
    rnds[6] = (rnds[6] & 0x0f) | 0x40;
    rnds[8] = (rnds[8] & 0x3f) | 0x80;

    // Convert to hex string
    const hex = Array.from(rnds).map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Format as UUID
    return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
}

// Patch crypto.randomUUID if it doesn't exist
if (typeof crypto !== 'undefined' && !crypto.randomUUID) {
    Object.defineProperty(crypto, 'randomUUID', {
        configurable: true,
        enumerable: true,
        value: generateUUIDv4
    });
}

export { generateUUIDv4 };
