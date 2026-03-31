import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_MEDIA_TYPES = ["image/jpeg", "image/png", "image/webp", "image/apng", "image/gif", "video/mp4"];

export const commentSchema = z.object({
    content: z.string().min(1, "Comment cannot be empty").max(200, "Max 200 characters"),
    media: z
        .any()
        .refine((files) => !files?.[0] || files?.[0]?.size <= MAX_FILE_SIZE, `Max size is 10MB.`)
        .refine(
            (files) => !files?.[0] || ACCEPTED_MEDIA_TYPES.includes(files?.[0]?.type),
            "Only .jpg, .png, .webp and .mp4 are supported."
        )
        .optional(),
});

export type CommentInput = z.infer<typeof commentSchema>