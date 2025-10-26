import type { ZodError } from 'zod';

export const flattenZodErrors = (error: ZodError): Record<string, string[]> => {
    const fieldErrors: Record<string, string[]> = {};

    for (const issue of error.issues) {
        const key = issue.path.join('.') || 'form';
        if (!fieldErrors[key]) fieldErrors[key] = [];
        fieldErrors[key].push(issue.message);
    }

    return fieldErrors;
}
