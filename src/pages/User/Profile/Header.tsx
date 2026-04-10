import { useState, useRef } from 'react';
import { getPaletteSync } from 'colorthief';
import { Link } from '@tanstack/react-router';

// Utils
import { formatAmount, formatTrendingCount } from '@/utils/format';

// UIs
import { Badge } from '@/components/ui/badge';
import { Overlay } from '@/components/Overlay';
import ProfileForm from './ProfileForm';

// Icons
import {
    Flag2, MessageText1, People, ReceiptText, Slash, Setting2, Share, UserAdd,
    Verify, Wallet1, type IconProps, MedalStar, Crown1, Star1, Image
} from 'iconsax-reactjs';

type HeaderProps = {
    profilePicture: string;
    isOnline: boolean;
    username: string;
    bio: string;
    isPremium: boolean;
    isModerator: boolean;
    isCore: boolean;
    circleMembers: number;
    circlesJoined: number;
    totalPosts: number;
    balance: number;
    isOwner: boolean;
    isSuspended: boolean;
    details: string[];
    relationship?: {
        inCircle: boolean;
        hasReported: boolean;
        hasBlocked: boolean;
        isBlocked: boolean;
    }
}

const Header = ({
    profilePicture, isOnline, username, bio, isPremium, isModerator,
    isCore, circleMembers, circlesJoined, totalPosts, balance,
    isOwner, isSuspended, details, relationship,
}: HeaderProps) => {

    const [colors, setColors] = useState({ primary: '#f0f0f0', secondary: '#e0e0e0' });
    const [isDark, setIsDark] = useState<boolean>(false);
    const [shareInvite, setShareInvite] = useState<boolean>(false);
    const [profileForm, setProfileForm] = useState<boolean>(false);
    const [updateProfilePic, setUpdateProfilePic] = useState<boolean>(false);
    const imgRef = useRef<HTMLImageElement>(null);

    // Functions
    const handleLoad = () => {
        if (imgRef.current) {
            const palette = getPaletteSync(imgRef.current, { colorCount: 3 });
            if (palette && palette.length >= 2) {
                setColors({
                    primary: palette[0].css(),
                    secondary: palette[1].css()
                });
                setIsDark(palette[0].isDark);
            }
        }
    };

    const toggleInvite = () => setShareInvite((prev) => !prev);
    const toggleProfileForm = () => setProfileForm((prev) => !prev);
    const toggleProfilePictureUpdate = () => setUpdateProfilePic((prev) => !prev);

    return (
        <>
            <main className='mx-auto border border-border rounded-3xl max-w-7xl'>
                <div className="relative rounded-3xl h-32 md:h-36 xl:h-40 overflow-hidden"
                    style={{ backgroundColor: colors.primary, transition: 'all 0.8s ease' } as React.CSSProperties}>

                    {/* DUAL COLOR GLOW */}
                    <div className="top-1/2 left-1/2 absolute blur-[60px] w-[200%] h-[200%] transition-opacity -translate-x-1/2 -translate-y-1/2 duration-700 pointer-events-none"
                        style={{
                            background: `
                        radial-gradient(circle at 30% 30%, ${colors.primary} 0%, transparent 60%),
                        radial-gradient(circle at 70% 70%, ${colors.secondary} 0%, transparent 60%) `,
                            opacity: isDark ? 0.4 : 0.2
                        }} />

                    <img ref={imgRef} src={profilePicture} onLoad={handleLoad} crossOrigin="anonymous" className="hidden" />

                    {isOwner &&
                        <div className='top-4 right-4 absolute flex gap-x-2'>
                            <button onClick={toggleProfilePictureUpdate} className={`outline-0 ${isDark ? "bg-white text-[#121212]" : "bg-[#121212] text-white"} p-1 duration-300 rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground`}>
                                <Image variant='Bold' className='size-5 md:size-6 xl:size-7' />
                            </button>

                            <button onClick={toggleProfileForm} className={`outline-0 ${isDark ? "bg-white text-[#121212]" : "bg-[#121212] text-white"} p-1 duration-300 rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground`}>
                                <Setting2 variant='Bold' className='size-5 md:size-6 xl:size-7' />
                            </button>

                            <button onClick={toggleInvite} className={`outline-0 ${isDark ? "bg-white text-[#121212]" : "bg-[#121212] text-white"} p-1 duration-300 rounded-lg cursor-pointer hover:bg-accent hover:text-accent-foreground flex items-center gap-x-1`}>
                                <Share variant='Bold' className='size-5 md:size-6 xl:size-7' />
                            </button>
                        </div>
                    }
                </div>
                <section className='-mt-12 md:-mt-14 xl:-mt-16 px-4'>
                    <div className={`${isDark ? "bg-white" : "bg-[#121212]"} relative shadow-lg border-2 border-accent/30 rounded-2xl size-20 sm:size-24 md:size-28 xl:size-32 overflow-hidden`}>
                        <img src={profilePicture} alt={"profile picture"} className="object-cover" />
                        {/* Online Status */}
                        {isOnline && (
                            <div className="right-2 bottom-2 absolute bg-green-500 rounded-full size-3 md:size-3.5 xl:size-4" />
                        )}
                    </div>
                </section>
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
                    <p className='mt-2 font-medium text-[11px] text-foreground/80 md:text-xs xl:text-sm'>{bio}</p>
                    {(details && details.length > 0) &&
                        details.map((detail) => (
                            <Badge variant="outline" className='mt-2 mr-1 capitalize'>{detail}</Badge>
                        ))
                    }
                    {isOwner ?
                        <section className='gap-2 grid grid-cols-2 sm:grid-cols-4 mt-2'>
                            <HeaderCard isDark={isDark} color={colors.primary} title='Circle Members' Icon={People} amount={formatTrendingCount(circleMembers)} />
                            <HeaderCard isDark={isDark} color={colors.primary} title='Posts' Icon={ReceiptText} amount={totalPosts} />
                            <HeaderCard isDark={isDark} color={colors.primary} title='Balance' Icon={Wallet1} amount={formatAmount(balance)} />
                            <HeaderCard isDark={isDark} color={colors.primary} title='Circles Joined' Icon={UserAdd} amount={formatTrendingCount(circlesJoined)} />
                        </section>
                        :
                        <div className='relative flex gap-x-3 my-2 text-[11px] md:text-xs xl:text-sm'>
                            <p><span style={{ color: colors.primary }} className="font-semibold montserrat">{formatTrendingCount(circleMembers)}</span> Circle Members</p>
                            <p><span style={{ color: colors.primary }} className='font-semibold montserrat'>{formatTrendingCount(circlesJoined)}</span> Circles Joined</p>
                            <p><span style={{ color: colors.primary }} className='font-semibold montserrat'>{totalPosts}</span> Posts</p>
                        </div>
                    }

                    {!isOwner &&
                        <section className="flex justify-between gap-2 p-4">
                            <Link to="/messages" search={{ username }} disabled={(relationship?.isBlocked || relationship?.hasBlocked) ?? false}>
                                <ActionButton disabled={(relationship?.isBlocked || relationship?.hasBlocked) ?? false} color={colors.primary} icon={MessageText1} label="Message" />
                            </Link>
                            <ActionButton disabled={relationship?.hasBlocked ?? false} color={colors.primary} icon={Slash} label="Block" />
                            <ActionButton disabled={relationship?.inCircle ?? false} color={colors.primary} icon={UserAdd} label="Join Circle" />
                            <ActionButton disabled={relationship?.hasBlocked ?? false} color={colors.primary} icon={Flag2} label="Report" />
                        </section>
                    }
                </section>
            </main >
            {profileForm &&
                <Overlay open={profileForm} onClose={toggleProfileForm}>
                    <ProfileForm />
                </Overlay>
            }
            {updateProfilePic &&
                <Overlay open={updateProfilePic} onClose={toggleProfilePictureUpdate}>
                    <h2 className="font-semibold text-base md:text-lg xl:text-xl">Customise Your Avatar</h2>
                </Overlay>
            }
            {shareInvite &&
                <Overlay open={shareInvite} onClose={toggleInvite}>
                    <h2 className="font-semibold text-base md:text-lg xl:text-xl">Invite Friends</h2>
                </Overlay>
            }
        </>
    );
}

