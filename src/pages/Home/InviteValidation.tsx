import { useState, type ChangeEvent } from 'react';
import { toast } from "react-fox-toast";
import { Link } from '@tanstack/react-router';

//Hooks, Stores and Utils
import { useCreateUser, useValidateUser } from "@/services/userMutations";
import { CheckUsername } from '@/services/userQueries';
import { generateCustomUsernames } from '@/utils/generate';

//Components
import Button from '@/components/Button';

//Icons
import { User, CircleCheckBig, Loader, Eye, EyeOff, Lock, Check, UserPlus, Shield, AlertTriangle, CheckCircle, LogIn } from "lucide-react";


const InviteValidation = ({ invitationCode }: { invitationCode: string }) => {

    const [indexPage, setIndexPage] = useState<boolean>(true);
    const [enteredUsername, setEnteredUsername] = useState<string>("");
    const [referrer, setReferrer] = useState<string>("");
    const [passwordPage, setPasswordPage] = useState<boolean>(false);
    const [recoveryPage, setRecoveryPage] = useState<boolean>(false);
    const { data, isFetching, isError, isLoading, error } = CheckUsername(enteredUsername);
    const generatedUsernames = generateCustomUsernames(enteredUsername);

    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [recoveryPhrase, setRecoveryPhrase] = useState<string>('');
    const [copied, setCopied] = useState<boolean>(false);

    //Functions
    const passwordRequirements = [
        { text: 'At least 8 characters', met: password.length >= 8 },
        { text: 'Contains uppercase letter', met: /[A-Z]/.test(password) },
        { text: 'Contains lowercase letter', met: /[a-z]/.test(password) },
        { text: 'Contains number', met: /\d/.test(password) },
        { text: 'Contains special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
    ];

    const allRequirementsMet = passwordRequirements.every(req => req.met);
    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

    const handleUsername = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const formattedValue = value.replace(/ /g, '.').replace(/[^A-Za-z0-9_]/g, '');
        setEnteredUsername(formattedValue);
    };

    const handleCopy = async (phrase: string) => {
        await navigator.clipboard.writeText(phrase);
        setCopied(true);
        toast.success("Your Recovery Phrase Was Copied Successfully.")
        setTimeout(() => setCopied(false), 10000);
    };

    // Form submission handler
    const validateInvite = useValidateUser();
    const createUser = useCreateUser();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (invitationCode.length !== 10) return toast.error("Invalid Referral Link");

        validateInvite.mutate({ invitationCode }, {
            onSuccess: (response) => {
                toast.success(response.data.message || "Referral Validation was successfully!");
                setReferrer(response.data.referrer)
                setIndexPage(false);
                setPasswordPage(true);
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => {
                const message = error?.response?.data?.message || "Referral Validation failed. Kindly restart the process.";
                toast.error(message);
            },
        });
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        toast("Creating your account", { isCloseBtn: true })
        createUser.mutate({ username: enteredUsername, password, referrer }, {
            onSuccess: (response) => {
                toast.success(response.data.message || "Your account was created successfully!");
                setRecoveryPhrase(response.data.recoveryUsername)
                setPasswordPage(false);
                setRecoveryPage(true);
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => {
                const message = error?.response?.data?.message || "Account creation failed. Kindly restart the process.";
                toast.error(message);
            },
        });
    }

    return (
        <>
            {indexPage && <div className="bg-white dark:bg-neutral-900 shadow-xl mx-auto p-4 md:p-6 xl:p-8 border border-border rounded-2xl w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="flex justify-center items-center mx-auto mb-4 bg-border rounded-full size-16">
                        <User className="size-8 text-primary" />
                    </div>
                    <h2 className="mb-2 font-bold text-lg md:text-xl xl:text-2xl montserrat">Choose Your Username</h2>
                    <p className="-mt-2 text-neutral-700 dark:text-neutral-400">Pick a unique username for your Knester profile</p>
                </div>
                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="relative flex flex-col gap-y-1">
                        <label htmlFor="username" className='font-medium cursor-pointer'>Username</label>
                        <input type="text" id="username" className='bg-background px-4 py-2.5 border border-border rounded-2xl focus:outline-none text-sm md:text-base xl:text-lg duration-300 focus:caret-primary' onChange={handleUsername} value={enteredUsername} title="Please enter only letters, numbers, and underscores (spaces will be replaced with underscores)" minLength={5} placeholder="Inclusive.Iguana" required />
                        <div className="right-3 bottom-4 absolute cursor-pointer transform">
                            {(isLoading && isFetching) && <Loader className="size-3 md:size-4 xl:size-5 text-foreground animate-spin" />}
                        </div>
                    </div>
                    {isError &&
                        <div className='bg-red-100 my-4 p-4 rounded-xl text-red-500 capitalize'>
                            <p>{error.message === "Request failed with status code 409" ? "Username already chosen, kindly try a new one" : "Sorry, we couldn't validate your username now, kindly try again."}</p>
                            <div className='flex gap-x-2'>{generatedUsernames.map((username) => (
                                <p className='font-medium text-black'>{username}</p>
                            ))}</div>
                        </div>}
                    {data && <div className='bg-green-100 my-4 p-4 rounded-xl text-green-500 capitalize'>
                        <CircleCheckBig className='inline size-3 md:size-4 xl:size-5' />
                        {data.message} press continue to enter password.
                    </div>}
                    <Button text="Continue" loadingText={"Validating Invitation..."} disabled={validateInvite.isPending || (isFetching || isError || isLoading)} loading={validateInvite.isPending} icon={<LogIn className='size-4 md:size-5' />} variant='primary' />
                </form>
            </div>}
            {passwordPage &&
                <div className="bg-white dark:bg-neutral-900 shadow-xl mx-auto p-4 md:p-6 xl:p-8 border border-border rounded-2xl w-full max-w-md">
                    <div className="mb-8 text-center">
                        <div className="flex justify-center items-center mx-auto mb-4 bg-border rounded-full size-16">
                            <Lock className="size-8 text-primary" />
                        </div>
                        <h2 className="mb-2 font-bold text-lg md:text-xl xl:text-2xl montserrat">Secure Your Account</h2>
                        <p className="-mt-2 text-neutral-700 dark:text-neutral-400">Create a strong password to protect your account</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
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

                        <div>
                            <label htmlFor="confirmPassword" className="block mb-1 font-medium cursor-pointer">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-background px-4 py-2.5 border border-border rounded-2xl focus:outline-none w-full text-sm md:text-base xl:text-lg duration-300 focus:caret-primary" placeholder="Confirm your password" required />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="top-1/2 right-3 absolute text-foreground hover:text-gray-600 -translate-y-1/2 cursor-pointer transform">
                                    {showConfirmPassword ? <EyeOff className="size-4 md:size-5" /> : <Eye className="size-4 md:size-5" />}
                                </button>
                            </div>
                            {confirmPassword && !passwordsMatch && (
                                <p className="mt-2 text-red-500">Passwords do not match</p>
                            )}
                            {passwordsMatch && (
                                <p className="mt-2 text-green-500">✓ Passwords match</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <p className="font-medium montserrat">Password Requirements:</p>
                            <div className="space-y-1">
                                {passwordRequirements.map((req, index) => (
                                    <div key={index} className="flex items-center space-x-2">
                                        <Check className={`size-4 ${req.met ? 'text-green-500' : 'text-gray-300'}`} />
                                        <span className={`${req.met ? 'text-green-600' : 'text-gray-500'}`}>
                                            {req.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Button text="Create Account" loadingText={"Creating Account..."} disabled={createUser.isPending || (!allRequirementsMet || !passwordsMatch)} loading={createUser.isPending} icon={<UserPlus className='size-4 md:size-5' />} variant='primary' />
                    </form>
                </div>
            }
            {recoveryPage &&
                <div className="bg-white dark:bg-neutral-900 shadow-xl mx-auto p-4 md:p-6 xl:p-8 border border-border rounded-2xl w-full max-w-md">
                    <div className="mb-8 text-center">
                        <div className="flex justify-center items-center mx-auto mb-4 bg-border rounded-full size-16">
                            <Shield className="size-8 text-amber-500" />
                        </div>
                        <h2 className="mb-2 font-bold text-lg md:text-xl xl:text-2xl montserrat">Secure Your Account</h2>
                        <p className="-mt-2 text-neutral-700 dark:text-neutral-400">Your recovery phrase is the only way to restore access to your account if you lose your password.</p>
                    </div>
                    <div className="bg-amber-50 mb-6 p-4 border border-amber-200 rounded-2xl">
                        <div className="flex items-start space-x-3">
                            <AlertTriangle className="flex-shrink-0 mt-0.5 size-4 md:size-5 text-amber-600" />
                            <div>
                                <p className="mb-1 font-semibold text-amber-600 dark:text-amber-800">Important Security Notice</p>
                                <ul className="space-y-1 text-amber-500 dark:text-amber-700">
                                    <li>• Store this phrase in a safe, offline location</li>
                                    <li>• Never share it with anyone or store it digitally</li>
                                    <li>• You'll need it to recover your account if you lose access</li>
                                    <li>• Knester cannot recover your account without this phrase</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='bg-background p-4 md:p-6 xl:p-8 border border-border rounded-2xl'>
                        <p className='my-2 font-medium text-base md:text-lg xl:text-xl text-center montserrat'>{recoveryPhrase}</p>
                        <Button onClick={() => handleCopy(recoveryPhrase)} text={copied ? 'Copied!' : 'Copy Recovery Phrase'} disabled={false} loading={false} icon={<CheckCircle className="size-4 md:size-5" />} variant='success' />
                    </div>
                    {copied && <Link to={"/dashboard"} className='block bg-primary hover:bg-accent my-4 p-3 rounded-2xl w-full text-center'>Enter Your Feed</Link>}
                </div>
            }
        </>

    );
}

export default InviteValidation;