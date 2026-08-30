import { useState, type ChangeEvent } from 'react';
import { UAParser } from 'ua-parser-js';
import { sileo } from "sileo";
import { useNavigate } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';

// Schemas, Services and Utils
import { loginSchema, type AuthInput } from '@/schemas/auth.schema';
import { useAuthUser } from '@/services/userMutations';
import { flattenZodErrors } from '@/utils/zod';

// Component
import Button from '@/components/common/Button';
import ErrorText from '@/components/errors/ErrorText';

// Icons
import { Rocket, ScanFace } from 'lucide-react';
import { InfoCircle, TagUser, Eye, EyeSlash } from 'iconsax-reactjs';


const Index = () => {

    const [enteredUsername, setEnteredUsername] = useState<string>("");
    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const navigate = useNavigate();

    // Functions
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

    const parser = new UAParser();
    const result = parser.getResult();

    const device = {
        ua: navigator.userAgent,
        type: result.device.type,
        os: result.os.name,
        browser: result.browser.name,
    };

    const authUser = useAuthUser();
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!allRequirementsMet)
            return sileo.error({ title: "Authentication failed.", description: "Your Login Attempt Failed, Please check your credentials." });

        const payload: AuthInput = {
            username: enteredUsername,
            password,
            device,
        };

        const parsed = loginSchema.safeParse(payload);
        if (!parsed.success) {
            setErrors(flattenZodErrors(parsed.error));
            return;
        } else {
            setErrors({});
            authUser.mutate(parsed.data, {
                onSuccess: (response) => {
                    sileo.success({ title: "Authentication Successful", description: response.message, icon: <Rocket className="size-3.5" />, });
                    navigate({ to: "/feed" });
                },
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onError: (error: any) => {
                    const message = error?.response?.data?.message || "Your Login Attempt Failed, Please check your credentials.";
                    sileo.error({ title: "Authentication Failed", description: message });
                },
            });
        }
    }

    return (
        <main className="bg-accent/20 dark:bg-accent/5 shadow mx-auto p-4 md:p-6 xl:p-8 border border-border rounded-2xl w-full max-w-2xl">
            <div className="mb-8 text-center">
                <div className="flex justify-center items-center bg-background mx-auto mb-4 border border-border rounded-full size-16">
                    <TagUser className="size-7 md:size-7.5 xl:size-8 text-primary" variant='Bold' />
                </div>
                <h2 className="mb-2 font-bold text-lg md:text-xl xl:text-2xl montserrat">Authentication</h2>
                <p className="-mt-2 text-muted-foreground">Kindly enter your username and password to continue.</p>
            </div>
            <form onSubmit={onSubmit} className="space-y-6">
                <div className="relative flex flex-col gap-y-1">
                    <label htmlFor="username" className='font-medium cursor-pointer'>Username</label>
                    <input type="text" id="username" className='bg-background px-4 py-2.5 border border-border rounded-2xl focus:outline-none text-sm md:text-base xl:text-lg duration-300 focus:caret-primary' onChange={handleUsername} value={enteredUsername} title="Please enter only letters, numbers, and underscores (spaces will be replaced with underscores)" minLength={5} placeholder="Inclusive.Iguana" required />
                    {errors.username && <ErrorText message={errors.username[0]} />}
                    <p className='mt-1 text-[11px] text-primary md:text-xs xl:text-sm'><InfoCircle className="inline mb-0.25 size-4 xl:size-5" variant='Bold' /> Case-sensitive (e.g., "Remy" is not the same as "remy").</p>
                </div>
                <div className="flex flex-col gap-y-1">
                    <label htmlFor="password" className='font-medium cursor-pointer'>
                        Password
                    </label>
                    <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-background px-4 py-2.5 border border-border rounded-2xl focus:outline-none w-full text-sm md:text-base xl:text-lg duration-300 focus:caret-primary" placeholder="Enter your password" required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="top-1/2 right-3 absolute text-foreground hover:text-gray-600 -translate-y-1/2 cursor-pointer transform">
                            {showPassword ? <EyeSlash className="size-4 md:size-4.5 xl:size-5" /> : <Eye className="size-4 md:size-4.5 xl:size-5" />}
                        </button>
                    </div>
                    {errors.password && <ErrorText message={errors.password[0]} />}
                </div>
                <Button text="Join the Party" loadingText={"Joining..."} disabled={authUser.isPending} loading={authUser.isPending} icon={<ScanFace className='size-4 md:size-4.5 xl:size-5' />} variant='primary' />
            </form>
            <Link to="/forgot" className='block mt-4 ml-auto w-fit font-semibold text-muted-foreground hover:text-primary duration-200'>Can’t remember your password?</Link>
        </main>
    );
}

export default Index;