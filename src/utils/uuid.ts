import { v4 as uuidv4 } from 'uuid';

export function generateUUID(): string {
    // Try using crypto.randomUUID first
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
        return crypto.randomUUID();
    }
    
    // Fallback to uuid library
    return uuidv4();
}
