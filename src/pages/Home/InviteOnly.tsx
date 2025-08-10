import { Link } from 'react-router-dom';

//Icons
import { Mail, Users } from 'lucide-react';

const InviteOnly = () => {
    return (
        <main className="bg-white dark:bg-neutral-900 shadow-xl mx-auto p-8 border border-border rounded-2xl w-full max-w-md text-center">
            <div className="mb-8">
                <div className="flex justify-center items-center bg-background mx-auto mb-4 rounded-full size-16">
                    <Mail className="size-8 text-primary" />
                </div>
                <h2 className="mb-2 font-bold text-2xl 00">Invitation Required</h2>
                <p className='text-neutral-700 dark:text-neutral-400'>
                    Knester is currently invite-only. You'll need an invitation from an existing member to join.
                </p>
            </div>

            <div className="bg-background mb-6 p-6 rounded-xl">
                <div className="flex justify-center items-center space-x-2 mb-3">
                    <Users className="size-5" />
                    <h3 className="font-semibold text-muted-foreground">How to get invited</h3>
                </div>
                <ul className="space-y-2 text-foreground text-left">
                    <li>• Ask a friend who's already on Knester</li>
                    <li>• Follow us on social media for invitation opportunities</li>
                    <li>• Join our waitlist to be notified when invitations are available</li>
                </ul>
            </div>

            <div className="space-y-3">
                <Link to="/waitlist" className='block bg-primary hover:bg-gradient-to-r hover:from-primary hover:to-accent my-4 py-3 rounded-2xl rounded-xl w-full font-medium text-neutral-100 duration'>Join Waitlist</Link>

                <p className="text-gray-500 text-sm">
                    Have questions?{' '}
                    <a href="mailto:hello@knester.com" className="text-purple-600 hover:underline">
                        Contact us
                    </a>
                </p>
            </div>
        </main>
    );;
}

export default InviteOnly;