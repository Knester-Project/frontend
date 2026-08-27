import z from "zod";

export const metaSchema = z.object({
    name: z.preprocess((v) => (v === "" ? undefined : v),
        z.string().trim().min(2, { error: "Name must be at least 2 characters" }).max(40, { error: "Name is too long" }).optional()
    ),
    avatar: z.url({ error: "Avatar must be a valid image URL" }).or(z.literal("")).optional(),
    type: z.enum(["public", "private"]).optional(),
    messageTtl: z.coerce.number().int().min(86400).max(604800).optional(),
});

export type MetaInput = z.infer<typeof metaSchema>