import { getAxiosAuthInstance } from './config';

// Auth Instances
const axiosUnauthInstance = getAxiosAuthInstance();
const userAxios = getAxiosAuthInstance();


// Schemas
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

// Vibe/Unvibe (Post/Comment/Reply)
export const toggleVibe = async (data: { postId: string, postModel: string }) => {
    const response = await userAxios.post(`vibe/toggle`, data);
    return response.data;
}

// Comment on a Post
export const commentOnPost = async (data: { postId: string, postModel: string, content: string, media?: string }) => {
    const response = await userAxios.post(`comment/create`, data);
    return response.data;
}

// Fetch Comments
export const fetchComments = async (queries: CommentQueries) => {
    const params = new URLSearchParams();

    if (queries.postId) params.append("postId", queries.postId);
    if (queries.limit) params.append("limit", String(queries.limit));
    if (queries.lastId) params.append("lastId", queries.lastId);
    if (queries.lastVibes !== undefined) params.append("lastVibes", String(queries.lastVibes));
    if (queries.lastFlags !== undefined) params.append("lastFlags", String(queries.lastFlags));

    const response = await userAxios.get(`comment/get?${params.toString()}`);
    return response.data;
};

// Flag/Comment/Reply
export const flagPost = async (data: { postId: string, postModel: string, reason?: string }) => {
    const response = await userAxios.post(`flag/create`, data);
    return response.data;
}

// Reply a comment or a reply
export const createReply = async (data: { commentId?: string, parentReplyId?: string, content: string }) => {
    const response = await userAxios.post(`reply/create`, data);
    return response.data;
}

// Fetch Reply
export const fetchReplies = async (queries: ReplyQueries) => {
    const params = new URLSearchParams();

    if (queries.id) params.append("id", queries.id);
    if (queries.type) params.append("type", queries.type);
    if (queries.limit) params.append("limit", String(queries.limit));
    if (queries.lastId) params.append("lastId", queries.lastId);
    if (queries.lastVibes !== undefined) params.append("lastVibes", String(queries.lastVibes));
    if (queries.lastFlags !== undefined) params.append("lastFlags", String(queries.lastFlags));

    const response = await userAxios.get(`reply/get?${params.toString()}`);
    return response.data;
}

// Delete Comment
export const deleteComment = async (commentId: string) => {
    const response = await userAxios.delete(`comment/delete/${commentId}`);
    return response.data;
}

// Delete Reply
export const deleteReply = async (replyId: string) => {
    const response = await userAxios.delete(`reply/delete/${replyId}`);
    return response.data;
}

// Fetch User Profile
export const getCurrentUser = async () => {
    const response = await userAxios.get(`users/me`);
    return response.data;
}

// Fetch Any User Profile
export const getUserDetails = async (username: string) => {
    const response = await userAxios.get(`users/fetch/${username}`);
    return response.data;
}

// Sync profile details
export const updateProfile = async (data: EditProfilePayload) => {
    const response = await userAxios.post(`profile/sync`, data);
    return response.data;
}

// Delete Media from profile
export const deleteMedia = async (url: string) => {
    const response = await userAxios.delete(`profile/media`, {
        data: { url: url }
    });
    return response.data;
}

// Join Circle
export const joinCircle = async (username: string) => {
    const response = await userAxios.post(`circle/join/${username}`)
    return response.data;
}

// Leave Circle
export const leaveCircle = async (username: string) => {
    const response = await userAxios.post(`circle/leave/${username}`)
    return response.data;
}

// Block User
export const blockUser = async (username: string) => {
    const response = await userAxios.post(`block/new/${username}`);
    return response.data;
}

// Unblock User
export const unblockUser = async (username: string) => {
    const response = await userAxios.delete(`block/remove/${username}`);
    return response.data;
}

// Report User
export const reportUser = async (data: ReportPayload) => {
    const response = await userAxios.post(`report/new`, data);
    return response.data;
}