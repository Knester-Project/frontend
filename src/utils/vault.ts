const encoder = new TextEncoder();
const decoder = new TextDecoder();

// Safely handles both ArrayBuffer (from encrypt) and Uint8Array
const toBase64 = (buf: ArrayBuffer | Uint8Array) => {
    const uint8 = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
    return btoa(Array.from(uint8).map(b => String.fromCharCode(b)).join(''));
};

const fromBase64 = (b64: string) => Uint8Array.from(atob(b64), c => c.charCodeAt(0));

// Derives a strong AES key from a human-readable password
async function deriveVaultKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const keyMaterial = await window.crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
    );

    return await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt as BufferSource,
            iterations: 100000,
            hash: "SHA-256"
        } as Pbkdf2Params,
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
    );
}

// Encrypts the Private JWK so it can be safely stored in MongoDB
export async function lockPrivateKey(privateJwk: JsonWebKey, password: string) {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    const vaultKey = await deriveVaultKey(password, salt);
    const stringifiedJwk = JSON.stringify(privateJwk);

    const encryptedBuffer = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv as BufferSource },
        vaultKey,
        encoder.encode(stringifiedJwk)
    );

    return {
        vaultData: toBase64(encryptedBuffer),
        salt: toBase64(salt),
        iv: toBase64(iv)
    };
}

// Decrypts the Vault data back into a Private JWK using the password
export async function unlockPrivateKey(vaultData: string, salt: string, iv: string, password: string): Promise<JsonWebKey> {
    const vaultKey = await deriveVaultKey(password, fromBase64(salt));

    const decryptedBuffer = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv: fromBase64(iv) as BufferSource },
        vaultKey,
        fromBase64(vaultData) as BufferSource
    );

    const decryptedString = decoder.decode(decryptedBuffer);
    return JSON.parse(decryptedString); 
}