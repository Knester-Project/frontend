import { type ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { sileo } from "sileo";

// Utils / Services
import { cn } from "@/lib/utils";
import { searchFn } from "@/services/api.services";
import { makeFilesUnique } from "@/utils/format";
import { usePresignedUpload } from "@/Hooks/usePresignedUpload";

// Hooks
import { useNewGroup } from "@/services/userMutations";

// Store
import { meStore } from "@/stores/me.store";

// UI
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyHint } from "./New";

// Icons
import { AddCircle, CloseCircle, CloseSquare, GalleryAdd, Global, Lock, SearchNormal, Slash, TickCircle, Verify } from "iconsax-reactjs";
import { Loader2 } from "lucide-react";


const MAX_GROUP_MEMBERS = 100;
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

type GroupType = "public" | "private";

const NewGroup = ({ onClose }: { onClose: () => void; }) => {

    const inputRef = useRef<HTMLInputElement | null>(null);
    const imageInputRef = useRef<HTMLInputElement | null>(null);

    const { user } = meStore();
    const me: User = {
        isPremium: Boolean(user?.isPremium),
        isCore: Boolean(user?.isCore),
        isModerator: Boolean(user?.isModerator),
        isSuspended: Boolean(user?.isSuspended),
        profile: {
            profilePicture: user?.profile?.profilePicture ?? "",
            profileLock: Boolean(user?.profile?.profileLock),
            lastSeen: user?.profile?.lastSeen ?? "",
            isOnline: Boolean(user?.profile?.isOnline),
            chatLock: Boolean(user?.profile?.chatLock),
        },
        username: user?.username ?? "",
        _id: user?._id ?? "",
    };

    const newGroupMutation = useNewGroup();

    const [query, setQuery] = useState<string>("");
    const [results, setResults] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

    const [groupName, setGroupName] = useState<string>("");
    const [groupType, setGroupType] = useState<GroupType>("public");

    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>("");
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const { uploadFiles } = usePresignedUpload();

    // Debounced username search.
    useEffect(() => {
        const trimmedQuery = query.trim();

        if (trimmedQuery.length < 2) {
            setResults([]);
            setLoading(false);
            return;
        }

        let cancelled = false;

        const timeout = window.setTimeout(async () => {
            try {
                setLoading(true);

                const response = await searchFn(trimmedQuery);
                const data: User[] = response?.data;

                if (!cancelled) {
                    setResults(
                        Array.isArray(data)
                            ? data.filter(
                                (foundUser) =>
                                    foundUser._id !== user?._id &&
                                    !foundUser.isSuspended
                            )
                            : []
                    );
                }
            } catch {
                if (!cancelled) {
                    setResults([]);
                    sileo.error({
                        title: "Failed to search users",
                        description: "Please try again later.",
                    });
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }, 300);

        return () => {
            cancelled = true;
            clearTimeout(timeout);
        };
    }, [query, user?._id]);

    // Cleanup generated preview URL.
    useEffect(() => {
        return () => {
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [avatarPreview]);


    const totalMembers = selectedUsers.length + 1;
    const membersRemaining = MAX_GROUP_MEMBERS - totalMembers;

    const selectedIds = useMemo(
        () => new Set(selectedUsers.map((selectedUser) => selectedUser._id)),
        [selectedUsers]
    );

    const canAddMoreUsers = totalMembers < MAX_GROUP_MEMBERS;

    const canCreate =
        Boolean(user?._id) &&
        groupName.trim().length > 0 &&
        selectedUsers.length > 0 &&
        !newGroupMutation.isPending

    // Toggle a user in/out of the selected collection.
    const toggleUser = (selectedUser: User) => {
        if (selectedUser.isSuspended) {
            return;
        }

        const alreadySelected = selectedIds.has(selectedUser._id);

        if (alreadySelected) {
            setSelectedUsers((current) =>
                current.filter(
                    (item) => item._id !== selectedUser._id
                )
            );
            return;
        }

        if (!canAddMoreUsers) {
            sileo.warning({
                title: "Group limit reached",
                description: `A group can have a maximum of ${MAX_GROUP_MEMBERS} members.`,
            });
            return;
        }

        setSelectedUsers((current) => [
            ...current,
            selectedUser,
        ]);
    };

    // Remove a selected user.
    const removeSelectedUser = (userId: string) => {
        setSelectedUsers((current) =>
            current.filter((item) => item._id !== userId)
        );
    };

    // Avatar selection.
    const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {

        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            sileo.error({
                title: "Invalid image",
                description: "Please select a valid image file.",
            });
            return;
        }

        if (file.size > MAX_IMAGE_SIZE) {
            sileo.error({
                title: "Image is too large",
                description: "Group images must be 10 MB or smaller.",
            });
            return;
        }

        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
        }

        const previewUrl = URL.createObjectURL(file);

        setAvatarFile(file);
        setAvatarPreview(previewUrl);

        setAvatarUrl("");
    };

    // Remove selected group avatar.
    const removeAvatar = () => {
        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
        }

        setAvatarFile(null);
        setAvatarPreview("");
        setAvatarUrl("");
    };

    // Create the group.
    const handleCreateGroup = async () => {
        const trimmedName = groupName.trim();

        if (!user?._id) {
            sileo.error({
                title: "Unable to create group",
                description: "Your account could not be identified.",
            });
            return;
        }

        if (!trimmedName) {
            sileo.error({
                title: "Group name required",
                description: "Enter a name for your group.",
            });
            return;
        }

        if (selectedUsers.length === 0) {
            sileo.error({
                title: "Add members",
                description: "Select at least one user for the group.",
            });

            return;
        }

        if (totalMembers > MAX_GROUP_MEMBERS) {
            sileo.error({
                title: "Too many members",
                description: `A group can have a maximum of ${MAX_GROUP_MEMBERS} members.`,
            });
            return;
        }

        try {
            let uploadedAvatarUrl = avatarUrl;

            // Upload only when a new image has been selected.
            if (avatarFile && !uploadedAvatarUrl) {
                const uniqueFiles = makeFilesUnique([avatarFile]);

                // Pass the unique files to your upload service
                const uploads = await uploadFiles(uniqueFiles, "post");

                const failedUpload = uploads.some(u => !u.uploadUrl);
                if (failedUpload) {
                    throw new Error("Upload failed");
                }

                uploadedAvatarUrl = uploads[0]?.publicUrl;
            }

            const payload: NewGroupPayload = {
                members: selectedUsers.map(
                    (selectedUser) => selectedUser._id
                ),
                type: groupType,
                owner: user._id,
                name: trimmedName,
                avatar: uploadedAvatarUrl || "",
                isFeed: false,
            };

            await newGroupMutation.mutateAsync(payload);
            sileo.success({
                title: "Group created",
                description: `${trimmedName} has been created successfully.`,
            });
            onClose();
        } catch (error) {
            console.error("Failed to create group", error);
            sileo.error({
                title: "Failed to create group",
                description: "Please try again later.",
            });
        }
    };

    return (
        <main className="flex flex-col h-full">
            {/* Header */}
            <header className="pb-4 border-border border-b">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="font-display font-bold text-base md:text-lg xl:text-xl">
                            Create group
                        </h2>
                        <p className="mt-0.5 text-muted-foreground smallText">
                            Create a group and add people to it.
                        </p>
                    </div>

                    <button type="button" onClick={onClose}
                        className="hover:bg-destructive/10 p-1.5 rounded-full text-muted-foreground hover:text-destructive duration-200 cursor-pointer" aria-label="Close">
                        <CloseSquare className="size-4 md:size-4.5 xl:size-5" />
                    </button>
                </div>
            </header>

            {/* Group information */}
            <section className="space-y-4 py-4">
                <div className="flex items-center gap-4">
                    {/* Group avatar */}
                    <div className="relative flex-shrink-0">
                        <Avatar className="size-14 md:size-15 xl:size-16">
                            <AvatarImage src={avatarPreview.trim()} alt="Group avatar preview" />
                            <AvatarFallback className="bg-primary/10 text-primary">
                                <GalleryAdd className="size-6 md:size-6.5 xl:size-7" />
                            </AvatarFallback>
                        </Avatar>

                        <button type="button" onClick={() => imageInputRef.current?.click()}
                            className="right-0 bottom-0 absolute flex justify-center items-center bg-primary rounded-full size-6 text-primary-foreground cursor-pointer"
                            aria-label="Choose group picture">
                            <AddCircle variant="Bold" className="size-4 md:size-4.5 xl:size-5" />
                        </button>

                        {avatarPreview && (
                            <button type="button" onClick={removeAvatar}
                                className="top-0 right-0 absolute flex justify-center items-center bg-card border border-border rounded-full size-5 text-destructive cursor-pointer"
                                aria-label="Remove group picture"
                            >
                                <CloseCircle className="size-4 md:size-4.5 xl:size-5" />
                            </button>
                        )}

                        <input ref={imageInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                    </div>

                    {/* Name */}
                    <div className="flex-1">
                        <label htmlFor="group-name" className="block mb-1.5 font-medium smallText">
                            Group name
                        </label>

                        <input id="group-name" value={groupName}
                            onChange={(event) => setGroupName(event.target.value)}
                            maxLength={100} placeholder="e.g. Weekend squad"
                            className="px-3 py-2.5 border border-border focus:border-primary/20 rounded-md outline-none focus:ring-2 focus:ring-primary/20 w-full transition-all smallText"
                        />

                        <div className="flex justify-between mt-1 text-muted-foreground">
                            <span className="text-[10px] md:text-[11px] xl:text-xs">
                                Required
                            </span>
                            <span className="text-[10px] md:text-[11px] xl:text-xs">
                                {groupName.length}/100
                            </span>
                        </div>
                    </div>
                </div>

                {avatarFile && (
                    <div className="flex justify-between items-center bg-muted/40 px-3 py-2 rounded-md">
                        <div className="min-w-0">
                            <p className="font-medium text-[10px] md:text-[11px] xl:text-xs truncate">
                                {avatarFile.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground md:text-[11px] xl:text-xs montserrat">
                                {(avatarFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                        <span className="text-[10px] text-muted-foreground md:text-[11px] xl:text-xs">
                            Max 10 MB
                        </span>
                    </div>
                )}

                {/* Group visibility */}
                <div>
                    <p className="mb-2 font-medium smallText">
                        Group visibility
                    </p>

                    <div className="gap-2 grid grid-cols-2">
                        <GroupTypeButton
                            active={groupType === "public"}
                            icon={<Global className="size-3.5 md:size-3.75 xl:size-4" />}
                            title="Public"
                            description="Anyone can discover it."
                            onClick={() => setGroupType("public")}
                        />

                        <GroupTypeButton
                            active={groupType === "private"}
                            icon={<Lock className="size-3.5 md:size-3.75 xl:size-4" />}
                            title="Private"
                            description="Only invited members."
                            onClick={() => setGroupType("private")}
                        />
                    </div>
                </div>
            </section>

            {/* Selected users */}
            <section className="pb-3">
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                        <p className="font-semibold smallText">
                            Members
                        </p>
                        <span className={cn(
                            "px-2 py-0.5 rounded-full font-semibold text-[10px] md:text-[11px] xl:text-xs",
                            membersRemaining === 0
                                ? "bg-destructive/10 text-destructive"
                                : "bg-primary/10 text-primary"
                        )}
                        >
                            {totalMembers}/{MAX_GROUP_MEMBERS}
                        </span>
                    </div>

                    <p className="text-[10px] text-muted-foreground md:text-[11px] xl:text-xs">
                        You are the owner
                    </p>
                </div>

                {selectedUsers.length > 0 ? (
                    <div className="flex gap-2 pb-1 overflow-x-auto scrollbar-none">
                        {/* Owner */}
                        {user && (
                            <SelectedUserChip user={me} owner />
                        )}

                        {selectedUsers.map((selectedUser) => (
                            <SelectedUserChip
                                key={selectedUser._id}
                                user={selectedUser}
                                onRemove={() => removeSelectedUser(selectedUser._id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center gap-2 bg-muted/30 px-3 py-3 rounded-md text-muted-foreground">
                        <AddCircle className="size-4" />
                        <p className="text-[10px] md:text-[11px] xl:text-xs">
                            Add at least one person to create the group.
                        </p>
                    </div>
                )}
            </section>

            {/* Search */}
            <section className="flex flex-col flex-1 min-h-0">
                <div className="relative mb-2">
                    <SearchNormal className="top-1/2 left-3 absolute size-4 text-muted-foreground -translate-y-1/2" />

                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search by username…"
                        className="py-3 pr-10 pl-10 border border-border focus:border-primary/20 rounded-md outline-none focus:ring-2 focus:ring-primary/20 w-full placeholder:text-muted-foreground transition-all smallText"
                        aria-label="Search username"
                    />

                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            aria-label="Clear search"
                            className="top-1/2 right-3 absolute text-muted-foreground hover:text-destructive -translate-y-1/2 cursor-pointer"
                        >
                            <CloseSquare className="size-4 md:size-4.5 xl:size-5" />
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto">
                    {query.trim().length < 2 ? (
                        <EmptyHint text="Type at least 2 characters to find people." />
                    ) : loading ? (
                        <div className="flex justify-center items-center gap-2 py-10 text-muted-foreground">
                            <Loader2 className="size-4 md:size-4.5 xl:size-5 animate-spin" />
                            <span className="smallText">
                                Searching…
                            </span>
                        </div>
                    ) : results.length === 0 ? (
                        <EmptyHint text={`No users found for "${query.trim()}".`} />
                    ) : (
                        <div className="space-y-1.5">
                            {results.map((resultUser) => (
                                <GroupUserRow
                                    key={resultUser._id}
                                    user={resultUser}
                                    selected={selectedIds.has(resultUser._id)}
                                    disabled={!selectedIds.has(resultUser._id) && !canAddMoreUsers}
                                    onClick={() => toggleUser(resultUser)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Footer */}
            <footer className="flex gap-2 mt-3 pt-3 border-border border-t">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={newGroupMutation.isPending}
                    className="flex-1 hover:bg-muted/50 disabled:opacity-50 px-4 py-2.5 border border-border rounded-lg font-medium text-muted-foreground duration-200 cursor-pointer disabled:cursor-not-allowed smallText"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    onClick={handleCreateGroup}
                    disabled={!canCreate}
                    className="flex flex-1 justify-center items-center gap-2 bg-primary hover:bg-primary/90 disabled:hover:bg-primary disabled:opacity-50 px-4 py-2.5 rounded-lg font-medium text-primary-foreground duration-200 cursor-pointer disabled:cursor-not-allowed smallText"
                >
                    {newGroupMutation.isPending ? (
                        <>
                            <Loader2 className="size-4 md:size-4.5 xl:size-5 animate-spin" />
                            <span>
                                Loading...
                            </span>
                        </>
                    ) : (
                        <>
                            <AddCircle className="size-4" />
                            <span>Create group</span>
                        </>
                    )}
                </button>
            </footer>
        </main>
    );
};

export default NewGroup;


type GroupBtnProps = {
    active: boolean;
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}

function GroupTypeButton({ active, icon, title, description, onClick }: GroupBtnProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "flex items-start gap-2.5 p-3 border rounded-xl text-left duration-200 cursor-pointer",
                active ? "bg-primary/10 border-primary/30" : "border-border hover:bg-muted/50")}>
            <div className={cn(
                "flex justify-center items-center mt-0.5 rounded-lg size-7 md:size-7.5 xl:size-8 shrink-0",
                active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            )}>
                {icon}
            </div>

            <div className="min-w-0">
                <p className="font-semibold text-[11px] md:text-xs xl:text-sm">
                    {title}
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground md:text-[11px] md:text-xs leading-relaxed">
                    {description}
                </p>
            </div>

            {active && (
                <TickCircle variant="Bold" className="flex-shrink-0 ml-auto size-3 md:size-3.5 xl:size-4 text-primary" />
            )}
        </button>
    );
}

function SelectedUserChip({ user, owner = false, onRemove }: { user: User; owner?: boolean; onRemove?: () => void }) {
    return (
        <div className={cn(
            "relative flex flex-shrink-0 items-center gap-1.5 p-1 pr-2 border rounded-full",
            owner ? "border-primary/20 bg-primary/5" : "border-border bg-muted/30")}>
            <Avatar className="size-6 md:size-6.5 xl:size-7">
                <AvatarImage src={user.profile?.profilePicture} />
                <AvatarFallback className="bg-primary/10 font-bold text-[9px] text-primary md:text-[10px] xl:text-[11px]">
                    {user.username.slice(0, 2).toUpperCase() || "??"}
                </AvatarFallback>
            </Avatar>

            <div className="max-w-24">
                <p className="font-medium text-[10px] md:text-[11px] xl:text-xs truncate">
                    {user.username}
                </p>
                {owner && (
                    <p className="text-[8px] text-primary md:text-[8.5px] xl:text-[9px]">Owner</p>
                )}
            </div>

            {!owner && onRemove && (
                <button
                    type="button"
                    onClick={onRemove}
                    className="ml-0.5 text-muted-foreground hover:text-destructive cursor-pointer"
                    aria-label={`Remove ${user.username}`}
                >
                    <CloseCircle className="size-3 md:size-3.5 xl:size-4" />
                </button>
            )}
        </div>
    );
}

type GroupUserType = {
    user: User;
    selected: boolean;
    disabled?: boolean;
    onClick: () => void;
}

function GroupUserRow({ user, selected, disabled, onClick }: GroupUserType) {

    const profile = user.profile;

    return (
        <motion.button
            type="button"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            disabled={disabled}
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 p-2 border rounded-2xl w-full text-left duration-200 cursor-pointer",
                selected
                    ? "bg-primary/10 border-primary/25"
                    : "border-primary/10 hover:bg-primary/5",
                disabled &&
                "opacity-40 cursor-not-allowed"
            )}
        >
            <div className="relative flex-shrink-0">
                <Avatar className="size-10 md:size-11 xl:size-12">
                    <AvatarImage src={profile?.profilePicture} alt={user.username} />
                    <AvatarFallback className="bg-primary/10 font-bold text-primary">
                        {user.username
                            .slice(0, 2)
                            .toUpperCase() || "??"}
                    </AvatarFallback>
                </Avatar>

                {profile?.isOnline && !user.isSuspended && (
                    <span className="right-0 bottom-0 absolute bg-green-500 border-2 border-card rounded-full size-3" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                    <p className="font-semibold truncate tracking-wide">
                        {user.username}
                    </p>
                    {user.isPremium && (
                        <Verify variant="Bold" className="flex-shrink-0 size-4 text-premium" />
                    )}

                    {user.isCore && (
                        <Verify variant="Bold" className="flex-shrink-0 size-4 text-core" />
                    )}

                    {user.isModerator && (
                        <Verify variant="Bold" className="flex-shrink-0 size-4 text-moderator" />
                    )}
                </div>

                <p className="text-[10px] text-muted-foreground truncate montserrat">
                    {profile?.isOnline ? "Active now" : profile?.lastSeen ? "Recently active" : "Offline"}
                </p>
            </div>

            <div className="flex-shrink-0">
                {user.isSuspended ? (
                    <Slash className="size-5 text-destructive" />
                ) : selected ? (
                    <TickCircle variant="Bold" className="size-4 md:size-4.5 xl:size-5 text-primary" />
                ) : (
                    <AddCircle className="size-4 md:size-4.5 xl:size-5 text-muted-foreground" />
                )}
            </div>
        </motion.button>
    );
}