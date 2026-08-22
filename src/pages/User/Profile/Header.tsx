import { useRef } from 'react';
import { getPaletteSync } from 'colorthief';
import { Link } from '@tanstack/react-router';

// Utils, Stores and Services
import { formatTrendingCount } from '@/utils/format';
import { useProfileTheme } from '@/stores/profileTheme.store';
import { useRelationshipActions } from '@/services/userMutations';

// UIs
import { Badge } from '@/components/ui/badge';
import { ReportDialog } from './ReportDialog';

// Icons and Images
import { Flag2, MessageText1, Slash, UserAdd, Verify, type IconProps, MedalStar, Crown1, Star1, UserTick } from 'iconsax-reactjs';
import emptyPicture from "/blank.jpg";


const Header = ({ user }: { user: UserDetails }) => {

    const { username, isPremium, isModerator, isCore, circlesJoined, totalPosts, isSuspended, relationship } = user;

    const { profilePicture = "", isOnline = false, bio = "", circleMembers = 0, details = [] } = user?.profile || {}

    const { colors, replaceColors } = useProfileTheme();
    const imgRef = useRef<HTMLImageElement>(null);

    const { toggleCircle, toggleBlock, report } = useRelationshipActions(username);
    const rel = relationship;

    // Functions
    const handleLoad = () => {
        if (imgRef.current) {
            const palette = getPaletteSync(imgRef.current, { colorCount: 3 });
            if (palette && palette.length >= 2) {
                replaceColors({
                    primary: palette[0].css(),
                    secondary: palette[1].css(),
                    isDark: palette[0].isDark
                })
            }
        }
    };

    return (
        <>
            <main className='mx-auto border border-border rounded-3xl max-w-7xl'>

                {/* Profile Header */}
                <section className="relative rounded-3xl h-32 md:h-36 xl:h-40 overflow-hidden"
                    style={{ backgroundColor: colors.primary, transition: 'all 0.8s ease' } as React.CSSProperties}>

                    {/* DUAL COLOR GLOW */}
                    <div className="top-1/2 left-1/2 absolute blur-[60px] w-[200%] h-[200%] transition-opacity -translate-x-1/2 -translate-y-1/2 duration-700 pointer-events-none"
                        style={{
                            background: `
                        radial-gradient(circle at 30% 30%, ${colors.primary} 0%, transparent 60%),
                        radial-gradient(circle at 70% 70%, ${colors.secondary} 0%, transparent 60%) `,
                            opacity: colors.isDark ? 0.4 : 0.2
                        }} />

                    <img ref={imgRef} src={profilePicture || emptyPicture} onLoad={handleLoad} crossOrigin="anonymous" className="hidden" />
                </section>
                <header className='-mt-12 md:-mt-14 xl:-mt-16 px-4'>
                    <div className={`${colors.isDark ? "bg-white border-white" : "bg-[#121212] border-[#121212]"} group relative shadow-lg border rounded-2xl size-20 sm:size-24 md:size-28 xl:size-32 overflow-hidden`}>
                        <img src={profilePicture || emptyPicture} alt={"profile picture"} className="object-cover" />
                        {/* Online Status */}
                        {isOnline && (
                            <div className="right-2 bottom-2 absolute bg-green-500 rounded-full size-3 md:size-3.5 xl:size-4" />
                        )}
                    </div>
                </header>

                {/* User Details */}
                <section className='mt-2 p-2 md:p-3 xl:p-4'>
                    <div className="flex items-center gap-x-1">
                        <h1 className='font-bold text-xl md:text-2xl xl:text-3xl'>{username}</h1>
                        {isPremium && <Verify className='size-5 md:size-6 xl:size-7 text-premium' variant='Bold' />}
                        {isModerator && <Verify className='size-5 md:size-6 xl:size-7 text-moderator' variant='Bold' />}
                        {isCore && <Verify className='size-5 md:size-6 xl:size-7 text-core' variant='Bold' />}
                    </div>
                    <div className='flex gap-x-1'>
                        {isCore && <Badge className="bg-core/10 mt-2 border-core text-core"><MedalStar variant="Bold" /> Core Member</Badge>}
                        {isPremium && <Badge className="bg-premium/10 mt-2 border-premium text-premium"><Crown1 variant="Bold" /> Premium Member</Badge>}
                        {isModerator && <Badge className="bg-moderator/10 mt-2 border-moderator text-moderator"><Star1 variant="Bold" /> Moderator</Badge>}
                        {isSuspended &&
                            <Badge variant="destructive" className='mt-2'>
                                <Slash /> Suspended
                            </Badge>
                        }
                    </div>
                    <p className='mt-2 font-medium text-foreground/80'>{bio.trim() ? bio : "No Bio Yet"}</p>
                    {(details && details.length > 0) &&
                        details.map((detail, index) => (
                            <Badge style={{ borderColor: colors.primary }} key={`detail-${index}`} variant="outline" className='mt-2 mr-1 capitalize'>{detail}</Badge>
                        ))
                    }
                    <div className='relative flex gap-x-3 my-2 smallText'>
                        <p><span style={{ color: colors.primary }} className="font-semibold text-sm md:text-base xl:text-lg montserrat">{formatTrendingCount(circleMembers)}</span> Circle Members</p>
                        <p><span style={{ color: colors.primary }} className='font-semibold text-sm md:text-base xl:text-lg montserrat'>{formatTrendingCount(circlesJoined)}</span> Circles Joined</p>
                        <p><span style={{ color: colors.primary }} className='font-semibold text-sm md:text-base xl:text-lg montserrat'>{totalPosts}</span> Posts</p>
                    </div>
                    <section className="flex justify-between gap-2 p-4">
                        <Link to="/messages" search={{ username }} disabled={(relationship?.blockedMe || relationship?.blockedByMe) ?? false}>
                            <ActionButton disabled={(relationship?.blockedMe || relationship?.blockedByMe) ?? false} color={colors.primary} icon={MessageText1} label="Message" />
                        </Link>
                        {/* Block/Unblock Toggle */}
                        <ActionButton onClick={() => toggleBlock.mutate(rel.blockedByMe)} isLoading={toggleBlock.isPending}
                            color={rel.blockedByMe ? "#EF4444" : colors.primary} icon={Slash}
                            label={rel.blockedByMe ? "Unblock" : "Block"} />

                        {/* Join/Leave Circle Toggle */}
                        <ActionButton onClick={() => toggleCircle.mutate(rel.inCircle)} isLoading={toggleCircle.isPending}
                            disabled={rel.blockedMe} color={rel.inCircle ? "#10B981" : colors.primary}
                            icon={rel.inCircle ? UserTick : UserAdd} label={rel.inCircle ? "In Circle" : "Join Circle"} />

                        {/* Report with Dialog */}
                        <ReportDialog isLoading={report.isPending} username={username} blockedByMe={rel.blockedByMe}
                            onReport={(reason, blockedByMe) => report.mutate({ reason, shouldBlock: blockedByMe })}
                            trigger={
                                <ActionButton disabled={rel.hasReported} color={rel.hasReported ? "#F59E0B" : colors.primary}
                                    icon={Flag2} label={rel.hasReported ? "Reported" : "Report"} />
                            } />
                    </section>
                </section>
            </main >
        </>
    );
}

export default Header;

const ActionButton = ({ icon: Icon, color, label, disabled, onClick, isLoading }: {
    icon: React.ComponentType<IconProps>; color: string; label: string; disabled?: boolean; onClick?: () => void; isLoading?: boolean
}) => {
    return (
        <div className="flex flex-col items-center gap-1">
            <button onClick={onClick} disabled={disabled || isLoading} style={{ color: disabled ? "#6B7280" : color }}
                className="bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 disabled:opacity-50 p-2.5 border border-border rounded-xl active:scale-95 transition-all duration-200 cursor-pointer">
                <Icon variant="Bold" className={`size-4 md:size-5 ${isLoading ? 'animate-pulse' : ''}`} />
            </button>
            <span style={{ color: disabled ? "#6B7280" : color }} className="font-medium text-[10px] md:text-[11px] xl:text-xs">
                {label}
            </span>
        </div>
    );
};