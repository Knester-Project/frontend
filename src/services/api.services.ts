import { getAxiosAuthInstance } from './config';

// Auth Instances
const axiosUnauthInstance = getAxiosAuthInstance();
const userAxios = getAxiosAuthInstance();

// Utils
import { serializeSubscription } from '@/utils/generate';

// Schemas
import type { AuthInput } from '@/schemas/auth.schema';

// Get the CSRF Token
export const fetchToken = async () => {
    const response = await axiosUnauthInstance.get(`auth/csrf`);
    return response.data;
}

// Contact
export const newContact = async (data: ContactPayload) => {
    const response = await axiosUnauthInstance.post(`contact/new`, data);
    return response.data;
}

// WaitList
export const newWaitList = async (data: WaitListPayload) => {
    const response = await axiosUnauthInstance.post(`waitList/new`, data);
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

// Update Chat Keys
export const updateUser = async (data: UserUpdatePayload) => {
    const response = await userAxios.post(`users/update`, data);
    return response.data;
}

// Login User
export const authenticateUser = async (data: AuthInput) => {
    const response = await axiosUnauthInstance.post("auth/login", data);
    return response.data;
}

// Forgot Password
export const forgotPassword = async (data: PasswordRecovery) => {
    const response = await axiosUnauthInstance.patch("users/password/recovery", data);
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

// Invite User
export const inviteUser = async () => {
    const response = await userAxios.get(`users/generateReferral`);
    return response.data;
}

// Create a new post
export const newPost = async (data: PostPayload[]) => {
    const response = await userAxios.post(`post/create`, data);
    return response.data;
}

// Feed
export const feed = async (queries: CursorQueries) => {
    const params = new URLSearchParams();

    if (queries.cursor) params.append("cursor", queries.cursor);
    if (queries.limit) params.append("limit", String(queries.limit));

    const response = await userAxios.get(`post/feed?${params.toString()}`);
    return response.data;
}

// Trending Tags
export const trendingTags = async () => {
    const response = await userAxios.get(`post/trending/tags`);
    return response.data;
}

// Fetch In-Circle Posts
export const circlePosts = async (queries: CursorQueries) => {
    const params = new URLSearchParams();

    if (queries.cursor) params.append("cursor", queries.cursor);
    if (queries.limit) params.append("limit", String(queries.limit));

    const response = await userAxios.get(`post/fetch/circle?${params.toString()}`);
    return response.data;
}

// Fetch Trending Posts
export const trendingPosts = async (queries: CursorQueries) => {
    const params = new URLSearchParams();

    if (queries.cursor) params.append("cursor", queries.cursor);
    if (queries.limit) params.append("limit", String(queries.limit));

    const response = await userAxios.get(`post/fetch/trending?${params.toString()}`);
    return response.data;
}

// Fetch Profile Posts
export const profilePosts = async (queries: CursorQueries, username: string) => {
    const params = new URLSearchParams();

    if (queries.cursor) params.append("cursor", queries.cursor);
    if (queries.limit) params.append("limit", String(queries.limit));
    if (username) params.append("username", username);

    const response = await userAxios.get(`post/fetch/profile/${username}?${params.toString()}`);
    return response.data;
}

// Fetch Posts Based On Tags
export const postsByTags = async (tags: string[], queries: CursorQueries) => {
    const params = new URLSearchParams();

    if (queries.cursor) params.append("cursor", queries.cursor);
    if (queries.limit) params.append("limit", String(queries.limit));
    if (tags.length > 0) params.append("tags", tags.join(","));

    const response = await userAxios.get(`post/fetch/tags?${params.toString()}`);
    return response.data;
}

// Update Post
export const updatePost = async (data: EditPostPayload) => {
    const { id, ...rest } = data;
    const response = await userAxios.patch(`post/update/${id}`, rest);
    return response.data;
}

// Delete Post Media
export const editPostMedia = async (data: { url: string, postId: string }) => {
    const { postId, ...rest } = data;
    const response = await userAxios.patch(`post/update/image/${postId}`, rest);
    return response.data;
}

// Delete Post
export const deletePost = async (id: string) => {
    const response = await userAxios.delete(`post/delete/${id}`);
    return response.data;
}

// Fetch People Page Analytics
export const fetchPeopleAnalytics = async () => {
    const response = await userAxios.get(`analytics/fetch/people`);
    return response.data;
}

// Fetch Nearby People
export const fetchPeople = async (queries: PeopleQueries) => {
    const params = new URLSearchParams();

    if (queries.cursor) params.append("cursor", queries.cursor);
    if (queries.limit) params.append("limit", String(queries.limit));
    if (queries.state?.trim()) params.append("state", queries.state);
    if (queries.radiusKm) params.append("radiusKm", String(queries.radiusKm));
    if (queries.premiumOnly) params.append("premiumOnly", String(queries.premiumOnly));
    if (queries.onlineOnly) params.append("onlineOnly", String(queries.onlineOnly));

    const response = await userAxios.get(`profile/fetch/nearby?${params.toString()}`);
    return response.data;
}

// Fetch User Advert
export const fetchMyAdvert = async () => {
    const response = await userAxios.get<AdvertResponse>(`advert/fetch/me`);
    return response.data;
}

// Fetch Another User Advert
export const fetchUserAdvert = async (username: string) => {
    const response = await userAxios.get<AdvertResponse>(`advert/fetch/user/${username}`);
    return response.data;
}

// Create User Advert
export const createAdvert = async (data: AdvertPayload) => {
    const response = await userAxios.post(`advert/new`, data);
    return response.data;
}

// Edit Advert
export const editAdvert = async (data: EditAdvertPayload) => {
    const { id, ...rest } = data;
    const response = await userAxios.patch(`advert/update/${id}`, rest);
    return response.data;
}

// Delete Advert Media
export const updateAdvertMedia = async (data: { url: string, advertId: string }) => {
    const { advertId, ...rest } = data;
    const response = await userAxios.patch(`advert/update/image/${advertId}`, rest);
    return response.data;
}

// Delete Advert
export const deleteAdvert = async (id: string) => {
    const response = await userAxios.delete(`advert/delete/${id}`);
    return response.data;
}

// Fetch Server Time
export const fetchTime = async () => {
    const response = await userAxios.get(`time`);
    return response.data;
}

// Messages
export const fetchConversations = async () => {
    const response = await userAxios.get(`chat/fetch/conversations`);
    return response.data;
}

// New Push Notification Subscription
export const newSubscription = async (subscription: PushSubscription) => {
    const data = serializeSubscription(subscription)
    const response = await userAxios.patch(`users/push-subscription`, data);
    return response.data;
}

// Delete a Subscription
export const unregisterSubscription = async (endpoint: string) => {
    // Encodes the URL so it acts as a safe URL parameter
    const safeEndpoint = encodeURIComponent(endpoint);
    const response = await userAxios.delete(`users/push-subscription/${safeEndpoint}`);
    return response.data;
}

// Fetch all Notification
export const fetchNotifications = async (queries: CursorQueries) => {
    const params = new URLSearchParams();

    if (queries.cursor) params.append("cursor", queries.cursor);
    if (queries.limit) params.append("limit", String(queries.limit));
    const response = await userAxios.get(`notification/all?${params.toString()}`);
    return response.data;
}

// Read Notification
export const markAsRead = async (id: string) => {
    const response = await userAxios.patch(`notification/mark/${id}`);
    return response.data;
}

// Read All Notification
export const markAllAsRead = async () => {
    const response = await userAxios.patch(`notification/mark/all`);
    return response.data;
}

// Fetch Unread count
export const fetchNotUnreadCount = async () => {
    const response = await userAxios.get(`notification/unread`);
    return response.data;
}

// Delete Notification
export const deleteNotification = async (id: string) => {
    const response = await userAxios.delete(`notification/delete/${id}`);
    return response.data;
}

// Fetch User Encrypted Vault
export const fetchVault = async () => {
    const response = await userAxios.get(`users/vault`);
    return response.data;
}

// Fetch a Particular Conversation
export const fetchParticularUserConv = async (username: string) => {
    const response = await userAxios.get<ConversationResponse>(`chat/fetch/conversation/${username}`);
    return response.data;
}

// Fetch all Conversations
export const fetchAllConv = async (queries: OffSetQueries) => {
    const params = new URLSearchParams();

    if (queries.offset) params.append("offset", String(queries.offset));
    if (queries.limit) params.append("limit", String(queries.limit));

    const response = await userAxios.get(`chat/fetch/conversations?${params.toString()}`);
    return response.data;
}

// Create Conversation (Group Message)
export const newConv = async (data: NewConvPayload) => {
    const response = await userAxios.post(`chat/create/conversations`, data);
    return response.data;
}

// Fetch Messages
export const fetchMessages = async (conversationId: string, queries: CursorQueries) => {
    const params = new URLSearchParams();

    if (queries.cursor) params.append("cursor", queries.cursor);
    if (queries.limit) params.append("limit", String(queries.limit));
    const response = await userAxios.get(`chat/fetch/messages/${conversationId}?${params.toString()}`);
    return response.data;
}

// Edit a Message
export const editMessageFn = async (data: EditMessagePayload) => {
    const response = await userAxios.patch(`chat/edit/message`, data);
    return response.data;
}

// Delete a Message
export const deleteMessageFn = async (data: { messageId: string, conversationId: string }) => {
    const response = await userAxios.delete(`chat/delete/message`, { data });
    return response.data;
}

// Update Meta Details
export const updateConvMeta = async (data: EditConvMetaPayload) => {
    const { conversationId: id, ...rest } = data;
    console.log("The Id", id)

    const response = await userAxios.patch(`chat/conversations/${id}/meta`, rest);
    return response.data;
}

// Search a User
export const searchFn = async (query: string) => {
    const response = await userAxios.get(`users/search/query?query=${encodeURIComponent(query)}`);
    return response.data;
}

// Add User to Group
export const newGroupFn = async (data: NewGroupPayload) => {
    const response = await userAxios.post(`chat/create/conversations`, data);
    return response.data;
}