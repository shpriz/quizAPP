// Ensure crypto is available in all environments
if (typeof window !== 'undefined' && !window.crypto) {
    (window as any).crypto = {
        getRandomValues: function(array: Uint8Array) {
            for (let i = 0; i < array.length; i++) {
                array[i] = Math.floor(Math.random() * 256);
            }
            return array;
        }
    };
}

// Polyfill for crypto.randomUUID
if (typeof crypto !== 'undefined') {
    if (!crypto.randomUUID) {
        const hexDigits = '0123456789abcdef';
        const s: string[] = new Array(36);
        const getRandomByte = () => {
            if (typeof crypto !== 'undefined') {
                const result = new Uint8Array(1);
                crypto.getRandomValues(result);
                return result[0];
            }
            return Math.floor(Math.random() * 256);
        };

        (crypto as any).randomUUID = function() {
            let i = 0;
            
            // Generate UUID format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
            for (i = 0; i < 36; i++) {
                if (i === 8 || i === 13 || i === 18 || i === 23) {
                    s[i] = '-';
                } else if (i === 14) {
                    s[i] = '4';
                } else {
                    const randomByte = getRandomByte();
                    s[i] = hexDigits[(i === 19) ? ((randomByte & 0x3) | 0x8) : (randomByte & 0xf)];
                }
            }

            return s.join('');
        };
    }
}

export {};  // Make this a module
