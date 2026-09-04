import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";

// Utils and Services
import { cn } from "@/lib/utils";
import { useReferralLink } from "@/services/userQueries";

// UIs
import { Button } from "@/components/ui/button";
import InviteLoader from "./InviteLoader";
import InviteError from "./InviteError";

// Icons
import { Copy, Check, QrCode, Download, Share2, Sparkles } from "lucide-react";


// Apply the interface to your component
export default function Invite() {

    const [expanded, setExpanded] = useState<boolean>(false);
    const [timeLeft, setTimeLeft] = useState<number>(480) // 8 minutes in seconds
    const [copied, setCopied] = useState<boolean>(false);
    const { data, isLoading, isError, refetch } = useReferralLink(expanded);

    
    const referralCode = data?.data?.referralLink;

    const inviteUrl = `https://knester.com?invite=${referralCode}`;

    useEffect(() => {
        if (timeLeft <= 0) return;
        const timerId = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timerId); // Cleanup on unmount
    }, [timeLeft]);

    // Format the remaining time as MM:SS
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

    // Functions
    const handleCopy = async () => {
        await navigator.clipboard.writeText(inviteUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownloadQR = () => {
        const svg = document.getElementById("invite-qr-svg");
        if (!svg) return;
        const serialized = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([serialized], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `Knester-invite.svg`;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="px-4 md:px-6 xl:px-8">
            {/* Trigger button */}
            <motion.button
                onClick={() => setExpanded((v) => !v)}
                whileTap={{ scale: 0.98 }}
                className={cn("group relative border rounded-2xl w-full overflow-hidden transition-all duration-300 cursor-pointer",
                    "border-primary/20 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10",
                    expanded && "border-primary/40 shadow-lg shadow-primary/10"
                )}>

                <div className="relative flex items-center gap-4 px-5 py-4">
                    <div className="flex justify-center items-center bg-primary/15 rounded-xl ring-1 ring-primary/20 size-8 md:size-10 xl:size-12 shrink-0">
                        <QrCode className="size-4 md:size-5 xl:size-6 text-primary" />
                    </div>
                    <div className="flex-1 text-left">
                        <p className="font-semibold smallText">Invite via QR Code</p>
                        <p className="mt-0.5 text-[10px] text-gray-600 md:text-[11px] dark:text-gray-400 xl:text-xs">
                            Share your personal invite link or QR code
                        </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-primary/60" />
                        <span className="font-medium text-[10px] text-primary/70 md:text-[11px] xl:text-xs">
                            {expanded ? "Close" : "Generate"}
                        </span>
                    </div>
                </div>
            </motion.button>

            {/* Expanded panel */}
            <AnimatePresence>
                {(isLoading && !isError && expanded) && <InviteLoader />}
                {(!isLoading && !isError && expanded) && (
                    <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                        exit={{ opacity: 0, height: 0, marginTop: 0 }} transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }} className="overflow-hidden">
                        <div className="bg-card shadow-sm border border-border/60 rounded-2xl overflow-hidden">
                            {/* Header strip */}
                            <div className="flex justify-between items-center bg-gradient-to-r from-primary/8 via-transparent to-accent/10 px-5 py-3.5 border-border/40 border-b">
                                <div>
                                    <p className="font-semibold text-sm">Your Invite Code</p>
                                    <p className="mt-0.5 text-[10px] text-gray-600 md:text-[11px] dark:text-gray-400 xl:text-xs">
                                        Anyone who scans or uses this link joins via your profile
                                    </p>
                                </div>
                            </div>

                            <div className="flex md:flex-row flex-col gap-0 md:divide-x divide-y md:divide-y-0 divide-border/40">
                                {/* QR code section */}
                                <div className="flex flex-col justify-center items-center gap-4 p-6 sm:w-56 shrink-0">
                                    <div className="relative bg-white shadow-md p-3 ring-border/30 rounded-2xl ring-1">
                                        {/* Corner accents */}
                                        <div className="top-0 left-0 absolute border-primary border-t-2 border-l-2 rounded-tl-xl size-4 pointer-events-none" />
                                        <div className="top-0 right-0 absolute border-primary border-t-2 border-r-2 rounded-tr-xl size-4 pointer-events-none" />
                                        <div className="bottom-0 left-0 absolute border-primary border-b-2 border-l-2 rounded-bl-xl size-4 pointer-events-none" />
                                        <div className="right-0 bottom-0 absolute border-primary border-r-2 border-b-2 rounded-br-xl size-4 pointer-events-none" />

                                        <QRCodeSVG id="invite-qr-svg" value={inviteUrl} size={148} bgColor="#ffffff"
                                            fgColor="#1e1b4b" level="H" marginSize={1} />
                                    </div>

                                    <Button variant="ghost" size="sm" onClick={handleDownloadQR}
                                        className="gap-1.5 h-8 text-gray-600 hover:text-foreground dark:text-gray-400 text-xs">
                                        <Download className="size-3.5" />
                                        Save QR
                                    </Button>
                                </div>

                                {/* URL + actions section */}
                                <div className="flex flex-col flex-1 justify-between gap-4 p-3 md:p-4 xl:p-5">
                                    <div>
                                        <p className="mb-2 font-semibold text-[10px] text-gray-600 md:text-[11px] dark:text-gray-400 text-xs uppercase">
                                            Invite Link
                                        </p>
                                        <div className="flex items-center gap-2 px-3 py-2.5 border border-accent/30 rounded-xl">
                                            <p className="flex-1 font-mono text-muted-foreground truncate select-all smallText">
                                                {inviteUrl}
                                            </p>
                                            <motion.button whileTap={{ scale: 0.9 }} onClick={handleCopy} className={cn(
                                                "flex items-center gap-1.5 px-2 py-1.5 rounded-xl transition-all duration-200 smallText shrink-0", copied ? "bg-emerald-500/15 text-emerald-600" : "bg-primary/10 text-primary hover:bg-primary/20"
                                            )}>
                                                <AnimatePresence mode="wait" initial={false}>
                                                    {copied ? (
                                                        <motion.span key="check" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                                            exit={{ scale: 0.6, opacity: 0 }} className="flex items-center gap-1 cursor-pointer">
                                                            <Check className="size-3 md:size-3.5 xl:size-4" /> Copied
                                                        </motion.span>
                                                    ) : (
                                                        <motion.span key="copy" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                                                            exit={{ scale: 0.6, opacity: 0 }} className="flex items-center gap-1 cursor-pointer">
                                                            <Copy className="size-3 md:size-3.5 xl:size-4" /> Copy
                                                        </motion.span>
                                                    )}
                                                </AnimatePresence>
                                            </motion.button>
                                        </div>
                                        <p className="mt-2 font-medium text-[11px] text-destructive md:text-xs animate-pulse montserrat">
                                            ⏳ This referral link will only last for {formattedTime}...
                                        </p>
                                    </div>

                                    {/* Native share (mobile) */}
                                    {typeof navigator !== "undefined" && "share" in navigator && (
                                        <Button variant="outline" size="sm" className="self-start gap-2 w-full text-xs" onClick={() =>
                                            navigator.share({
                                                title: `Join us in Knester`,
                                                text: `Use my invite link to join Knester!`,
                                                url: inviteUrl,
                                            })}>
                                            <Share2 className="size-3.5" />
                                            Share via…
                                        </Button>
                                    )}

                                    <div className="bg-primary/5 mt-auto px-4 py-3 border border-primary/10 rounded-xl">
                                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                                            🔗 Every signup through your link is tracked to your account.
                                            <span className="block font-semibold">DO NOT SHARE AT RANDOM.</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
                {(!isLoading && isError && expanded) && <InviteError onRetry={refetch} />}
            </AnimatePresence>
        </motion.div>
    );
}