import { useState } from "react";
import { Link } from "@tanstack/react-router";

//Components
import Input from "@/components/Input";
import Button from "@/components/Button";

//Icons
import { CirclePlus } from "lucide-react";

const Index = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: ""
    })

    //Functions
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }
    return (
        <main>
            <section className="bg-accent/20 dark:bg-accent/5 shadow-lg p-4 md:p-6 xl:p-8 border border-border rounded-2xl">
                <div className="mb-8 text-center">
                    <h2 className="mb-4 font-bold text-xl md:text-2xl xl:text-3xl text-balance">Join Our List</h2>
                    <p className="text-muted text-pretty">Stay updated with the latest news and opportunities. We'll never spam you.</p>
                </div>
                <div className="flex flex-col gap-y-3 mt-4">
                    <Input type="text" name="name" label="Name" placeholder="Your Name" value={formData.name} onChange={handleInputChange} required />
                    <Input type="email" name="email" label="Email Address" placeholder="Your@email.com" value={formData.email} onChange={handleInputChange} required />
                    <Button text="Join List" loadingText="Joining..." disabled={false} loading={false} classNames="rounded-lg" icon={<CirclePlus className="size-4 md:size-5 xl:size-6" />} />
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