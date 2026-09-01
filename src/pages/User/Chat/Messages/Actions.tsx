import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { sileo } from "sileo";
import { Route } from "@/routes/_dashboard/messages";

// Utils and Services
import { cn } from "@/lib/utils";
import { useChatRelationshipActions } from "@/services/userMutations";

// UIs
import { ReportDialog } from "../../Profile/ReportDialog";
import MetaForm from "@/features/messages/MetaForm";
import Confirmation from "@/features/messages/Confirmation";

// Icons
import { Edit2, Flag, MessageRemove, Lock, SearchNormal, Slash, TagUser, Trash, type Icon, ImportCircle, ExportCircle } from "iconsax-reactjs";

type ActionProps = {
    conversationId: string | null;
    inCircle: boolean;
    hasReported: boolean;
    blockedByMe: boolean;
    blockedMe: boolean;
    profilePicture: string;
    meta: Omit<Meta, "createdAt" | "owner">;
    onClose: () => void;
    isPrivate: boolean;
    toggleSearch: () => void;
}

const Actions = ({ conversationId, inCircle, hasReported, blockedByMe, blockedMe, profilePicture, meta, onClose, isPrivate, toggleSearch }: ActionProps) => {

    const { username: searchUsername } = Route.useSearch();
    const username = searchUsername || "";
    const navigate = useNavigate();
    const [showMetaForm, setShowMetaForm] = useState<boolean>(false);
    const [confirmation, setConfirmation] = useState<"clear" | "delete" | null>(null);
    const { toggleCircle, toggleBlock, report } = useChatRelationshipActions(username);


    // Functions
    const onViewProfile = () => navigate({ to: "/profile", search: { profile: username } })
    const handleHasReported = () => sileo.warning({ title: "You have already reported this user, kindly wait as we process the report." })
    const toggleForm = () => setShowMetaForm((prev) => !prev);
    const toggleConfirmation = (value: "clear" | "delete") => setConfirmation(value);
    const closeConfirmation = () => setConfirmation(null);

    const safeActions = [
        { label: "View profile", Icon: TagUser, onClick: onViewProfile, hint: username },
        { label: "Search in chat", Icon: SearchNormal, onClick: toggleSearch },
        { label: "Customize chat", Icon: Edit2, onClick: toggleForm },
        { label: inCircle ? "Leave circle" : "Join circle", Icon: inCircle ? ExportCircle : ImportCircle, onClick: () => toggleCircle.mutate(inCircle) },
    ];

    const destructiveActions = [
        { label: blockedMe ? "You're Blocked, return the favour" : blockedByMe ? "Already Blocked" : "Block user", Icon: Slash, onClick: () => toggleBlock.mutate(blockedByMe), tone: "warn" },
        { label: "Clear chat", Icon: MessageRemove, onClick: () => toggleConfirmation("clear"), tone: "danger" },
        { label: "Delete conversation", Icon: Trash, onClick: () => toggleConfirmation("delete"), tone: "danger" },
    ];

    const metaHeaderProps = {
        conversationId,
        isPrivate,
        meta,
        onClose,
    }

    return (
        <>
            {showMetaForm ?
                <MetaForm {...metaHeaderProps} /> :
                confirmation !== null ? <Confirmation type={confirmation} conversationId={conversationId} onClose={closeConfirmation} /> :
                    <main>
                        <section className="flex items-center gap-x-2">
                            <img
                                src={profilePicture}
                                alt={username}
                                className="ring-border rounded-full ring-2 size-8 md:size-9 xl:size-10 object-cover"
                            />
                            <div className="smallText">
                                <p className="font-semibold">
                                    {username}
                                </p>
                                <p className="text-muted-foreground">
                                    {inCircle ? "In their circle" : "Outside their circle"}
                                </p>
                            </div>
                        </section>
                        <section className="space-y-2">
                            <div className="my-4">
                                {safeActions.map((a) => (
                                    <SheetRow key={a.label} {...a} />
                                ))}
                            </div>

                            {/* Report with Dialog */}
                            <ReportDialog isLoading={report.isPending} username={username} blockedByMe={blockedByMe}
                                onReport={(reason, blockedByMe) => report.mutate({ reason, shouldBlock: blockedByMe })}
                                trigger={
                                    <button
                                        disabled={hasReported}
                                        onClick={() => hasReported && handleHasReported()}
                                        className={cn("flex items-center gap-3 hover:bg-primary/10 px-3 py-3 rounded-2xl w-full font-medium text-primary transition-colors cursor-pointer")}
                                    >
                                        {hasReported ? <Flag className="flex-shrink-0 size-5 md:size-5.5 xl:size-6" /> :
                                            <Lock className="flex-shrink-0 size-5 md:size-5.5 xl:size-6" />
                                        }
                                        <span className="flex-1 text-left">{hasReported ? "Already Reported" : "Report user"}</span>
                                    </button>
                                } />
                            <div className="-mt-2">
                                {destructiveActions.map((a) => (
                                    <SheetRow key={a.label} {...a} />
                                ))}
                            </div>
                        </section>
                    </main>
            }
            <p onClick={showMetaForm ? toggleForm : confirmation ? closeConfirmation : onClose} className="my-4 font-bold text-destructive/70 hover:text-destructive text-center duration-200 cursor-pointer">
                {showMetaForm || confirmation ? "Go back" : "Close"}
            </p>
        </>
    );
}

export default Actions;

type SheetProps = {
    label: string;
    Icon: Icon,
    onClick: () => void | Promise<void>;
    hint?: string;
    tone?: string;
}

function SheetRow({ label, Icon, onClick, hint, tone }: SheetProps) {

    const toneClass = tone === "warn"
        ? "text-primary hover:bg-primary/10"
        : tone === "danger"
            ? "text-destructive hover:bg-destructive/10"
            : "text-foreground hover:bg-muted";

    return (
        <button
            onClick={onClick}
            className={cn("flex items-center gap-3 px-3 py-3 rounded-2xl w-full font-medium transition-colors cursor-pointer", toneClass)}
        >
            <Icon className="flex-shrink-0 size-5 md:size-5.5 xl:size-6" />
            <span className="flex-1 text-left">{label}</span>
            {hint && <span className="text-[11px] text-muted-foreground md:text-xs xl:text-sm truncate">{hint}</span>}
        </button>
    );
}