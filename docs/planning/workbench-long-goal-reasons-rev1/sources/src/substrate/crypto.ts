export async function sha256(input: Uint8Array): Promise<Uint8Array> {
  const ownedBuffer = new ArrayBuffer(input.byteLength);
  new Uint8Array(ownedBuffer).set(input);
  return new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256', ownedBuffer));
}

export function concatenateBytes(...parts: readonly Uint8Array[]): Uint8Array {
  const output = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
  let offset = 0;
  for (const part of parts) {
    output.set(part, offset);
    offset += part.length;
  }
  return output;
}

export function unsignedBigEndian(input: Uint8Array): bigint {
  let result = 0n;
  for (const byte of input) result = (result << 8n) | BigInt(byte);
  return result;
}
