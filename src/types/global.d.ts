interface Crypto {
  randomUUID(): `${string}-${string}-${string}-${string}-${string}`;
  getRandomValues(array: Uint8Array): Uint8Array;
}

declare global {
  interface Window {
    crypto: Crypto;
  }
}

export {};