export default Header;

type HeaderCardProps = {
    isDark: boolean;
    color: string;
    Icon: React.ComponentType<IconProps>;
    title: string;
    amount: number | string;
}

const HeaderCard = ({ isDark, color, Icon, title, amount }: HeaderCardProps) => {
    return (
        <div style={{ background: color, borderColor: color, color: isDark ? "white" : "#121212" }}
            className="flex flex-col justify-between p-2 border rounded-xl w-full min-w-0">
            <div className="flex items-center gap-1 truncate">
                <Icon className="size-4.5 shrink-0" variant="Bold" />
                <p className="font-medium text-[11px] md:text-xs xl:text-sm truncate">{title}</p>
            </div>

            <h1 className="mt-1 font-bold text-lg md:text-xl xl:text-2xl truncate montserrat">
                {amount}
            </h1>
        </div>
    );
};

const ActionButton = ({ icon: Icon, color, label, disabled }: { icon: React.ComponentType<IconProps>; color: string; label: string, disabled: boolean }) => {
    return (
        <div className="flex flex-col items-center gap-1">
            <button disabled={disabled} style={{ color: disabled ? "#6B7280" : color }} className="bg-white/10 hover:bg-white/20 dark:bg-white/5 dark:hover:bg-white/10 hover:shadow-sm backdrop-blur-md p-2.5 border border-border rounded-xl active:scale-95 transition-all duration-200 cursor-pointer">
                <Icon variant="Bold" className="size-4 md:size-4.5 xl:size-5" />
            </button>
            <span style={{ color: disabled ? "#6B7280" : color }} className={`font-medium text-[10px] md:text-[11px] xl:text-xs`}>{label}</span>
        </div>
    );
};