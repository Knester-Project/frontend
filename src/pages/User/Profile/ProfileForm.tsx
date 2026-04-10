import { useForm } from "react-hook-form";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

// Schemas
import { editProfileSchema, type EditProfileInput } from "@/schemas/profile.schema";

const ProfileForm = () => {

    const [files, setFiles] = useState<File[]>([]);

    const { register, handleSubmit, formState: { errors } } = useForm<EditProfileInput>({
        resolver: zodResolver(editProfileSchema), reValidateMode: "onBlur"
    });

    const onSubmit = async (data: EditProfileInput) => {
        try {
            // 1. validate files separately
            // 2. get presigned URLs
            // 3. upload files
            // 4. attach URLs to data.media

            console.log(data);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-card">
            {/* Bio */}
            <div>
                <label className="font-medium text-sm">Bio</label>
                <textarea
                    {...register("bio")}
                    className="bg-background mt-1 p-2 border rounded-md w-full"
                />
                {errors.bio && (
                    <p className="text-destructive text-xs">{errors.bio.message}</p>
                )}
            </div>

            {/* Details */}
            <div>
                <label className="font-medium text-sm">Details</label>
                <input
                    {...register("details.0")}
                    placeholder="Detail 1"
                    className="input"
                />
                <input {...register("details.1")} placeholder="Detail 2" className="input" />
            </div>

            {/* Date of Birth */}
            <div>
                <label className="font-medium text-sm">Date of Birth</label>
                <input
                    type="date"
                    {...register("dateOfBirth")}
                    className="input"
                />
            </div>

            {/* Media Upload */}
            <div>
                <label className="font-medium text-sm">Media (max 10)</label>
                <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={(e) => {
                        if (!e.target.files) return;
                        setFiles(Array.from(e.target.files));
                    }}
                />
            </div>

            {/* Toggles */}
            <div className="flex gap-4">
                <label className="flex items-center gap-2">
                    <input type="checkbox" {...register("profileLock")} />
                    Profile Lock
                </label>

                <label className="flex items-center gap-2">
                    <input type="checkbox" {...register("chatLock")} />
                    Chat Lock
                </label>
            </div>

            {/* Submit */}
            <button type="submit" className="bg-primary py-2 rounded-xl w-full text-primary-foreground">
                Save Changes
            </button>
        </form>
    );
}

export default ProfileForm;