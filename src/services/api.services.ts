import { getAxiosAuthInstance } from './config';

// Auth Instances
const axiosUnauthInstance = getAxiosAuthInstance();
const userAxios = getAxiosAuthInstance();


//Schemas
import type { AuthInput } from '@/schemas/auth.schema';

// Get the CSRF Token
export const fetchToken = async () => {
    const response = await axiosUnauthInstance.get(`auth/csrf`);
    return response.data;
}

// Check Username
export const checkUsername = async (username: string) => {
    const response = await axiosUnauthInstance.get(`users/checkUsername/${username}`);
    return response.data;
}

// Validate a User Referral
export const validateInvite = async (data: { invitationCode: string }) => {
    const response = await axiosUnauthInstance.post("users/validate", data);
    return response.data;
};

// Create User
export const createUser = async (data: { username: string, password: string, referrer: string }) => {
    const response = await axiosUnauthInstance.post("users/create", data);
    return response.data;
}

// Login User
export const authenticateUser = async (data: AuthInput) => {
    const response = await axiosUnauthInstance.post("auth/login", data);
    return response.data;
}

// Presigned URL Request
export const requestPresignedUrls = async (kind: string, files: { fileName: string, contentType: string }[]) => {
    const response = await userAxios.post("general/presigned", { kind, files });
    return response.data;
}

// Create a Safety Post
export const createSafetyPost = async (data: SafetyInput) => {
    const response = await userAxios.post(`safety/create`, data);
    return response.data;
}

// Fetch a Safety Post
export const fetchSafetyPosts = async (queries: SafetyQueries) => {
    const params = new URLSearchParams();

    if (queries.cursor) params.append("cursor", queries.cursor);
    if (queries.name) params.append("fullName", queries.name);
    if (queries.state) params.append("state", queries.state);
    if (queries.street) params.append("street", queries.street);
    if (queries.city) params.append("city", queries.city);
    if (queries.limit) params.append("limit", String(queries.limit));

    const response = await userAxios.get(`safety/fetch?${params.toString()}`);
    return response.data;
};

// Vibe/Unvibe a Post
export const toggleVibe = async (data: { postId: string, postModel: string }) => {
    const response = await userAxios.post(`vibe/toggle`, data);
    return response.data;
}