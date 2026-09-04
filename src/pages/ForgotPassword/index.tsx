import { useState } from "react";
import { sileo } from "sileo";
import { useNavigate } from "@tanstack/react-router";

// Icons
import { Eye, EyeSlash, Key, TickCircle, Unlock } from "iconsax-reactjs";
import { useForgotPassword } from "@/services/userMutations";
import Button from "@/components/common/Button";

const defaultState = {
    username: "",
    recoveryUsername: "",
    newPassword: "",
}

const Index = () => {

    const [formData, setFormData] = useState(defaultState);
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const navigate = useNavigate()

    // Functions
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const hasAllValues = Object.values(formData)
        .every((v) => (typeof v === "string" ? v.trim() !== "" : v !== null && v !== undefined));

    const reset = () => {
        setFormData(defaultState)
    }

    const passwordRequirements = [
        { text: 'At least 8 characters', met: formData.newPassword.length >= 8 },
        { text: 'Contains uppercase letter', met: /[A-Z]/.test(formData.newPassword) },
        { text: 'Contains lowercase letter', met: /[a-z]/.test(formData.newPassword) },
        { text: 'Contains number', met: /\d/.test(formData.newPassword) },
        { text: 'Contains special character', met: /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) }
    ];

    const allRequirementsMet = passwordRequirements.every(req => req.met);

    const recoverPassword = useForgotPassword();
    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!hasAllValues) return sileo.error({
            title: "Missing Field",
            description: "Kindly fill all required fields before submitting"
        })

        if (!allRequirementsMet)
            return sileo.error({ title: "Recovery failed.", description: "Your Password Recovery Attempt Failed, Please check your credentials." });

        recoverPassword.mutate(formData, {
            onSuccess: (response) => {
                reset();
                sileo.success({ title: "Password Recovery Successful", description: response.message });
                navigate({ to: "/login" });
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => {
                const message = error?.response?.data?.message || "Your Login Attempt Failed, Please check your credentials.";
                sileo.error({ title: "Authentication Failed", description: message });
            },
        });
    }

    return (
        <main className="bg-accent/20 dark:bg-accent/5 shadow mx-auto p-4 md:p-6 xl:p-8 border border-border rounded-2xl w-full max-w-2xl">
            <div className="mb-8 text-center">
                <div className="flex justify-center items-center bg-background mx-auto mb-4 border border-border rounded-full size-16">
                    <Key className="size-7 md:size-7.5 xl:size-8 text-primary" />
                </div>
                <h2 className="mb-2 font-bold text-lg md:text-xl xl:text-2xl montserrat">Forgot Password</h2>
                <p className="-mt-2 text-muted-foreground">To Recover Your Account, Kindly enter your Username, Recovery Phrase, and New Password.</p>
            </div>
            <form onSubmit={onSubmit} className="space-y-6">
                {/* Username */}
                <div className="relative flex flex-col gap-y-1">
                    <label htmlFor="username" className='font-medium cursor-pointer'>Username</label>
                    <input type="text" id="username" name="username" className='bg-background px-4 py-2.5 border border-border rounded-2xl focus:outline-none text-sm md:text-base xl:text-lg duration-300 focus:caret-primary' onChange={handleInputChange} value={formData.username} title="Please enter only letters, numbers, and underscores (spaces will be replaced with underscores)" minLength={5} placeholder="Inclusive.Iguana" required />
                </div>

                {/* Recovery Username */}
                <div className="relative flex flex-col gap-y-1">
                    <label htmlFor="recoveryUsername" className='font-medium cursor-pointer'>Recovery Phrase</label>
                    <input type="text" id="recoveryUsername" name="recoveryUsername" className='bg-background px-4 py-2.5 border border-border rounded-2xl focus:outline-none text-sm md:text-base xl:text-lg duration-300 focus:caret-primary' onChange={handleInputChange} value={formData.recoveryUsername} title="Enter your recovery username" minLength={5} placeholder="Disquieting Bazaar" required />
                </div>

                {/* New Password */}
                <div className="flex flex-col gap-y-1">
                    <label htmlFor="newPassword" className='font-medium cursor-pointer'>
                        Password
                    </label>
                    <div className="relative">
                        <input type={showPassword ? 'text' : 'password'} id="newPassword" name="newPassword" value={formData.newPassword} onChange={handleInputChange} className="bg-background px-4 py-2.5 border border-border rounded-2xl focus:outline-none w-full text-sm md:text-base xl:text-lg duration-300 focus:caret-primary" placeholder="Enter your new password" required />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="top-1/2 right-3 absolute text-foreground hover:text-gray-600 -translate-y-1/2 cursor-pointer transform">
                            {showPassword ? <EyeSlash className="size-4 md:size-4.5 xl:size-5" /> : <Eye className="size-4 md:size-4.5 xl:size-5" />}
                        </button>
                    </div>
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

                <Button type="button" text="Recover Account" loadingText={"Recovering..."} disabled={recoverPassword.isPending} loading={recoverPassword.isPending} icon={<Unlock className='size-4 md:size-4.5 xl:size-5' />} variant='primary' />

            </form>
        </main>
    );
}

export default Index;