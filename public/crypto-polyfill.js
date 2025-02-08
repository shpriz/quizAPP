(function() {
    // Ensure crypto is available
    if (typeof window !== 'undefined') {
        if (!window.crypto) {
            window.crypto = {};
        }
        if (!window.crypto.getRandomValues) {
            window.crypto.getRandomValues = function(array) {
                for (let i = 0; i < array.length; i++) {
                    array[i] = Math.floor(Math.random() * 256);
                }
                return array;
            };
        }
        if (!window.crypto.randomUUID) {
            window.crypto.randomUUID = function() {
                const hexDigits = '0123456789abcdef';
                const s = new Array(36);
                
                const getRandomByte = () => {
                    const result = new Uint8Array(1);
                    window.crypto.getRandomValues(result);
                    return result[0];
                };

                for (let i = 0; i < 36; i++) {
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
})();
