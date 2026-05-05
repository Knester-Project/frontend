import { z } from "zod";

export const newAdvertSchema = z.object({
    title: z.string().min(5, { error: "Title must be upto 5 chars" }).max(150, { error: "Title must not be more than 150 chars" }),
    description: z.string()
        .min(10, { error: "Description must be up to 10 chars" })
        .max(500, { error: "Description must not be more than 500 chars" }),
    type: z.enum(["good", "service"]),
    averagePrice: z.number().int().min(1, { error: "Minimum Average Price is 1 USD" }),
    status: z.enum(["active", "paused", "sold_out"])
})

export type NewAdvertPayload = z.infer<typeof newAdvertSchema>;