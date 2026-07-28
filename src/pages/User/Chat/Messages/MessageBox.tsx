import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Stores & Utils
import { useCryptoStore } from '@/stores/crypto.store';
import { meStore } from '@/stores/me.store';
import { decrypt } from '@/utils/encrytion';
import { cn } from '@/lib/utils';
import { detectMediaType } from '@/utils/format';

// UIs
import { MediaGrid } from '@/components/MediaGrid';

// Icons
import { Clock, Check, InfoCircle, Lock1 } from 'iconsax-reactjs';

type ParsedPayload = {
    content: string;
    media: string[];
    replyTo: string | null;
};

const MessageBox = ({ message }: { message: Message }) => {

    const { user } = meStore();
    const getSessionKey = useCryptoStore((state) => state.getSessionKey);

    const [payload, setPayload] = useState<ParsedPayload | null>(null);
    const [error, setError] = useState<boolean>(false);

    const isMe = message.senderId === user?._id;

    useEffect(() => {
        let isMounted = true;

        const decryptContent = async () => {
            try {
                // We use conversationId because our useSendMessage hook saved it as such
                const sessionKey = getSessionKey(message.conversationId);

                if (!sessionKey) {
                    return;
                }

                // Decrypt Message
                const decryptedString = await decrypt(
                    message.ciphertext,
                    message.iv,
                    message.tag,
                    sessionKey
                );

                // Parse the JSON Inner Payload
                const parsed: ParsedPayload = JSON.parse(decryptedString);

                if (isMounted) {
                    setPayload(parsed);
                    setError(false);
                }

            } catch (err) {
                console.error("Decryption failed for message:", message.id, err);
                if (isMounted) setError(true);
            }
        };

        decryptContent();

        return () => {
            isMounted = false;
        };
    }, [message.ciphertext, message.iv, message.tag, message.conversationId, getSessionKey, message.id]);

    // Format Timestamp
    const timeString = new Date(message.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
    });

    const media = payload?.media || []
    const gallery = media.map((url) => ({
        url,
        type: detectMediaType(url),
    }));

    return (
        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
            className={cn("flex mb-3 w-full", isMe ? "justify-end" : "justify-start")}>

            <div className={cn("flex flex-col p-3 rounded-2xl max-w-[75%] md:max-w-[65%]",
                isMe ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-accent/30 text-foreground border border-border rounded-bl-sm")}>

                {/* Error Decrypting */}
                {error && (
                    <div className="flex items-center gap-2 text-[11px] text-destructive/80 md:text-xs xl:text-sm">
                        <Lock1 variant="Bold" className="size-4" />
                        <span className="italic">Failed to decrypt message.</span>
                    </div>
                )}

                {/* Still Decrypting */}
                {!payload && !error && (
                    <div className="flex items-center gap-2 opacity-50">
                        <Lock1 variant="Broken" className="size-4 animate-pulse" />
                        <span className="text-[10px] md:text-[11px] xl:text-xs italic">Decrypting...</span>
                    </div>
                )}

                {/* Successfully Decrypted */}
                {payload && !error && (
                    <div className="flex flex-col gap-2">

                        {/* Render Media */}
                        {payload.media && payload.media.length > 0 && (
                            <MediaGrid media={gallery} />
                        )}

                        {/* Render Text */}
                        {payload.content && (
                            <p className="break-words leading-relaxed whitespace-pre-wrap">
                                {payload.content}
                            </p>
                        )}
                    </div>
                )}

                <div className={cn("flex justify-end items-center gap-1.5 mt-1.5", isMe ? "text-primary-foreground/80" : "text-muted-foreground")}>
                    <span className="font-medium text-[10px] md:text-[11px] xl:text-xs tracking-wide">
                        {timeString}
                    </span>

                    {isMe && (
                        <div className="flex items-center">
                            {message.syncStatus === 'pending' && <Clock className="opacity-70 size-3 md:size-3.5 xl:size-4" />}
                            {message.syncStatus === 'sent' && <Check className="size-3 md:size-3.5 xl:size-4" variant="Outline" />}
                            {message.syncStatus === 'failed' && <InfoCircle className="size-3 md:size-3.5 xl:size-4 text-destructive" variant="Bold" />}
                        </div>
                    )}
                </div>

            </div>
        </motion.div>
    );
};

export default MessageBox;