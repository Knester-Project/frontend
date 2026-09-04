import { z } from "zod";

export const loginSchema = z.object({
    username: z.string({
        error: (issue) => issue.input === undefined
            ? "This field is required"
            : "Not a string"
    }).min(2, { error: "Username must be up to 2 Characters." }),

    password: z.string({
        error: (issue) => issue.input === undefined
            ? "This field is required"
            : "Not a string"
    }).min(8, { error: "Password too short - should be 8 Chars minimum" }),

    device: z.object({
        ua: z.string().optional(),
        type: z.string().optional(),
        os: z.string().optional(),
        osVersion: z.string().optional(),
        engineName: z.string().optional(),
        engineVersion: z.string().optional(),
        cpuArchitecture: z.string().optional(),
        browserName: z.string().optional(),
        browserVersion: z.string().optional(),
        browserMajor: z.string().optional(),
    }).optional(),
})

export type AuthInput = z.infer<typeof loginSchema>