// Helpers for Base64 conversion
const toBase64 = (buffer: ArrayBuffer | Uint8Array) => btoa(String.fromCharCode(...new Uint8Array(buffer)));
const fromBase64 = (base64: string) => Uint8Array.from(atob(base64), c => c.charCodeAt(0));

// Encrypts a message using a shared CryptoKey
export async function encrypt(text: string, cryptoKey: CryptoKey) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encodedText = new TextEncoder().encode(text);

    // Web Crypto appends the 16-byte Auth Tag automatically to the end of the ciphertext
    const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        cryptoKey,
        encodedText
    );

    // Split the ciphertext and the tag to match your DB schema
    const encryptedArray = new Uint8Array(encryptedBuffer);
    const ciphertext = encryptedArray.slice(0, -16);
    const tag = encryptedArray.slice(-16);

    return {
        ciphertext: toBase64(ciphertext),
        iv: toBase64(iv),
        tag: toBase64(tag)
    };
}

// Decrypts a message using a shared CryptoKey
export async function decrypt(ciphertext: string, iv: string, tag: string, cryptoKey: CryptoKey): Promise<string> {
    const ivBuffer = fromBase64(iv);
    const ciphertextBuffer = fromBase64(ciphertext);
    const tagBuffer = fromBase64(tag);

    // Recombine the ciphertext and tag for the Web Crypto API
    const combinedBuffer = new Uint8Array(ciphertextBuffer.length + tagBuffer.length);
    combinedBuffer.set(ciphertextBuffer, 0);
    combinedBuffer.set(tagBuffer, ciphertextBuffer.length);

    const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: ivBuffer },
        cryptoKey,
        combinedBuffer
    );

    return new TextDecoder().decode(decryptedBuffer);
}