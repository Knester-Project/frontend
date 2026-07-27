import { useState, useRef } from 'react';
import { getPaletteSync } from 'colorthief';
import { sileo } from 'sileo';

// Utils, Stores and Services
import { formatAmount, formatTrendingCount } from '@/utils/format';
import { useProfileTheme } from '@/stores/profileTheme.store';

// UIs
import { Badge } from '@/components/ui/badge';
import { Overlay } from '@/components/Overlay';
import ProfileForm from './ProfileForm';
import Invite from './Invite';
import ProfilePictureEditor from './PictureEditor';

// Icons and Images
import { Slash, Setting2, Share, Verify, MedalStar, Crown1, Star1, Image, GalleryEdit } from 'iconsax-reactjs';
import emptyPicture from "/blank.jpg";

const DETAILS_LENGTH = 4;
const MEDIA_LENGTH = 10;

const MyHeader = ({ user }: { user: Me }) => {

    const { username, isPremium, isModerator,
        isCore, circlesJoined, totalPosts, isSuspended, referralPrivilege } = user;

    const {
        profilePicture = "",
        isOnline = false,
        bio = "",
        circleMembers = 0,
        wallet = {
            availableBalance: 0,
            escrowedBalance: 0,
        },
        profileLock = false,
        chatLock = false,
        details = [],
        dateOfBirth = ""
    } = user?.profile || {}

    const mediaLength = user.profile?.media?.length ?? 0

    const { colors, replaceColors } = useProfileTheme();
    const [shareInvite, setShareInvite] = useState<boolean>(false);
    const [profileForm, setProfileForm] = useState<boolean>(false);
    const [updateProfilePic, setUpdateProfilePic] = useState<boolean>(false);
    const imgRef = useRef<HTMLImageElement>(null);

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

    const toggleInvite = () => {
        if (referralPrivilege <= 0) return sileo.error({ title: "Limit Reached", description: "Sorry, You have reached your invitation limit." })
        setShareInvite((prev) => !prev)
    }
    const toggleProfileForm = () => setProfileForm((prev) => !prev);
    const toggleProfilePictureUpdate = () => setUpdateProfilePic((prev) => !prev);

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
                    <div className='top-4 right-4 absolute flex gap-x-2'>
                        <button onClick={toggleProfilePictureUpdate} className={`outline-0 ${colors.isDark ? "bg-white text-[#121212]" : "bg-[#121212] text-white"} p-1 duration-300 rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground`}>
                            <Image variant='Bold' className='size-5 md:size-6 xl:size-7' />
                        </button>

                        <button onClick={toggleProfileForm} className={`outline-0 ${colors.isDark ? "bg-white text-[#121212]" : "bg-[#121212] text-white"} p-1 duration-300 rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground`}>
                            <Setting2 variant='Bold' className='size-5 md:size-6 xl:size-7' />
                        </button>

                        <button onClick={toggleInvite} className={`outline-0 ${colors.isDark ? "bg-white text-[#121212]" : "bg-[#121212] text-white"} p-1 duration-300 rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground flex items-center gap-x-1`}>
                            <Share variant='Bold' className='size-5 md:size-6 xl:size-7' />
                        </button>
                    </div>
                </section>

                <header className='-mt-12 md:-mt-14 xl:-mt-16 px-4'>
                    <div className={`${colors.isDark ? "bg-white border-white" : "bg-[#121212] border-[#121212]"} group relative shadow-lg border rounded-2xl size-20 sm:size-24 md:size-28 xl:size-32 overflow-hidden`}>
                        <img src={profilePicture || emptyPicture} alt={"profile picture"} className="object-cover" />
                        {/* Online Status */}
                        {isOnline && (
                            <div className="right-2 bottom-2 absolute bg-green-500 rounded-full size-3 md:size-3.5 xl:size-4" />
                        )}

                        <div className="absolute inset-0 flex justify-center items-center bg-background/40 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-500">
                            <div onClick={toggleProfilePictureUpdate} className="flex items-center gap-1.5 bg-foreground/90 px-2.5 py-1.5 rounded-lg text-background cursor-pointer">
                                <GalleryEdit className="size-3" />
                                <span className="font-semibold text-[10px] md:text-[11px] text-xs">Edit</span>
                            </div>
                        </div>
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
                    <section className='gap-2 grid grid-cols-2 sm:grid-cols-4 mt-6'>
                        <HeaderCard color={colors.primary} title='Circle Members' amount={formatTrendingCount(circleMembers)} />
                        <HeaderCard color={colors.primary} title='Posts' amount={totalPosts} />
                        <HeaderCard color={colors.primary} title='Balance' amount={formatAmount(wallet.availableBalance)} amount1={formatAmount(wallet.escrowedBalance)} />
                        <HeaderCard color={colors.primary} title='Circles Joined' amount={formatTrendingCount(circlesJoined)} />
                    </section>
                </section>
            </main >
            {profileForm &&
                <Overlay open={profileForm} onClose={toggleProfileForm}>
                    <ProfileForm
                        isPremium={isPremium || isModerator || isCore}
                        close={toggleProfileForm}
                        remainingMedia={MEDIA_LENGTH - mediaLength}
                        MAX_DETAILS={DETAILS_LENGTH}
                        defaultValues={{
                            bio,
                            details: details.map(d => ({ value: d })),
                            dateOfBirth: dateOfBirth ? dateOfBirth.toString() : "",
                            profileLock,
                            chatLock,
                            discoverable: user.profile?.discoverable
                        }}
                    />
                </Overlay>
            }
            {updateProfilePic &&
                <Overlay open={updateProfilePic} onClose={toggleProfilePictureUpdate} variant='bottom'>
                    <ProfilePictureEditor
                        isPremium={isPremium || isModerator || isCore}
                        onClose={toggleProfilePictureUpdate}
                    />
                </Overlay>
            }
            {shareInvite &&
                <Overlay open={shareInvite} onClose={toggleInvite} variant='bottom'>
                    <Invite />
                </Overlay>
            }
        </>
    );
}

export default MyHeader;

type HeaderCardProps = {
    color: string;
    title: string;
    amount: number | string;
    amount1?: number | string;
}

const HeaderCard = ({ color, title, amount, amount1 }: HeaderCardProps) => {

    const withOpacity = (rgb: string, alpha: number) =>
        rgb.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);

    return (
        <div style={{ borderColor: withOpacity(color, 0.5) }}
            className="flex flex-col justify-between p-2 border rounded-md w-full min-w-0 text-center">
            <p className="font-medium text-[11px] text-foreground/70 md:text-xs xl:text-sm truncate">{title}</p>

            <h1 className="mt-1 font-bold tabular-nums text-lg md:text-xl xl:text-2xl truncate montserrat">
                {amount} <sup className='opacity-80 text-[11px] md:text-xs xl:text-sm'>{amount1}</sup>
            </h1>
        </div>
    );
};