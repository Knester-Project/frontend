import crypto from "crypto";

const ALGO = "aes-256-gcm";
const KEY = crypto.randomBytes(32);

// Encrypt Message
export function encrypt(text: string) {
    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv(ALGO, KEY, iv);

    const encrypted = Buffer.concat([
        cipher.update(text, "utf8"),
        cipher.final()
    ]);

    const tag = cipher.getAuthTag();

    return {
        ciphertext: encrypted.toString("base64"),
        iv: iv.toString("base64"),
        tag: tag.toString("base64")
    };
}

// Decrypt Message
export function decrypt(ciphertext: string, iv: string, tag: string) {
    const decipher = crypto.createDecipheriv(
        ALGO,
        KEY,
        Buffer.from(iv, "base64")
    );

    decipher.setAuthTag(Buffer.from(tag, "base64"));

    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(ciphertext, "base64")),
        decipher.final()
    ]);

    return decrypted.toString("utf8");
}