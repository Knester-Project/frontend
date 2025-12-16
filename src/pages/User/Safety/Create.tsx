import { useState } from "react";
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from "framer-motion";

// Schemas and Hooks
import { createSafetyPostSchema, type SafetyInput } from "@/schemas/safety.schema";

// Components
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ErrorText from '@/components/ErrorText';
import StateSelect from "./StateSelect";
import ZodInput from "@/components/ZodInput";

// Icons
import { AlertCircle } from "lucide-react";
import FileUploader from "@/components/FileUploader";


export default function Create() {

    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1);

    const { register, handleSubmit, reset, watch, setValue, formState: { errors } } =
        useForm<SafetyInput>({ resolver: zodResolver(createSafetyPostSchema), reValidateMode: "onBlur", });

    const selectedState = watch("location.state");
    const content = watch("content");
    const phoneNumbers = watch("phoneNumbers") || [""];
    const socialMedia = watch("socialMedia") || [{ platform: "", username: "", profileLink: "" }];

    const addPhone = () => setValue("phoneNumbers", [...phoneNumbers, ""], { shouldValidate: true });
    const removePhone = (i: number) => setValue("phoneNumbers", phoneNumbers.filter((_, idx) => idx !== i), { shouldValidate: true });

    const addSocial = () => setValue("socialMedia", [...socialMedia, { platform: "", username: "", profileLink: "" }], { shouldValidate: true });
    const removeSocial = (i: number) => setValue("socialMedia", socialMedia.filter((_, idx) => idx !== i), { shouldValidate: true });

    // Submit Function
    const onSubmit: SubmitHandler<SafetyInput> = (data) => {
        console.log(data);
        setIsOpen(false);
        reset();
    };

    const stepVariants = {
        hidden: { opacity: 0, x: 30 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -30 }
    };

    return (
        <>
            <Card className="bg-accent/20 dark:bg-accent/5 p-4 md:p-6 xl:p-8 border border-border rounded-2xl w-full">
                <button onClick={() => setIsOpen(true)} className="bg-gradient-to-r from-primary/10 hover:from-primary/20 to-primary/20 hover:to-primary/40 p-4 rounded-lg w-full text-left transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                        <AlertCircle className="size-5 text-primary" />
                        <span>Report a safety incident...</span>
                    </div>
                </button>
            </Card>

            {isOpen && (
                <div className="z-50 fixed inset-0 flex justify-center items-center bg-black/50 p-2">
                    <section className="bg-background py-4 border border-border rounded-2xl w-full max-w-3xl max-h-[85vh] overflow-hidden">
                        <div className="top-0 sticky bg-accent/60 dark:bg-accent/20 p-6 border-border border-b">
                            <h2 className="font-bold text-lg md:text-xl xl:text-2xl montserrat">Report Safety Incident</h2>
                            <p className="mt-1 text-[11px] text-neutral-700 dark:text-neutral-400 md:text-xs xl:text-sm">Help keep our community safe by sharing what happened</p>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="px-6 py-6">
                                <AnimatePresence mode="wait">

                                    {/* STEP 1 - LOCATION */}
                                    {step === 1 && (
                                        <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                                            <p className="font-semibold text-base md:text-lg xl:text-xl">Location Details</p>

                                            <StateSelect value={selectedState} onChange={(v) => setValue("location.state", v, { shouldValidate: true })} error={errors.location?.state?.message} />

                                            <ZodInput type="text" register={register} name="location.city" label="City" required placeholder="Enter City" />
                                            {errors.location?.city && <ErrorText message={errors.location.city.message} />}

                                            <ZodInput type="text" register={register} name="location.town" label="Town" required placeholder="Enter Town" />
                                            {errors.location?.town && <ErrorText message={errors.location.town.message} />}

                                            <ZodInput type="text" register={register} name="location.street" label="Street (Optional)" placeholder="Enter Street" />
                                            {errors.location?.street && <ErrorText message={errors.location.street.message} />}

                                            <div className="flex justify-end">
                                                <Button type="button" onClick={() => setStep(2)}>Next</Button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* STEP 2 - INCIDENT DETAILS */}
                                    {step === 2 && (
                                        <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                                            <p className="font-semibold text-base md:text-lg xl:text-xl">Incident Details</p>

                                            <ZodInput type="datetime-local" register={register} name="dateOfIncident" label="Date of Incident" required />
                                            {errors.dateOfIncident && <ErrorText message={errors.dateOfIncident.message} />}

                                            <label className="block mb-1 font-medium cursor-pointer">Description <span className="text-destructive">*</span></label>
                                            <textarea {...register("content")} rows={4} maxLength={800} className="bg-background px-4 py-3 border border-border focus:border-primary rounded-lg focus:outline-none w-full duration-300 focus:caret-primary resize-none"></textarea>
                                            <p className="text-neutral-500 text-xs">{content?.trim().length || 0}/800</p>
                                            {errors.content && <ErrorText message={errors.content.message} />}

                                            <div className="flex justify-between">
                                                <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                                                <Button type="button" onClick={() => setStep(3)}>Next</Button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* STEP 3 - OFFENDER DETAILS */}
                                    {step === 3 && (
                                        <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="space-y-4">
                                            <p className="font-semibold text-base md:text-lg xl:text-xl">Social Media Details</p>

                                            <ZodInput type="text" register={register} name="fullName" label="Full Name" required placeholder="Enter offender's full name" />
                                            {errors.fullName && <ErrorText message={errors.fullName.message} />}

                                            <div className="space-y-2 max-h-80 overflow-y-auto">
                                                <label className="font-medium text-sm">Phone Numbers</label>
                                                {phoneNumbers.map((_: string, index: number) => (
                                                    <div key={index}>
                                                        <ZodInput type="tel" register={register} name={`phoneNumbers.${index}`} placeholder="Enter phone number" required={index === 0} />
                                                        {index > 0 && <button type="button" className="text-destructive text-sm cursor-pointer" onClick={() => removePhone(index)}>Remove</button>}
                                                    </div>
                                                ))}
                                                <button type="button" className="text-primary hover:text-accent text-sm duration-300 cursor-pointer" onClick={addPhone}>+ Add Phone</button>
                                            </div>

                                            <div className="space-y-3 max-h-36 sm:max-h-56 md:max-h-72 xl:max-h-80 overflow-y-auto">
                                                {socialMedia.map((_, index) => (
                                                    <div key={index} className="relative space-y-3 bg-accent/60 dark:bg-accent/20 p-3 border rounded-xl">
                                                        {index > 0 && (
                                                            <button type="button" className="top-2 right-2 absolute text-destructive text-xs cursor-pointer" onClick={() => removeSocial(index)}>Remove</button>
                                                        )}
                                                        <ZodInput type="text" register={register} name={`socialMedia.${index}.platform`} label="Platform" required placeholder="Instagram" />
                                                        <ZodInput type="text" register={register} name={`socialMedia.${index}.username`} label="Username" required placeholder="@username" />
                                                        <ZodInput type="url" register={register} name={`socialMedia.${index}.profileLink`} label="Profile Link (Optional)" placeholder="https://..." />
                                                    </div>
                                                ))}
                                                <button type="button" className="text-primary hover:text-accent text-sm duration-300 cursor-pointer" onClick={addSocial}>+ Add Social Media</button>
                                            </div>

                                            <div className="flex justify-between mt-4">
                                                <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                                                <Button type="button" onClick={() => setStep(4)}>Next</Button>
                                            </div>
                                        </motion.div>
                                    )}
                                    {/* STEP 4 - OFFENDER IMAGES */}
                                    {step === 4 && (
                                        <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                                            <p className="font-semibold text-base md:text-lg xl:text-xl">Pictures and Videos</p>
                                            <p className="text-[11px] text-yellow-600 dark:text-yellow-400 md:text-xs xl:text-sm">A Minimum of Two (2) and a Maximum of Eight (8) Pictures and Videos</p>
                                            <div className="mt-10">
                                                <FileUploader kind="post" multiple={true} />
                                                <p className="mt-1 text-[11px] text-yellow-600 dark:text-yellow-400 md:text-xs xl:text-sm">Posts with high-quality images are approved more quickly</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </>
    );
}