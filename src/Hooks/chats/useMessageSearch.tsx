import { useState, useCallback } from "react";

// Libs & Stores
import { db } from "@/lib/db";
import { useCryptoStore } from "@/stores/crypto.store";
import { decrypt } from "@/utils/chat/encrytion";

export type SearchResult = Message & {
    decryptedContent: string;
};

export const useMessageSearch = (conversationId: string | null) => {
    const getSessionKey = useCryptoStore((state) => state.getSessionKey);

    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);

    const searchMessages = useCallback(async (searchTerm: string) => {

        if (!conversationId || !searchTerm.trim()) {
            setSearchResults([]);
            return;
        }

        const key = getSessionKey(conversationId);
        if (!key) return;

        setIsSearching(true);
        const term = searchTerm.toLowerCase();

        try {
            // Fetch all encrypted messages for this chat from local DB
            const messages = await db.messages
                .where('conversationId')
                .equals(conversationId)
                .toArray();

            const matched: SearchResult[] = [];

            // Decrypt and evaluate in parallel for speed
            await Promise.all(
                messages.map(async (msg) => {
                    try {
                        const decryptedString = await decrypt(msg.ciphertext, msg.iv, msg.tag, key);
                        const payload = JSON.parse(decryptedString);

                        if (payload.content && payload.content.toLowerCase().includes(term)) {
                            matched.push({
                                ...msg,
                                decryptedContent: payload.content
                            });
                        }
                    } catch {
                        // Skip messages that fail to decrypt
                    }
                })
            );

            // Sort chronologically (newest matches first)
            matched.sort((a, b) => b.createdAt - a.createdAt);

            setSearchResults(matched);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setIsSearching(false);
        }
    }, [conversationId, getSessionKey]);

    const clearSearch = () => {
        setSearchResults([]);
    };

    return {
        searchMessages,
        searchResults,
        isSearching,
        clearSearch
    };
};