import z from "zod";

const locationSchema = z.object({
    longitude: z.number(),
    latitude: z.number()
});

export const updateLocationSchema = locationSchema.transform(({ longitude, latitude }) => ({
    location: {
        type: "Point" as const,
        coordinates: [longitude, latitude]
    }
}));

const MAX_FILE_SIZE = 40 * 1024 * 1024; // 40MB

const ACCEPTED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
    "video/mp4",
    "video/webm",
    "video/quicktime",
];

export const mediaFileSchema = z.array(
    z.instanceof(File).refine((file) => file.size <= MAX_FILE_SIZE, "Max 40MB")
        .refine((file) => ACCEPTED_TYPES.includes(file.type), "Unsupported format")
).max(10);

export const editProfileSchema = z.object({
    bio: z.string().min(3).max(300).optional(),
    details: z.array(z.string().min(5).max(20)).max(4).optional(),
    dateOfBirth: z.string().optional(),
    profilePicture: z.string().optional(),
    media: z.array(z.url()).max(10).optional(),
    location: locationSchema.optional(),
    profileLock: z.boolean().optional(),
    chatLock: z.boolean().optional(),
})

export type EditProfileInput = z.infer<typeof editProfileSchema>;