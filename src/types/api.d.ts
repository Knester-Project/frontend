// For Safety Post Creation
declare type SafetyInput = {
    dateOfIncident: string;
    location: {
        state: string;
        city: string;
        town: string;
        street?: string | undefined;
    };
    content: string;
    media: {
        url: string;
        key: string;
    }[];
    fullName: string;
    phoneNumbers: string[];
    socialMedia: {
        platform: string;
        username: string;
        profileLink?: string | undefined;
    }[];
}

// For Fetching Safety Post
declare type SafetyQueries = {
    state?: string | undefined;
    city?: string | undefined;
    name?: string | undefined;
    street?: string | undefined;
    cursor?: string | undefined;
    limit?: number | undefined;
}

type Profile = null | {
    profilePicture?: string;
    profileLock: boolean;
    chatLock: boolean;
};

type User = {
    isPremium: boolean;
    isCore: boolean;
    isModerator: boolean;
    isSuspended: boolean;
    profile: Profile;
    username: string;
    _id: string;
};

// For Comment Queries
declare type CommentQueries = {
    postId: string;
    limit?: number;
    lastVibes?: string;
    lastId?: string;
    lastFlags?: string;
};

// Comments
declare type PostComment = {
    content: string;
    createdAt: string;
    edited: boolean;
    flags: number;
    hasFlagged: boolean;
    hasVibed: boolean;
    isDeleted: boolean;
    owner: boolean;
    media: string;
    post: string;
    postModel: string;
    replies: number;
    updatedAt: string;
    vibes: number;
    views: number;
    user: User;
    _id: string;
};

// For Reply Queries
declare type ReplyQueries = {
    id: string;
    type: "comment" | "reply";
    limit?: number;
    lastVibes?: string;
    lastId?: string;
    lastFlags?: string;
};

declare type Reply = {
    content: string;
    createdAt: string;
    edited: boolean;
    flags: number;
    hasFlagged: boolean;
    hasVibed: boolean;
    owner: boolean;
    isDeleted: boolean;
    comment: string;
    parentReply: string;
    replies: number;
    updatedAt: string;
    vibes: number;
    user: User;
    _id: string;
}