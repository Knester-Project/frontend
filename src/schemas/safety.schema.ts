import { z } from "zod";

const SocialMediaSchema = z.object({
    platform: z.string({
        error: (issue) => issue.input === undefined
            ? "The social media platform is required"
            : "Not a string"
    }),
    username: z.string({
        error: (issue) => issue.input === undefined
            ? "The username is required"
            : "Not a string"
    }),
    profileLink: z.url().optional(),
});

const mediaItemSchema = z.object({
    url: z.url("Invalid media URL"),
    key: z.string().min(1, "Media key is required"),
});

export const createSafetyPostSchema = z.object({
    dateOfIncident: z.string({ error: "Time must be in iso format" }),
    location: z.object({
        state: z.string({
            error: (issue) => issue.input === undefined
                ? "The state is required"
                : "Not a string"
        }),
        city: z.string({
            error: (issue) => issue.input === undefined
                ? "The city is required"
                : "Not a string"
        }),
        town: z.string({
            error: (issue) => issue.input === undefined
                ? "The town is required"
                : "Not a string"
        }),
        street: z.string().optional()
    }),
    content: z.string().min(200, "Too short! Minimum of two hundred (200) chars").max(800, "Not more than eight hundred (800) chars."),
    media: z.array(mediaItemSchema)
        .min(2, "Minimum of two (2) media is allowed")
        .max(8, "Maximum of eight (8) media is allowed").optional(),
    fullName: z.string(),
    phoneNumbers: z.array(z.string()),
    socialMedia: z.array(SocialMediaSchema),
})


export type SafetyInput = z.infer<typeof createSafetyPostSchema>