interface Crypto {
  randomUUID(): `${string}-${string}-${string}-${string}-${string}`;
  getRandomValues(array: Uint8Array): Uint8Array;
}

interface Window {
  crypto: Crypto;
}

declare const crypto: Crypto;
