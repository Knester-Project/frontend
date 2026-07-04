import { motion } from "framer-motion";
import type { ComponentType, SVGProps } from "react";

// Utils and Stores
import { cn } from "@/lib/utils";
import { dateConverter, formatAgeCategorized } from "@/utils/format";
import { useProfileTheme } from "@/stores/profileTheme.store";

// Icons
import { Sms, Lock, MessageRemove, Flag, Slash, Calendar1, Calendar, GlobalSearch } from "iconsax-reactjs";

export type IconComponent = ComponentType<SVGProps<SVGSVGElement>>;

type AccountProps = {
    isEmailVerified: boolean;
    profileLock: boolean;
    chatLock: boolean;
    discoverable: boolean;
    flagged: boolean;
    isSuspended: boolean;
    referralPrivilege: number;
    isOwner: boolean;
    dateOfBirth: string;
    email: string;
    createdAt: string;
};

type StatusItemProps = {
    label: string;
    value: boolean;
    Icon: IconComponent;
    activeColor: string;
};

function StatusItem({ label, value, Icon, activeColor }: StatusItemProps) {
    return (
        <div className="flex items-center gap-2.5">
            <div className={cn("flex justify-center items-center rounded-lg size-8", value ? "bg-accent/20" : "bg-accent/10")}>
                <Icon className={cn("size-4 md:size-4.5 xl:size-5", value ? activeColor : "text-[#6B7280]")} />
            </div>

            <div>
                <p className="font-medium text-xs">{label}</p>
                <p className={cn("font-medium text-[10px] md:text-[11px] xl:text-xs", value ? activeColor : "text-[#6B7280]")}>
                    {value ? "Active" : "Inactive"}
                </p>
            </div>
        </div>
    );
}

type InfoItemProps = {
    label: string;
    value: string;
    Icon: IconComponent;
    active: boolean;
    activeBgClass: string;
    inactiveBgClass: string;
    activeTextClass: string;
};

function InfoItem({
    label,
    value,
    Icon,
    active,
    activeBgClass,
    inactiveBgClass,
    activeTextClass,
}: InfoItemProps) {

    const textClass = active ? activeTextClass : "text-slate-500 dark:text-slate-400";

    return (
        <div className="flex items-center gap-2.5">
            <div className={cn("flex justify-center items-center rounded-lg size-8", active ? activeBgClass : inactiveBgClass)}>
                <Icon className={cn("size-4 md:size-4.5 xl:size-5", active ? activeTextClass : "text-slate-400 dark:text-slate-500")} />
            </div>

            <div>
                <p className="font-medium text-xs">{label}</p>
                <p className={cn("font-medium text-[10px] md:text-[11px] xl:text-xs montserrat", textClass)}>
                    {value}
                </p>
            </div>
        </div>
    );
}

export default function AccountStatus(props: AccountProps) {

    const { isEmailVerified, profileLock, chatLock, flagged, isSuspended, discoverable,
        referralPrivilege, isOwner, dateOfBirth, email, createdAt } = props;

    const { colors } = useProfileTheme();

    const statusItems = [
        { label: "Email Verified", value: isEmailVerified, Icon: Sms, color: "text-emerald-500" },
        { label: "Profile Lock", value: profileLock, Icon: Lock, color: "text-amber-500" },
        { label: "Chat Lock", value: chatLock, Icon: MessageRemove, color: "text-amber-500" },
        { label: "Flagged", value: flagged, Icon: Flag, color: "text-red-500" },
        { label: "Suspended", value: isSuspended, Icon: Slash, color: "text-red-500" },
        { label: "Discoverable", value: discoverable, Icon: GlobalSearch, color: "text-fuchsia-500" },
    ];

    const hasDOB = Boolean(dateOfBirth.trim());
    const hasEmail = Boolean(email && email.trim());
    const hasCreatedAt = Boolean(createdAt);

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-4">
            <div className="bg-card p-4 sm:p-5 border border-border/60 rounded-2xl">
                <div className="gap-4 grid grid-cols-2 md:grid-cols-3">
                    {statusItems.map((item) => (
                        <StatusItem key={item.label} label={item.label} value={item.value} Icon={item.Icon} activeColor={item.color} />
                    ))}

                    {isOwner && (
                        <div className="flex items-center gap-2.5">
                            <div className="flex justify-center items-center bg-primary/10 rounded-lg size-8">
                                <span className="font-bold text-primary text-base md:text-lg xl:text-xl">
                                    {referralPrivilege}
                                </span>
                            </div>
                            <div>
                                <p className="font-medium text-xs">Referrals</p>
                                <p className="text-[#6B7280] text-[10px] md:text-[11px] xl:text-xs">
                                    Privilege level
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Age */}
                    <div className="flex items-center gap-2.5">
                        <div style={{ backgroundColor: hasDOB ? `${colors.primary}40` : `${colors.primary}20` }}
                            className="flex justify-center items-center rounded-lg size-8">
                            <Calendar1 style={{ color: hasDOB ? colors.primary : "#6B7280" }} className="size-4 md:size-4.5 xl:size-5" />
                        </div>
                        <div>
                            <p className="font-medium text-xs">Age Range</p>
                            <p style={{ color: hasDOB ? colors.primary : "#6B7280" }} className="font-medium text-[10px] md:text-[11px] xl:text-xs montserrat">
                                {hasDOB ? formatAgeCategorized(dateOfBirth) : "No Age Yet ⏳"}
                            </p>
                        </div>
                    </div>

                    {/* Email */}
                    <InfoItem label="Email Address" value={hasEmail ? email : "No Email Yet ⏳"} Icon={Sms}
                        active={hasEmail} activeBgClass="bg-emerald-50 dark:bg-emerald-900/20" activeTextClass="text-emerald-500"
                        inactiveBgClass="bg-slate-50 dark:bg-slate-800/20" />

                    {/* Created At */}
                    <InfoItem label="Joined Date" value={hasCreatedAt ? dateConverter(createdAt) : "Unknown"}
                        Icon={Calendar} active={hasCreatedAt} activeTextClass="text-violet-500"
                        activeBgClass="bg-violet-100 dark:bg-violet-900/30"
                        inactiveBgClass="bg-slate-100 dark:bg-slate-800/30" />
                </div>
            </div>
        </motion.div>
    );
}