import { useState, type ChangeEvent } from 'react';
import { sileo } from "sileo";
import { Link } from '@tanstack/react-router';

// Hooks, Stores, Utils, Services and Libs
import { useCreateUser, useValidateUser } from "@/services/userMutations";
import { useCheckUsername } from '@/services/userQueries';
import { generateCustomUsernames } from '@/utils/generate';
import { generateIdentityKeyPair, exportKeyToJwk } from "@/utils/chat/e2ee";
import { useUpdateUser } from "@/services/userMutations";
import { lockPrivateKey } from "@/utils/vault";
import { db } from "@/lib/db";

// UIs
import Button from '@/components/common/Button';

//Icons
import { CircleCheckBig, Loader } from "lucide-react";
import { TagUser, Eye, EyeSlash, Lock, TickCircle, ShieldSecurity, UserCirlceAdd, Danger, LoginCurve, } from 'iconsax-reactjs';


const InviteValidation = ({ invitationCode }: { invitationCode: string }) => {

    const [indexPage, setIndexPage] = useState<boolean>(true);
    const [enteredUsername, setEnteredUsername] = useState<string>("");
    const [referrer, setReferrer] = useState<string>("");
    const [passwordPage, setPasswordPage] = useState<boolean>(false);
    const [recoveryPage, setRecoveryPage] = useState<boolean>(false);
    const { data, isLoading, isError, error } = useCheckUsername(enteredUsername);
    const generatedUsernames = generateCustomUsernames(enteredUsername);

    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    const [recoveryPhrase, setRecoveryPhrase] = useState<string>('');
    const [copied, setCopied] = useState<boolean>(false);
    const [isGeneratingKeys, setIsGeneratingKeys] = useState<boolean>(false);

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
        sileo.success({ title: "Your Recovery Phrase Was Copied Successfully." })
        setTimeout(() => setCopied(false), 10000);
    };

    // Form submission handlers
    const validateInvite = useValidateUser();
    const createUser = useCreateUser();
    const updateUser = useUpdateUser();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (invitationCode.length !== 10) return sileo.error({ title: "Invalid Referral Link" });

        validateInvite.mutate({ invitationCode }, {
            onSuccess: (response) => {
                sileo.success({ title: response.data.message || "Referral Validation was successful!" });
                setReferrer(response.data.referrer)
                setIndexPage(false);
                setPasswordPage(true);
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => {
                const message = error?.response?.data?.message || "Referral Validation failed. Kindly restart the process.";
                sileo.error({ title: message });
            },
        });
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        sileo.show({ title: "Creating your account" });
        setIsGeneratingKeys(true);

        createUser.mutate({ username: enteredUsername, password, referrer }, {
            onSuccess: async (response) => {
                const phrase = response.data.recoveryUsername;
                setRecoveryPhrase(phrase);

                try {
                    sileo.show({ title: "Generating Secure E2EE Keys..." });

                    // Generate the ECDH Identity Keys
                    const keyPair = await generateIdentityKeyPair();

                    // Export them to JSON (JWK)
                    const publicJwk = await exportKeyToJwk(keyPair.publicKey);
                    const privateJwk = await exportKeyToJwk(keyPair.privateKey);

                    // Lock the private key using the RECOVERY PHRASE
                    const encryptedVault = await lockPrivateKey(privateJwk, phrase);

                    // Save the raw private key locally to Dexie
                    await db.identity.add({
                        id: "me",
                        privateKeyJwk: privateJwk,
                        publicKeyJwk: publicJwk,
                    });

                    // Send the Public Key and Encrypted Vault to the backend
                    updateUser.mutate({
                        publicKey: {
                            crv: publicJwk.crv!,
                            ext: publicJwk.ext!,
                            key_ops: publicJwk.key_ops!,
                            kty: publicJwk.kty!,
                            x: publicJwk.x!,
                            y: publicJwk.y!
                        },
                        encryptedVault: {
                            vaultData: encryptedVault.vaultData,
                            salt: encryptedVault.salt,
                            iv: encryptedVault.iv
                        }
                    }, {
                        onSuccess: () => {
                            sileo.success({ title: "Account and Security Keys created successfully!" });
                            setIsGeneratingKeys(false);
                            setPasswordPage(false);
                            setRecoveryPage(true);
                        },
                        onError: () => {
                            sileo.error({ title: "Failed to upload security keys. Please try again." });
                            setIsGeneratingKeys(false);
                        }
                    });

                } catch (error) {
                    console.error("Cryptography error:", error);
                    sileo.error({ title: "Encryption failed on your device. Ensure you are using a modern browser." });
                    setIsGeneratingKeys(false);
                }
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => {
                const message = error?.response?.data?.message || "Account creation failed. Kindly restart the process.";
                sileo.error({ title: message });
                setIsGeneratingKeys(false);
            },
        });
    }

    return (
        <>
            {indexPage &&
                <div className="bg-accent/20 dark:bg-accent/5 shadow mx-auto p-4 md:p-6 xl:p-8 border border-border rounded-2xl w-full max-w-2xl">
                    <div className="mb-8 text-center">
                        <div className="flex justify-center items-center bg-background mx-auto mb-4 border border-border rounded-full size-16">
                            <TagUser className="size-7 md:size-7.5 xl:size-8 text-primary" />
                        </div>
                        <h2 className="mb-2 font-bold text-lg md:text-xl xl:text-2xl montserrat">Choose Your Username</h2>
                        <p className="-mt-2 text-muted-foreground">Pick a unique username for your Knester profile</p>
                    </div>
                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="relative flex flex-col gap-y-1">
                            <label htmlFor="username" className='font-medium cursor-pointer'>Username</label>
                            <input type="text" id="username" className='bg-background px-4 py-2.5 border border-border rounded-2xl focus:outline-none duration-300 focus:caret-primary' onChange={handleUsername} value={enteredUsername} title="Please enter only letters, numbers, and underscores (spaces will be replaced with underscores)" minLength={2} placeholder="Inclusive.Iguana" required />
                            <div className="right-3 bottom-4 absolute cursor-pointer transform">
                                {(isLoading) && <Loader className="size-4 md:size-4.5 xl:size-5 text-foreground animate-spin" />}
                            </div>
                        </div>
                        {isLoading && <p className='text-muted-foreground smallText'>Checking username availability...</p>}
                        {isError &&
                            <div className='bg-red-100 my-4 p-4 rounded-xl text-red-500 capitalize'>
                                <p>{error.message === "Request failed with status code 409"
                                    ? "Username already chosen, kindly try a new one"
                                    : "Sorry, we couldn't validate your username now, kindly try again."
                                }</p>
                                <div className='flex gap-x-2'>{generatedUsernames.map((username) => (
                                    <p key={username} className='font-medium'>{username}</p>
                                ))}
                                </div>
                            </div>
                        }
                        {data &&
                            <div className="my-4">
                                <div className='bg-green-100 p-4 rounded-xl text-green-500 capitalize'>
                                    <CircleCheckBig className='inline mr-0.5 size-4 md:size-4.5 xl:size-5' />
                                    {data.message} press continue to enter password.
                                </div>
                                <Button type="submit" text="Continue" loadingText={"Validating Invitation..."} disabled={validateInvite.isPending || (isLoading || isError)} loading={validateInvite.isPending} icon={<LoginCurve className='size-4 md:size-4.5 xl:size-5' />} variant='primary' />
                            </div>
                        }
                    </form>
                </div>}
            {passwordPage &&
                <div className="bg-accent/20 dark:bg-accent/5 shadow mx-auto p-4 md:p-6 xl:p-8 border border-border rounded-2xl w-full max-w-2xl">
                    <div className="mb-8 text-center">
                        <div className="flex justify-center items-center bg-background mx-auto mb-4 border border-border rounded-full size-16">
                            <Lock className="size-7 md:size-7.5 xl:size-8 text-primary" />
                        </div>
                        <h2 className="mb-2 font-bold text-lg md:text-xl xl:text-2xl montserrat">Secure Your Account</h2>
                        <p className="-mt-2 text-muted-foreground">Create a strong password to protect your account</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col gap-y-1">
                            <label htmlFor="password" className='font-medium cursor-pointer'>
                                Password
                            </label>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'} id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-background px-4 py-2.5 border border-border rounded-2xl focus:outline-none w-full duration-300 focus:caret-primary" placeholder="Enter your password" required />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="top-1/2 right-3 absolute text-foreground hover:text-gray-600 -translate-y-1/2 cursor-pointer transform">
                                    {showPassword ? <EyeSlash className="size-4 md:size-4.5 xl:size-5" /> : <Eye className="size-4 md:size-4.5 xl:size-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block mb-1 font-medium cursor-pointer">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="bg-background px-4 py-2.5 border border-border rounded-2xl focus:outline-none w-full duration-300 focus:caret-primary" placeholder="Confirm your password" required />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="top-1/2 right-3 absolute text-foreground hover:text-gray-600 -translate-y-1/2 cursor-pointer transform">
                                    {showConfirmPassword ? <EyeSlash className="size-4 md:size-4.5 xl:size-5" /> : <Eye className="size-4 md:size-4.5 xl:size-5" />}
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
                                    <div key={`passwordRequirements_${index}`} className="flex items-center space-x-2">
                                        <TickCircle className={`size-4 ${req.met ? 'text-green-500' : 'text-gray-300'}`} />
                                        <span className={`${req.met ? 'text-green-600' : 'text-gray-500'}`}>
                                            {req.text}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <Button type="submit" text="Create Account" loadingText={"Setting up encryption..."} disabled={createUser.isPending || isGeneratingKeys || !allRequirementsMet || !passwordsMatch} loading={createUser.isPending || isGeneratingKeys} icon={<UserCirlceAdd className='size-4 md:size-4.5 xl:size-5' />} variant='primary' />
                    </form>
                </div>
            }
            {recoveryPage &&
                <div className="bg-accent/20 dark:bg-accent/5 shadow mx-auto p-4 md:p-6 xl:p-8 border border-border rounded-2xl w-full max-w-2xl">
                    <div className="mb-8 text-center">
                        <div className="flex justify-center items-center bg-background mx-auto mb-4 border border-border rounded-full size-16">
                            <ShieldSecurity className="size-7 md:size-7.5 xl:size-8 text-amber-500" />
                        </div>
                        <h2 className="font-bold text-lg md:text-xl xl:text-2xl montserrat">Secure Your Account</h2>
                        <p className="text-muted-foreground">Your recovery phrase is the only way to restore access to your account if you lose your password.</p>
                    </div>
                    <div className="bg-amber-50 mb-6 p-4 border border-amber-200 rounded-2xl">
                        <div className="flex items-start space-x-3">
                            <Danger className="flex-shrink-0 mt-0.5 size-4 md:size-4.5 xl:size-5 text-amber-600" />
                            <div>
                                <p className="mb-1 font-semibold text-amber-600 dark:text-amber-800">Important Security Notice</p>
                                <ul className="space-y-1 pl-4 text-amber-500 dark:text-amber-700 list-disc">
                                    <li> Store this phrase in a safe, offline location</li>
                                    <li> Never share it with anyone or store it digitally</li>
                                    <li> You'll need it to recover your account if you lose access</li>
                                    <li> You'll need it to recover your messages if you login in a new browser</li>
                                    <li className='uppercase'> Knester cannot recover your account without this phrase</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='bg-background p-4 md:p-6 xl:p-8 border border-border rounded-2xl'>
                        <p className='my-2 font-medium text-base md:text-lg xl:text-xl text-center montserrat'>{recoveryPhrase}</p>
                        <Button type="button" onClick={() => handleCopy(recoveryPhrase)} text={copied ? 'Copied!' : 'Copy Recovery Phrase'} disabled={false} loading={false} icon={<TickCircle className="size-4 md:size-4.5 xl:size-5" />} variant='success' />
                    </div>
                    {copied && <Link to={"/onboarding"} className='block bg-primary hover:bg-accent my-4 p-3 rounded-2xl w-full text-center'>Continue</Link>}
                </div>
            }
        </>
    );
}

export default InviteValidation;