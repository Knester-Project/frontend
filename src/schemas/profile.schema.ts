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