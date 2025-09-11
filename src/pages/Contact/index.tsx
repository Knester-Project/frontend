import { useState } from "react";

//Components
import Input from "@/components/Input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import Button from "@/components/Button";

//Icons
import { Mail, Timer, MessageCircle, Send } from "lucide-react";


const Index = () => {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        inquiryType: "",
        message: "",
    })

    //Functions
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

    return (
        <main>
            <section className="py-16">
                <div className="mb-8 text-center">
                    <h2 className="mb-4 font-bold text-xl md:text-2xl xl:text-3xl text-balance">Get in Touch</h2>
                    <p className="text-muted text-pretty">Have questions or feedback? We'd love to hear from you.</p>
                </div>
                <div className="items-center gap-5 grid sm:grid-cols-2 md:grid-cols-3 mb-8">
                    <Card className="bg-accent/20 dark:bg-accent/5 border-border text-center">
                        <CardContent>
                            <Mail className="mx-auto mb-2 size-6 md:size-7 xl:size-8 text-primary" />
                            <h3 className="mb-1 font-semibold text-card-foreground">Email</h3>
                            <p className="text-muted text-sm">hello@knester.com</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-accent/20 dark:bg-accent/5 border-border text-center">
                        <CardContent>
                            <MessageCircle className="mx-auto mb-2 size-6 md:size-7 xl:size-8 text-primary" />
                            <h3 className="mb-1 font-semibold text-card-foreground">WhatsApp</h3>
                            <p className="text-muted text-sm">+1 (555) 123-4567</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-accent/20 dark:bg-accent/5 border-border text-center">
                        <CardContent>
                            <Timer className="mx-auto mb-2 size-6 md:size-7 xl:size-8 text-primary" />
                            <h3 className="mb-1 font-semibold text-card-foreground">Response Time</h3>
                            <p className="text-muted text-sm">Within 24 hours</p>
                        </CardContent>
                    </Card>
                </div>
                <Card className="bg-accent/20 dark:bg-accent/5 shadow-lg border-border">
                    <CardHeader>
                        <CardTitle>Send us a Message</CardTitle>
                        <CardDescription className="text-muted">Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-y-3">
                            <div className="flex sm:flex-row flex-col gap-3">
                                <div className="w-full sm:w-1/2">
                                    <Input type="text" name="name" label="Name" placeholder="Your Name" value={formData.name} onChange={handleInputChange} required />
                                </div>
                                <div className="w-full sm:w-1/2">
                                    <Input type="email" name="email" label="Email Address" placeholder="Your@email.com" value={formData.email} onChange={handleInputChange} required />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="inquiryType" className="mb-2 text-foreground">
                                    Inquiry Type<span className="-mr-1 text-red-500">*</span>
                                </Label>
                                <Select onValueChange={handleSelectChange}>
                                    <SelectTrigger className="bg-background py-3 border-border w-full text-muted">
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
                            <div>
                                <Label htmlFor="message" className="mb-2 text-foreground">
                                    Message<span className="-mr-1 text-red-500">*</span>
                                </Label>
                                <textarea name="message" className="bg-background p-2 px-4 py-3 border border-border rounded-lg focus:outline-none w-full h-24 placeholder:text-muted text-sm md:text-base xl:text-lg duration-300 focus:caret-primary resize-none" value={formData.message} onChange={handleInputChange} placeholder="Tell us how we can help you"></textarea>
                            </div>
                            <Button text="Send Message" loadingText="Sending..." disabled={false} loading={false} classNames="rounded-lg" icon={<Send className="size-4 md:size-5 xl:size-6" />} />
                        </div>
                    </CardContent>
                </Card>
            </section>
        </main>
    );
}

export default Index;