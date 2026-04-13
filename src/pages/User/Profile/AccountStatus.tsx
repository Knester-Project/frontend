import { motion } from "framer-motion";

// Utils
import { cn } from "@/lib/utils";
import { formatAgeCategorized } from "@/utils/format";

// Icons
import { Sms, Lock, MessageRemove, Flag, Slash, Calendar1 } from "iconsax-reactjs";

type accountProps = {
    isEmailVerified: boolean;
    profileLock: boolean;
    chatLock: boolean;
    flagged: boolean;
    isSuspended: boolean;
    referralPrivilege: number;
    isOwner: boolean;
    dateOfBirth: string;
}

export default function AccountStatus({ isEmailVerified, profileLock, chatLock, flagged, isSuspended, referralPrivilege, isOwner, dateOfBirth }: accountProps) {

    const items = [
        {
            label: "Email Verified",
            value: isEmailVerified,
            icon: Sms,
            activeColor: "text-emerald-500",
        },
        {
            label: "Profile Lock",
            value: profileLock,
            icon: Lock,
            activeColor: "text-amber-500",
        },
        {
            label: "Chat Lock",
            value: chatLock,
            icon: MessageRemove,
            activeColor: "text-amber-500",
        },
        {
            label: "Flagged",
            value: flagged,
            icon: Flag,
            activeColor: "text-red-500",
        },
        {
            label: "Suspended",
            value: isSuspended,
            icon: Slash,
            activeColor: "text-red-500",
        },
    ];

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-4">

            <div className="bg-card p-4 sm:p-5 border border-border/60 rounded-2xl">
                <div className="gap-4 grid grid-cols-2 md:grid-cols-3">
                    {items.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div key={`item.label-${index}`} className="flex items-center gap-2.5">
                                <div className={cn("flex justify-center items-center rounded-lg size-8",
                                    item.value ? "bg-accent/20" : "bg-accent/10")}>
                                    <Icon className={cn(
                                        "size-4 md:size-4.5 xl:size-5",
                                        item.value ? item.activeColor : "text-[#6B7280]"
                                    )} />
                                </div>
                                <div>
                                    <p className="font-medium text-xs">{item.label}</p>
                                    <p className={cn("font-medium text-[10px] md:text-[11px] xl:text-xs",
                                        item.value ? item.activeColor : "text-[#6B7280]"
                                    )}>
                                        {item.value ? "Active" : "Inactive"}
                                    </p>
                                </div>
                            </div>
                        );
                    })}

                    {/* Referral privilege */}
                    {isOwner &&
                        <div className="flex items-center gap-2.5">
                            <div className="flex justify-center items-center bg-primary/8 rounded-lg size-8">
                                <span className="font-bold text-primary text-base md:text-lg xl:text-xl">{referralPrivilege}</span>
                            </div>
                            <div>
                                <p className="font-medium text-xs">Referrals</p>
                                <p className="font-medium text-[#6B7280] text-[10px] md:text-[11px] xl:text-xs">Privilege level</p>
                            </div>
                        </div>
                    }
                    <div className="flex items-center gap-2.5">
                        <div className={cn("flex justify-center items-center rounded-lg size-8", dateOfBirth.trim() ? "bg-accent/20" : "bg-accent/10")}>
                            <Calendar1 className={cn("size-4 md:size-4.5 xl:size-5", dateOfBirth.trim() ? "text-accent" : "text-[#6B7280]")} />
                        </div>
                        <div>
                            <p className="font-medium text-xs">Age Range</p>
                            <p className={cn("font-medium text-[10px] md:text-[11px] xl:text-xs", dateOfBirth.trim() ? "text-accent" : "text-[#6B7280]")}>
                                {dateOfBirth.trim() ? formatAgeCategorized(dateOfBirth) : "Agelessaurus"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}