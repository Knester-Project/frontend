import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { sileo } from "sileo";
import { UAParser } from 'ua-parser-js';
import { isDisposableEmail } from "disposable-email-domains-js";

// Services
import { useNewWaitList } from "@/services/userMutations";

// UIs
import Input from "@/components/Input";
import Button from "@/components/Button";

// Icons
import { UserCirlceAdd } from "iconsax-reactjs";


const defaultValue = {
    name: "",
    email: ""
}
const Index = () => {

    const [formData, setFormData] = useState(defaultValue)

    // Functions
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const reset = () => {
        setFormData(defaultValue)
    }

    const parser = new UAParser();
    const result = parser.getResult();

    const device = {
        ua: navigator.userAgent,
        type: result.device.type,
        os: result.os.name,
        browser: result.browser.name,
    };

    const hasAllValues = Object.values(formData)
        .every((v) => (typeof v === "string" ? v.trim() !== "" : v !== null && v !== undefined));

    const newWaitList = useNewWaitList()
    const handleSubmit = () => {

        if (!hasAllValues) return sileo.error({
            title: "Missing Field",
            description: "Kindly fill all required fields before submitting"
        })

        if (formData.email.trim() && isDisposableEmail(formData.email)) return sileo.error({ title: "Not Allowed", description: "Disposable email addresses are not allowed." })

        const payload = { ...formData, device }
        newWaitList.mutate(payload, {
            onSuccess: () => {
                sileo.success({
                    title: "Added to Wait List !!!",
                    description: "You have been successfully added to our wait list. We will notify you when updates are available.",
                });
                reset();
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => {
                const message = error?.response?.data?.message || "Your Wait List Request Failed, Please try again later.";
                sileo.error({ title: "Wait List Request Failed", description: message });
            },
        });
    }

    return (
        <main>
            <section className="bg-accent/20 dark:bg-accent/5 shadow-lg p-4 md:p-6 xl:p-8 border border-border rounded-2xl">
                <div className="mb-8 text-center">
                    <h2 className="mb-4 font-bold text-xl md:text-2xl xl:text-3xl text-balance">Join Our List</h2>
                    <p className="text-muted-foreground">Stay updated with the latest news and opportunities. We'll never spam you.</p>
                </div>
                <div className="flex flex-col gap-y-3 mt-4">

                    <input name="website" className="hidden" />

                    <Input type="text" name="name" label="Name" placeholder="Your Name" value={formData.name} onChange={handleInputChange} required />

                    <Input type="email" name="email" label="Email Address" placeholder="Your@email.com" value={formData.email} onChange={handleInputChange} required />

                    <Button onClick={handleSubmit} text="Join List" loadingText="Joining..." disabled={newWaitList.isPending || !hasAllValues} loading={newWaitList.isPending} classNames="rounded-lg" icon={<UserCirlceAdd className="size-4 md:size-5 xl:size-6" />} />
                </div>
                <p className="mt-4 text-foreground text-xs text-center">
                    By joining, you agree to our{" "}
                    <Link to="/terms" className="text-primary hover:underline">
                        Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                    </Link>
                </p>
            </section>
        </main>
    );
}

export default Index;