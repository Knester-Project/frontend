import { useState } from "react";
import { UAParser } from 'ua-parser-js';
import { isDisposableEmail } from "disposable-email-domains-js";

// Services
import { useNewContact } from "@/services/userMutations";

// UIs
import Input from "@/components/common/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Button from "@/components/common/Button";

// Icons
import { sileo } from "sileo";
import { Whatsapp, Send2, Sms, Timer1 } from "iconsax-reactjs";

const defaultState = {
    name: "",
    email: "",
    inquiryType: "",
    message: "",
}

const Index = () => {

    const [formData, setFormData] = useState(defaultState)

    // Functions
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const handleSelectChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            inquiryType: value,
        }))
    }

    const hasAllValues = Object.values(formData)
        .every((v) => (typeof v === "string" ? v.trim() !== "" : v !== null && v !== undefined));

    const reset = () => {
        setFormData(defaultState)
    }

    const parser = new UAParser();
    const result = parser.getResult();

    const device = {
        ua: navigator.userAgent,
        type: result.device.type,
        os: result.os.name,
        osVersion: result.os.version,
        engineName: result.engine.name,
        engineVersion: result.engine.version,
        cpuArchitecture: result.cpu.architecture,
        browserName: result.browser.name,
        browserVersion: result.browser.version,
        browserMajor: result.browser.major,

    };

    const newContact = useNewContact()
    const handleSubmit = () => {

        if (!hasAllValues) return sileo.error({
            title: "Missing Field",
            description: "Kindly fill all required fields before submitting"
        })

        if (formData.email.trim() && isDisposableEmail(formData.email)) return sileo.error({ title: "Not Allowed", description: "Disposable email addresses are not allowed." })

        const payload = { ...formData, device }
        newContact.mutate(payload, {
            onSuccess: () => {
                sileo.success({
                    title: "Contact Request Sent !!!",
                    description: "Kindly wait for at least 7 days before sending another one",
                });
                reset();
            },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onError: (error: any) => {
                const message = error?.response?.data?.message || "Your Contact Request Failed, Please try again later.";
                sileo.error({ title: "Contact Request Failed", description: message });
            },
        });
    }

    return (
        <main className="w-full">
            <div className="mb-8 text-center">
                <h2 className="mb-4 font-bold text-xl md:text-2xl xl:text-3xl text-balance">Get in Touch</h2>
                <p className="text-muted-foreground text-pretty">Have questions or feedback? We'd love to hear from you.</p>
            </div>
            <div className="items-center gap-5 grid sm:grid-cols-2 md:grid-cols-3 mb-8">
                <Card className="bg-accent/20 dark:bg-accent/5 border-border text-center">
                    <CardContent>
                        <Sms className="mx-auto mb-2 size-6 md:size-7 xl:size-8 text-primary" />
                        <h3 className="mb-1 font-semibold text-card-foreground">Email</h3>
                        <p className="text-muted-foreground text-sm">hello@knester.com</p>
                    </CardContent>
                </Card>

                <Card className="bg-accent/20 dark:bg-accent/5 border-border text-center">
                    <CardContent>
                        <Whatsapp className="mx-auto mb-2 size-6 md:size-7 xl:size-8 text-primary" />
                        <h3 className="mb-1 font-semibold text-card-foreground">WhatsApp</h3>
                        <p className="text-muted-foreground text-sm">+1 (555) 123-4567</p>
                    </CardContent>
                </Card>

                <Card className="bg-accent/20 dark:bg-accent/5 border-border text-center">
                    <CardContent>
                        <Timer1 className="mx-auto mb-2 size-6 md:size-7 xl:size-8 text-primary" />
                        <h3 className="mb-1 font-semibold text-card-foreground">Response Time</h3>
                        <p className="text-muted-foreground text-sm">Within 24 hours</p>
                    </CardContent>
                </Card>
            </div>
            <Card className="bg-accent/20 dark:bg-accent/5 shadow-lg border-border">
                <CardHeader>
                    <CardTitle>Send us a Message</CardTitle>
                    <CardDescription className="text-muted-foreground">Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-y-3">
                        <div className="flex sm:flex-row flex-col gap-3">
                            <div className="w-full sm:w-1/2">
                                <Input type="text" name="name" label="Name" placeholder="Your Name" max={200} value={formData.name} onChange={handleInputChange} required />
                            </div>
                            <div className="w-full sm:w-1/2">
                                <Input type="email" name="email" label="Email Address" placeholder="Your@email.com" max={320} value={formData.email} onChange={handleInputChange} required />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="inquiryType" className="mb-2 text-foreground">
                                Inquiry Type<span className="-mr-1 text-red-500">*</span>
                            </Label>
                            <Select onValueChange={handleSelectChange}>
                                <SelectTrigger className="bg-background py-3 border-border w-full text-[11px] text-muted-foreground md:text-xs xl:text-sm">
                                    <SelectValue placeholder="Select inquiry type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="general">General Question</SelectItem>
                                    <SelectItem value="support">Technical Support</SelectItem>
                                    <SelectItem value="partnership">Partnership</SelectItem>
                                    <SelectItem value="feedback">Feedback</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <input name="website" className="hidden" />

                        <div>
                            <Label htmlFor="message" className="mb-2 text-[11px] text-foreground md:text-xs xl:text-sm">
                                Message<span className="-mr-1 text-red-500">*</span>
                            </Label>
                            <textarea name="message" className="bg-background p-2 px-4 py-3 border border-border rounded-lg focus:outline-none w-full h-24 placeholder:text-[11px] placeholder:text-muted-foreground md:placeholder:text-xs text-sm xl:placeholder:text-sm md:text-base xl:text-lg duration-300 focus:caret-primary resize-none" value={formData.message} onChange={handleInputChange} placeholder="Tell us how we can help you"></textarea>
                        </div>
                        <Button type="button" onClick={handleSubmit} text="Send Message" loadingText="Sending..." disabled={newContact.isPending || !hasAllValues} loading={newContact.isPending} classNames="rounded-lg" icon={<Send2 className="size-4 md:size-5 xl:size-6" />} />
                    </div>
                </CardContent>
            </Card>
        </main>
    );
}

export default Index;