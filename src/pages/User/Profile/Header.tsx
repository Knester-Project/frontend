import { useState, useRef } from 'react';
import { getPaletteSync } from 'colorthief';

// Utils
import { formatAmount, formatTrendingCount } from '@/utils/format';

// UIs
import { Badge } from '@/components/ui/badge';

// Icons
import { Share2 } from 'lucide-react';
import { Profile2User, Slash, Verify, Wallet1, type IconProps } from 'iconsax-reactjs';

type HeaderProps = {
    profilePicture: string;
    isOnline: boolean;
    username: string;
    bio: string;
    isPremium: boolean;
    isModerator: boolean;
    isCore: boolean;
    circleMembers: number;
    balance: number;
    isOwner: boolean;
    isSuspended: boolean;
}

const Header = ({ profilePicture, isOnline, username, bio, isPremium, isModerator, isCore, circleMembers, balance, isOwner, isSuspended }: HeaderProps) => {

    const [colors, setColors] = useState({ primary: '#f0f0f0', secondary: '#e0e0e0' });
    const [isDark, setIsDark] = useState<boolean>(false);
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

    return (
        <main className='p-2 md:p-3 xl:p-4 border border-border rounded-3xl'>
            <div className="relative rounded-3xl h-24 md:h-28 xl:h-32 overflow-hidden"
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

            </div>
            <section className='flex justify-between items-start -mt-12 md:-mt-14 xl:-mt-16 px-4 w-full'>
                <div className="relative">
                    <div className={`${isDark ? "bg-white" : "bg-[#121212]"} shadow-lg border-2 border-accent/30 rounded-2xl size-20 sm:size-24 md:size-28 xl:size-32 overflow-hidden`}>
                        <img src={profilePicture} alt={"profile picture"} className="object-cover" />
                        {/* Online Status */}
                        {isOnline && (
                            <div className="right-2 bottom-2 absolute bg-green-500 rounded-full size-3 md:size-3.5 xl:size-4" />
                        )}
                    </div>
                </div>
                {isOwner &&
                    <div className='relative flex gap-x-2'>
                        <button className={`outline-0 ${isDark ? "bg-white text-[#121212]" : "bg-[#121212] text-white"} py-2 px-4 font-medium duration-300 rounded-3xl cursor-pointer hover:bg-accent hover:text-accent-foreground`}>
                            Customise
                        </button>
                        <button className={`outline-0 ${isDark ? "bg-white text-[#121212]" : "bg-[#121212] text-white"} py-2 px-4 font-medium duration-300 rounded-3xl cursor-pointer hover:bg-accent hover:text-accent-foreground flex items-center gap-x-1`}>
                            <Share2 className='size-4' />
                            Invite
                        </button>
                    </div>
                }
            </section>
            <section className='mt-4'>
                <div className="flex items-center gap-x-2">
                    <h1 className='font-bold text-xl md:text-2xl xl:text-3xl'>{username}</h1>
                    {isPremium && <Verify className='size-5 md:size-6 xl:size-7 text-premium' variant='Bold' />}
                    {isModerator && <Verify className='size-5 md:size-6 xl:size-7 text-moderator' variant='Bold' />}
                    {isCore && <Verify className='size-5 md:size-6 xl:size-7 text-core' variant='Bold' />}
                    {isSuspended && <Badge variant="destructive">
                        <Slash data-icon="inline-start" />
                        Suspended
                    </Badge>}
                </div>
                <p className='font-medium text-foreground/80'>{bio}</p>
            </section>
            <section className='gap-2 grid grid-cols-4 mt-4'>
                <HeaderCard isDark={isDark} color={colors.primary} title='Circle Members' Icon={Profile2User} amount={formatTrendingCount(circleMembers)} />
                <HeaderCard isDark={isDark} color={colors.primary} title='Balance' Icon={Wallet1} amount={formatAmount(balance)} />
            </section>
        </main>
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
                <Icon className="size-4 shrink-0" variant="Bold" />
                <p className="font-medium text-[10px] md:text-[11px] xl:text-xs truncate">{title}</p>
            </div>

            <h1 className="mt-1 font-bold text-base md:text-lg xl:text-xl truncate montserrat">
                {amount}
            </h1>
        </div>
    );
};