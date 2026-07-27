import { useState } from 'react';
import { sileo } from "sileo";

// Utilities & DB
import { db } from "@/lib/db";
import { unlockPrivateKey, lockPrivateKey } from "@/utils/vault";
import { useUpdateUser } from "@/services/userMutations";

// UIs
import Button from '@/components/Button';

// Icons
import { Loader2 } from "lucide-react";
import { ShieldSecurity, Key, Danger } from 'iconsax-reactjs';

// Types
type RecoveryMode = "restore" | "sync";

interface SecuritySyncProps {
    mode: RecoveryMode;
    userEncryptedVault?: { vaultData: string; salt: string; iv: string };
}

export default function VaultSync({ mode, userEncryptedVault }: SecuritySyncProps) {

    const [recoveryPhrase, setRecoveryPhrase] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);
    
    const updateUser = useUpdateUser();

    const handleRestore = async () => {
        if (!userEncryptedVault) return sileo.error({ title: "Vault data missing from server." });
        
        try {
            const privateJwk = await unlockPrivateKey(
                userEncryptedVault.vaultData,
                userEncryptedVault.salt,
                userEncryptedVault.iv,
                recoveryPhrase.trim()
            );
            
            // Save to Dexie
            await db.identity.put({
                id: "me",
                privateKeyJwk: privateJwk,
                publicKeyJwk: {} as JsonWebKey
            });

            sileo.success({ title: "Messages unlocked successfully!" });
            
        } catch (error) {
            console.error("Decryption failed:", error);
            sileo.error({ title: "Invalid Recovery Phrase. Please check your spelling and try again." });
        }
    };

    const handleSync = async () => {
        try {
            // Fetch the keys from local storage
            const localKeys = await db.identity.get("me");
            if (!localKeys) throw new Error("Local keys missing.");

            // Lock the private key using the phrase they just entered
            const encryptedVault = await lockPrivateKey(localKeys.privateKeyJwk, recoveryPhrase.trim());

            // Upload both to the backend
            updateUser.mutate({
                publicKey: {
                    crv: localKeys.publicKeyJwk.crv!,
                    ext: localKeys.publicKeyJwk.ext!,
                    key_ops: localKeys.publicKeyJwk.key_ops!,
                    kty: localKeys.publicKeyJwk.kty!,
                    x: localKeys.publicKeyJwk.x!,
                    y: localKeys.publicKeyJwk.y!
                },
                encryptedVault: {
                    vaultData: encryptedVault.vaultData,
                    salt: encryptedVault.salt,
                    iv: encryptedVault.iv
                }
            }, {
                onSuccess: () => {
                    sileo.success({ title: "Security keys synced with server!" });
                },
                onError: () => sileo.error({ title: "Failed to upload keys. Please try again." })
            });

        } catch (error) {
            console.error("Sync failed:", error);
            sileo.error({ title: "An error occurred while securing your keys." });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!recoveryPhrase.trim()) return;

        setIsProcessing(true);
        if (mode === "restore") {
            await handleRestore();
        } else {
            await handleSync();
        }
        setIsProcessing(false);
    };

    return (
        <div className="bg-card shadow-lg mx-auto mt-10 p-6 md:p-8 border border-border rounded-2xl max-w-xl">
            <div className="flex justify-center mb-6">
                <div className="bg-primary/10 p-4 rounded-full">
                    {mode === "restore" ? (
                        <Key className="size-7 md:size-7.5 xl:size-8 text-primary" />
                    ) : (
                        <ShieldSecurity className="size-7 md:size-7.5 xl:size-8 text-amber-500" />
                    )}
                </div>
            </div>

            <div className="mb-8 text-center">
                <h2 className="mb-2 font-bold text-lg md:text-xl xl:text-2xl montserrat">
                    {mode === "restore" ? "Unlock Your Messages" : "Sync Your Security Keys"}
                </h2>
                <p className="text-muted-foreground">
                    {mode === "restore" 
                        ? "You are logging in from a new browser. Enter your recovery phrase to decrypt your chat history." 
                        : "Your security keys haven't been backed up to the server. Enter your recovery phrase to secure them."}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="recoveryPhrase" className="font-medium">
                        Recovery Phrase
                    </label>
                    <textarea
                        id="recoveryPhrase"
                        value={recoveryPhrase}
                        onChange={(e) => setRecoveryPhrase(e.target.value)}
                        className="bg-background p-4 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary w-full duration-300 resize-none"
                        rows={3}
                        placeholder="Enter your multi-word recovery phrase..."
                        required
                    />
                </div>

                {mode === "restore" && (
                    <div className="flex items-start gap-3 bg-amber-50 dark:bg-amber-500/10 p-4 border border-amber-200 dark:border-amber-500/20 rounded-xl">
                        <Danger className="flex-shrink-0 mt-0.5 size-4 md:size-4.5 xl:size-5 text-amber-600 dark:text-amber-500" />
                        <p className="text-[11px] text-amber-800 dark:text-amber-200 md:text-xs xl:text-sm">
                            If you have lost your recovery phrase, your previous messages cannot be restored.
                        </p>
                    </div>
                )}

                <Button 
                    text={mode === "restore" ? "Decrypt Messages" : "Sync Keys"} 
                    disabled={isProcessing || !recoveryPhrase} 
                    loading={isProcessing} 
                    icon={isProcessing ? <Loader2 className="animate-spin" /> : <ShieldSecurity />} 
                    variant='primary' 
                />
            </form>
        </div>
    );
}