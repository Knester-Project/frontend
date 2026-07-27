import { motion } from "framer-motion";

// UIs
import { Button } from "@/components/ui/button";

// Icons
import { EmojiHappy, MessageText1 } from "iconsax-reactjs";

export default function Empty({ participant }: { participant: User }) {

    const onStart = () => {
        console.log("I have started")
    }
    
    return (
        <div className="flex flex-col flex-1 justify-center items-center px-4 md:px-6 xl:px-8 text-center">
            <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }} className="relative">
                {/* Glow */}
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150" />
                {/* Avatar */}
                <div className="relative shadow-sm rounded-full size-16 md:size-18 xl:size-20 overflow-hidden">
                    {participant?.profile?.profilePicture ? (
                        <img
                            src={participant.profile.profilePicture}
                            alt={participant.username}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex justify-center items-center bg-gradient-to-br from-primary/40 to-primary/10 w-full h-full">
                            <MessageText1 className="size-8 md:size-9 xl:size-10 text-primary" />
                        </div>
                    )}
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mt-6">
                <h2 className="font-display font-bold text-foreground text-sm md:text-base xl:text-lg">
                    {participant?.username ? `Say hi to ${participant.username}` : "Start a conversation"}
                </h2>
                <p className="mx-auto mt-2 max-w-xs text-[11px] text-foreground/70 md:text-xs xl:text-sm leading-relaxed">
                    No messages yet. <br /> Break the ice and send your first message below.
                </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-6">
                <Button onClick={onStart} className="gap-2 shadow shadow-primary/20 rounded-xl">
                    <EmojiHappy variant="Bold" className="size-3 md:size-3.5 xl:size-4" />
                    Say hello 👋
                </Button>
            </motion.div>
        </div>
    );
}