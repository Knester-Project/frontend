import { useState, type ChangeEvent, type FormEvent } from "react";
import { sileo } from "sileo";
import { Link } from "@tanstack/react-router";

// Hooks, Stores, Utils, Services and Libs
import { useCreateUser, useUpdateUser, useValidateUser } from "@/services/userMutations";
import { useCheckUsername } from "@/services/userQueries";
import { generateCustomUsernames } from "@/utils/generate";
import { generateIdentityKeyPair, exportKeyToJwk } from "@/utils/chat/e2ee";
import { lockPrivateKey } from "@/utils/vault";
import { db } from "@/lib/db";

// UIs
import Button from "@/components/common/Button";

// Icons
import { CircleCheckBig, Loader } from "lucide-react";
import { TagUser, Eye, EyeSlash, Lock, TickCircle, ShieldSecurity, UserCirlceAdd, Danger, LoginCurve } from "iconsax-reactjs";

type Page = "username" | "password" | "recovery";

const InviteValidation = ({ invitationCode }: { invitationCode: string }) => {

    // Page state
    const [page, setPage] = useState<Page>("username");

    // Username / invitation
    const [enteredUsername, setEnteredUsername] = useState("");
    const [referrer, setReferrer] = useState("");

    const { data, isLoading, isError, error } = useCheckUsername(enteredUsername);

    const generatedUsernames = generateCustomUsernames(enteredUsername);

    // Password
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Recovery
    const [recoveryPhrase, setRecoveryPhrase] = useState("");
    const [copied, setCopied] = useState(false);

    // This controls the E2EE preparation stage.
    const [isGeneratingKeys, setIsGeneratingKeys] = useState<boolean>(false);

    // Mutations
    const validateInvite = useValidateUser();
    const createUser = useCreateUser();
    const updateUser = useUpdateUser();

    // Password requirements
    const passwordRequirements = [
        {
            text: "At least 8 characters",
            met: password.length >= 8,
        },
        {
            text: "Contains uppercase letter",
            met: /[A-Z]/.test(password),
        },
        {
            text: "Contains lowercase letter",
            met: /[a-z]/.test(password),
        },
        {
            text: "Contains number",
            met: /\d/.test(password),
        },
        {
            text: "Contains special character",
            met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        },
    ];

    const allRequirementsMet = passwordRequirements.every((requirement) => requirement.met);

    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

    // Username formatting
    const handleUsername = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const formattedValue = value.replace(/ /g, ".").replace(/[^A-Za-z0-9_.]/g, "");
        setEnteredUsername(formattedValue);
    };

    // Invitation validation
    const handleInvitationSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (invitationCode.length !== 10) {
            sileo.error({ title: "Invalid Referral Link" });
            return;
        }

        if (!enteredUsername.trim()) {
            sileo.error({ title: "Please enter a username" });
            return;
        }

        if (isLoading || isError || !data) {
            return;
        }

        validateInvite.mutate({ invitationCode }, {
            onSuccess: (response) => {
                setReferrer(response.data.referrer);
                sileo.success({ title: response.data.message || "Referral Validation was successful!", });
                setPage("password");
            },

            onError: (error: unknown) => {
                const message = (error as { response?: { data?: { message?: string; } } })?.response?.data?.message ||
                    "Referral Validation failed. Kindly restart the process.";
                sileo.error({ title: message });
            },
        }
        );
    };

    // Create account + generate E2EE keys + update account

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!allRequirementsMet) {
            sileo.error({ title: "Please satisfy all password requirements.", });
            return;
        }

        if (!passwordsMatch) {
            sileo.error({ title: "Passwords do not match." });
            return;
        }

        if (!referrer) {
            sileo.error({ title: "Your invitation session has expired. Please restart." });
            return;
        }

        setIsGeneratingKeys(true);

        try {
            // Create the user first.
            sileo.show({ title: "Creating your account..." });

            createUser.mutate({
                username: enteredUsername,
                password,
                referrer,
            }, {
                onSuccess: async (response) => {
                    const phrase = response.data.recoveryUsername;

                    if (!phrase) {
                        sileo.error({ title: "Account created, but your recovery phrase could not be generated." });
                        setIsGeneratingKeys(false);
                        return;
                    }
                    setRecoveryPhrase(phrase);

                    try {
                        // Generate E2EE identity keys.
                        sileo.show({ title: "Generating Secure E2EE Keys..." });
                        const keyPair = await generateIdentityKeyPair();

                        // Export keys to JWK.
                        const publicJwk = await exportKeyToJwk(keyPair.publicKey);
                        const privateJwk = await exportKeyToJwk(keyPair.privateKey);

                        // Encrypt the PRIVATE key with the recovery
                        sileo.show({ title: "Securing your private key..." });
                        const encryptedVault = await lockPrivateKey(privateJwk, phrase)

                        // Save raw private key locally.
                        await db.identity.put({
                            id: "me",
                            privateKeyJwk: privateJwk,
                            publicKeyJwk: publicJwk,
                        });

                        // Upload public key + encrypted vault.
                        sileo.show({ title: "Finalizing account security..." })
                        updateUser.mutate({
                            publicKey: {
                                crv: publicJwk.crv!,
                                ext: publicJwk.ext!,
                                key_ops: publicJwk.key_ops!,
                                kty: publicJwk.kty!,
                                x: publicJwk.x!,
                                y: publicJwk.y!,
                            },

                            encryptedVault: {
                                vaultData: encryptedVault.vaultData,
                                salt: encryptedVault.salt,
                                iv: encryptedVault.iv,
                            },
                        },
                            {
                                onSuccess: () => {
                                    setIsGeneratingKeys(false);
                                    setPage("recovery");
                                    sileo.success({ title: "Account and Security Keys created successfully!" });
                                },

                                onError: (error: unknown) => {
                                    console.error("Failed to upload E2EE keys:", error);
                                    sileo.error({ title: "Your account was created, but we couldn't finish setting up your security keys. Please try again." });
                                    setIsGeneratingKeys(false);
                                },
                            }
                        );
                    } catch (error) {
                        console.error("E2EE setup failed:", error);
                        sileo.error({ title: "Encryption failed on your device. Ensure you are using a modern browser." });
                        setIsGeneratingKeys(false);
                    }
                },

                onError: (error: unknown) => {
                    const message = (error as { response?: { data?: { message?: string; } } })?.response?.data?.message || "Account creation failed. Kindly restart the process."
                    sileo.error({ title: message });
                    setIsGeneratingKeys(false);
                },
            }
            );
        } catch (error) {
            console.error("Unexpected account creation error:", error);
            sileo.error({ title: "Something went wrong while creating your account." });
            setIsGeneratingKeys(false);
        }
    };

    // Copy recovery phrase

    const handleCopy = async () => {
        if (!recoveryPhrase) return;

        try {
            await navigator.clipboard.writeText(recoveryPhrase);
            setCopied(true);
            sileo.success({ title: "Your Recovery Phrase Was Copied Successfully." });
        } catch (error) {
            console.error("Failed to copy recovery phrase:", error);
            sileo.error({ title: "Unable to copy the recovery phrase. Please copy it manually." });
        }
    };

    return (
        <div className="w-full">
            {/* Username Validation Page */}
            {page === "username" && (
                <div className="bg-accent/20 dark:bg-accent/5 shadow mx-auto p-4 md:p-6 xl:p-8 border border-border rounded-2xl w-full max-w-2xl">
                    <div className="mb-8 text-center">
                        <div className="flex justify-center items-center bg-background mx-auto mb-4 border border-border rounded-full size-16">
                            <TagUser className="size-7 md:size-7.5 xl:size-8 text-primary" />
                        </div>

                        <h2 className="mb-2 font-bold text-lg md:text-xl xl:text-2xl montserrat">
                            Choose Your Username
                        </h2>

                        <p className="-mt-2 text-muted-foreground">
                            Pick a unique username for your Knester profile
                        </p>
                    </div>

                    <form onSubmit={handleInvitationSubmit} className="space-y-6">
                        <div className="relative flex flex-col gap-y-1">
                            <label htmlFor="username" className="font-medium cursor-pointer">
                                Username
                            </label>

                            <input type="text" id="username" value={enteredUsername} onChange={handleUsername} minLength={2} placeholder="Inclusive.Iguana" required
                                className="bg-background px-4 py-2.5 border border-border rounded-2xl focus:outline-none w-full duration-300 focus:caret-primary"
                            />

                            {isLoading && (
                                <div className="top-1/2 right-3 absolute -translate-y-1/2">
                                    <Loader className="size-4 md:size-4.5 xl:size-5 text-foreground animate-spin" />
                                </div>
                            )}
                        </div>

                        {isLoading && (
                            <p className="text-muted-foreground smallText">
                                Checking username availability...
                            </p>
                        )}

                        {isError && (
                            <div className="bg-red-100 my-4 p-4 rounded-xl text-red-500">
                                <p>
                                    {error.message ===
                                        "Request failed with status code 409"
                                        ? "Username already chosen, kindly try a new one"
                                        : "Sorry, we couldn't validate your username now, kindly try again."}
                                </p>
                                {generatedUsernames.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {generatedUsernames.map(
                                            (username) => (
                                                <button key={username} type="button" onClick={() => setEnteredUsername(username)} className="font-medium hover:underline">
                                                    {username}
                                                </button>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {data && (
                            <div className="my-4">
                                <div className="bg-green-100 p-4 rounded-xl text-green-500">
                                    <CircleCheckBig className="inline mr-0.5 size-4 md:size-4.5 xl:size-5" />
                                    {data.message} Press continue to
                                    enter your password.
                                </div>
                                <Button type="submit" text="Continue" loadingText="Validating Invitation..." disabled={validateInvite.isPending || isLoading || isError} loading={validateInvite.isPending} icon={<LoginCurve className="size-4 md:size-4.5 xl:size-5" />} variant="primary" />
                            </div>
                        )}
                    </form>
                </div>
            )}

            {/* Password Page */}
            {page === "password" && (
                <div className="bg-accent/20 dark:bg-accent/5 shadow mx-auto p-4 md:p-6 xl:p-8 border border-border rounded-2xl w-full max-w-2xl">
                    <div className="mb-8 text-center">
                        <div className="flex justify-center items-center bg-background mx-auto mb-4 border border-border rounded-full size-16">
                            <Lock className="size-7 md:size-7.5 xl:size-8 text-primary" />
                        </div>

                        <h2 className="mb-2 font-bold text-lg md:text-xl xl:text-2xl montserrat">
                            Secure Your Account
                        </h2>

                        <p className="-mt-2 text-muted-foreground">
                            Create a strong password to protect your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex flex-col gap-y-1">
                            <label htmlFor="password" className="font-medium cursor-pointer">
                                Password
                            </label>

                            <div className="relative">
                                <input type={showPassword ? "text" : "password"} id="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" className="bg-background px-4 py-2.5 border border-border rounded-2xl focus:outline-none w-full duration-300 focus:caret-primary" placeholder="Enter your password" required />
                                <button type="button" onClick={() => setShowPassword((current) => !current)} className="top-1/2 right-3 absolute text-foreground hover:text-gray-600 -translate-y-1/2 cursor-pointer" >
                                    {showPassword ? (
                                        <EyeSlash className="size-4 md:size-4.5 xl:size-5" />
                                    ) : (
                                        <Eye className="size-4 md:size-4.5 xl:size-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block mb-1 font-medium cursor-pointer">
                                Confirm Password
                            </label>

                            <div className="relative">
                                <input type={showConfirmPassword ? "text" : "password"} id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} autoComplete="new-password" className="bg-background px-4 py-2.5 border border-border rounded-2xl focus:outline-none w-full duration-300 focus:caret-primary" placeholder="Confirm your password" required />

                                <button type="button" onClick={() => setShowConfirmPassword((current) => !current)} className="top-1/2 right-3 absolute text-foreground hover:text-gray-600 -translate-y-1/2 cursor-pointer">
                                    {showConfirmPassword ? (
                                        <EyeSlash className="size-4 md:size-4.5 xl:size-5" />
                                    ) : (
                                        <Eye className="size-4 md:size-4.5 xl:size-5" />
                                    )}
                                </button>
                            </div>

                            {confirmPassword &&
                                !passwordsMatch && (
                                    <p className="mt-2 text-red-500">
                                        Passwords do not match
                                    </p>
                                )}
                            {passwordsMatch && (
                                <p className="mt-2 text-green-500">
                                    ✓ Passwords match
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <p className="font-medium montserrat">
                                Password Requirements:
                            </p>

                            <div className="space-y-1">
                                {passwordRequirements.map((req) => (
                                    <div key={req.text} className="flex items-center space-x-2">
                                        <TickCircle className={`size-4 ${req.met ? "text-green-500" : "text-gray-300"}`} />
                                        <span className={req.met ? "text-green-600" : "text-gray-500"} >
                                            {req.text}
                                        </span>
                                    </div>))}
                            </div>
                        </div>
                        {allRequirementsMet && passwordsMatch &&
                            <Button type="submit" text="Create Account" loadingText="Setting up encryption..." disabled={createUser.isPending || updateUser.isPending || isGeneratingKeys} loading={createUser.isPending || updateUser.isPending || isGeneratingKeys} icon={<UserCirlceAdd className="size-4 md:size-4.5 xl:size-5" />} variant="primary" />
                        }
                    </form>
                </div>
            )}

            {/* Recovery Page */}
            {page === "recovery" && (
                <div className="bg-accent/20 dark:bg-accent/5 shadow mx-auto p-4 md:p-6 xl:p-8 border border-border rounded-2xl w-full max-w-2xl">
                    <div className="mb-8 text-center">
                        <div className="flex justify-center items-center bg-background mx-auto mb-4 border border-border rounded-full size-16">
                            <ShieldSecurity className="size-7 md:size-7.5 xl:size-8 text-amber-500" />
                        </div>

                        <h2 className="font-bold text-lg md:text-xl xl:text-2xl montserrat">
                            Secure Your Account
                        </h2>

                        <p className="text-muted-foreground">
                            Your recovery phrase is the only way to restore access to your account if you lose your password.
                        </p>
                    </div>

                    <div className="bg-amber-50 mb-6 p-4 border border-amber-200 rounded-2xl">
                        <div className="flex items-start space-x-3">
                            <Danger className="flex-shrink-0 mt-0.5 size-4 md:size-4.5 xl:size-5 text-amber-600" />

                            <div>
                                <p className="mb-1 font-semibold text-amber-600 dark:text-amber-800">
                                    Important Security Notice
                                </p>
                                <ul className="space-y-1 pl-4 text-amber-500 dark:text-amber-700 list-disc">
                                    <li>Store this phrase in a safe,  offline location.</li>
                                    <li>Never share it with anyone or store it digitally.</li>
                                    <li>You&apos;ll need it to recover  your account if you lose  access.</li>
                                    <li>You&apos;ll need it to recover your messages if you log in from a new browser.</li>
                                    <li className="uppercase">Knester cannot recover your account without this phrase.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-background p-4 md:p-6 xl:p-8 border border-border rounded-2xl">
                        <p className="my-2 font-medium text-base md:text-lg xl:text-xl text-center break-words montserrat">
                            {recoveryPhrase}
                        </p>
                        <Button type="button" onClick={handleCopy} text={copied ? "Copied!" : "Copy Recovery Phrase"} disabled={!recoveryPhrase} loading={false} icon={<TickCircle className="size-4 md:size-4.5 xl:size-5" />} variant="success" />
                    </div>

                    {copied && (
                        <Link to="/onboarding" className="block bg-primary hover:bg-accent my-4 p-3 rounded-2xl w-full text-center">
                            Continue
                        </Link>
                    )}
                </div>
            )}
        </div>
    );
};

export default InviteValidation;

