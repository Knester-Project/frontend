import { Link } from '@tanstack/react-router';

// Icons
import { Sms, TagUser } from 'iconsax-reactjs';

const InviteOnly = () => {
    return (
        <main className="bg-accent/20 dark:bg-accent/5 shadow mx-auto p-4 md:p-6 xl:p-8 border border-border rounded-2xl text-center">
            <section className="mb-8">
                <div className="flex justify-center items-center bg-background mx-auto mb-4 border border-border rounded-full size-16">
                    <Sms className="size-7 md:size-7.5 xl:size-8 text-primary" />
                </div>
                <h2 className="mb-2 font-bold text-lg md:text-xl xl:text-2xl montserrat">Invitation Required</h2>
                <p className='text-muted-foreground'>
                    Knester is currently invite-only. You'll need an invitation from an existing member to join.
                </p>
            </section>

            <section className="bg-background mb-6 p-4 md:p-5 xl:p-6 border border-border rounded-xl">
                <div className="flex items-center gap-x-2 mb-3">
                    <TagUser className="size-4 md:size-4.5 xl:size-5" />
                    <h3 className="font-semibold">How to get invited</h3>
                </div>
                <ul className="space-y-2 pl-4 md:pl-5 xl:pl-6 text-left list-disc">
                    <li>Ask a friend who's already on Knester</li>
                    <li>Follow us on social media for invitation opportunities</li>
                    <li>Join our wait list to be notified when invitations are available</li>
                </ul>
            </section>

            <section className="space-y-3">
                <Link to="/waitlist" className='block bg-primary hover:bg-gradient-to-r hover:from-primary hover:to-accent my-4 py-3 rounded-2xl rounded-xl w-full font-medium text-neutral-100 duration'>Join Waitlist</Link>

                <div className='flex justify-between'>
                    <p className="text-[11px] text-muted-foreground md:text-xs xl:text-sm">
                        Have questions?{' '}
                        <Link to="/contact" className="text-foreground hover:underline">
                            Contact us
                        </Link>
                    </p>
                    <p className="text-[11px] text-muted-foreground md:text-xs xl:text-sm">
                        Have an account?{' '}
                        <Link to="/login" className="text-foreground hover:underline">
                           Login
                        </Link>
                    </p>
                </div>

            </section>
        </main>
    );;
}

export default InviteOnly;