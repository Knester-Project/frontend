import { useState, type ChangeEvent } from 'react';

//Services
import { useAuthUser } from '@/services/userMutations';

//Component
import Button from '@/components/Button';

//Icons
import { Eye, EyeOff, KeyRound, ScanFace } from 'lucide-react';


const Index = () => {

    const [enteredUsername, setEnteredUsername] = useState<string>("");
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);

    //Functions
    const handleUsername = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEnteredUsername(value);
    };

    const passwordRequirements = [
        { text: 'At least 8 characters', met: password.length >= 8 },
        { text: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
        { text: 'Contains lowercase letter', met: /[a-z]/.test(password) },
        { text: 'Contains number', met: /\d/.test(password) },
        { text: 'Contains special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
    ];

    const allRequirementsMet = passwordRequirements.every(req => req.met);

    const authUser = useAuthUser();
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
    }

    return (
        <main className="bg-accent/20 dark:bg-accent/5 shadow-xl mx-auto p-4 md:p-6 xl:p-8 border border-border rounded-2xl w-full max-w-2xl">
            <div className="mb-8 text-center">
                <div className="flex justify-center items-center bg-background mx-auto mb-4 border border-border rounded-full size-16">
                    <KeyRound className="size-8 text-primary" />
                </div>
                <h2 className="mb-2 font-bold text-lg md:text-xl xl:text-2xl montserrat">Authentication</h2>
                <p className="-mt-2 text-neutral-700 dark:text-neutral-400">Kindly enter your email and password to continue.</p>
            </div>
            <form onSubmit={onSubmit} className="space-y-6">
                <div className="relative flex flex-col gap-y-1">
                    <label htmlFor="username" className='font-medium cursor-pointer'>Username</label>
                    <input type="text" id="username" className='bg-background px-4 py-2.5 border border-border rounded-2xl focus:outline-none text-sm md:text-base xl:text-lg duration-300 focus:caret-primary' onChange={handleUsername} value={enteredUsername} title="Please enter only letters, numbers, and underscores (spaces will be replaced with underscores)" minLength={5} placeholder="Inclusive.Iguana" required />
                </div>
                <div className="flex flex-col gap-y-1">
                    <label htmlFor="password" className='font-medium cursor-pointer'>
                        Password
                    </label>
                    <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-background px-4 py-2.5 border border-border rounded-2xl focus:outline-none w-full text-sm md:text-base xl:text-lg duration-300 focus:caret-primary" placeholder="Enter your password" required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="top-1/2 right-3 absolute text-foreground hover:text-gray-600 -translate-y-1/2 cursor-pointer transform">
                            {showPassword ? <EyeOff className="size-4 md:size-5" /> : <Eye className="size-4 md:size-5" />}
                        </button>
                    </div>
                </div>
                <Button text="Join the Party." loadingText={"Joining..."} disabled={authUser.isPending || (!allRequirementsMet)} loading={authUser.isPending} icon={<ScanFace className='size-4 md:size-5' />} variant='primary' />
            </form>
        </main >
    );
}

export default Index;