import { z } from "zod";

export const loginSchema = z.object({
    username: z.string({
        error: (issue) => issue.input === undefined
            ? "This field is required"
            : "Not a string"
    }).min(5, { error: "Username must be up to 5 Characters." }),

    password: z.string({
        error: (issue) => issue.input === undefined
            ? "This field is required"
            : "Not a string"
    }).min(8, { error: "Password too short - should be 8 Chars minimum" }),

    device: z.object({
        ua: z.string().optional(),
        type: z.enum(["desktop", "mobile", "tablet", "console", "embedded", "smarttv", "wearable", "xr"]).optional(),
        os: z.string().optional(),
        browser: z.string().optional()
    }),
})

export type AuthInput = z.infer<typeof loginSchema>