import { useEffect } from "react";

// Libs, Stores and Utils
import { db } from "@/lib/db";
import { useCryptoStore } from "@/stores/crypto.store";
import { importPublicKey, importPrivateKey, deriveSharedAesKey } from "@/utils/e2ee";


type UsernameConv = {
    conversationId: string | null;
    meta: {
        avatar: string;
        createdAt: string;
        messageTtl: string;
        name: string;
        owner: string;
        type: string;
    } | null;
    targetUser: User;
    publicKey: PubicKey;
};

export const useSetupChatEncryption = (convData: UsernameConv | undefined) => {

    const { getSessionKey, setSessionKey } = useCryptoStore();

    useEffect(() => {
        if (!convData) return;

        const setupEncryption = async () => {
            try {
                // Determine the Routing Key
                const lookupKey = convData.conversationId || convData.targetUser._id;

                // Check if the active AES key is already in (Zustand)
                if (getSessionKey(lookupKey)) {
                    return;
                }

                // Fetch Private Key from Dexie
                const myIdentity = await db.identity.get("me");
                if (!myIdentity) throw new Error("Local identity not found. Please sync your security keys.");

                // Import the keys into the Web Crypto engine
                const activePrivateKey = await importPrivateKey(myIdentity.privateKeyJwk);

                // Cast to JsonWebKey because Web Crypto expects standard JWK format
                const activePublicKey = await importPublicKey(convData.publicKey as JsonWebKey);

                // Derive the Shared AES-GCM Session Key
                const sharedAesKey = await deriveSharedAesKey(activePrivateKey, activePublicKey);

                // Save the derived AES key to Zustand RAM!
                setSessionKey(lookupKey, sharedAesKey);

                console.log(`Encryption ready for ${lookupKey}`);
            } catch (error) {
                console.error("Failed to setup chat encryption:", error);
            }
        };

        setupEncryption();
    }, [convData, getSessionKey, setSessionKey]);
};