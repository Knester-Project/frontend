// For Safety Post Creation
declare type SafetyInput = {
    dateOfIncident: string;
    location: {
        state: string;
        city: string;
        town: string;
        street?: string;
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
        profileLink?: string;
    }[];
}

// For Fetching Safety Post
declare type SafetyQueries = {
    state?: string;
    city?: string;
    name?: string;
    street?: string;
    cursor?: string;
    limit?: number;
}

// Safety Post
declare type SafetyPost = {
    _id: string;
    postId: string;
    fullName: string;
    createdAt: string;
    dateOfIncident: string;
    content: string;
    verified: boolean;
    vibes: number;
    views: number;
    flags: number;
    comments: number;
    hasVibed: boolean,
    hasFlagged: boolean,
    location: {
        street?: string;
        town?: string;
        city?: string;
        state?: string;
    };
    media: { url: string }[];
    socialMedia: {
        platform: string;
        username: string;
        profileLink: string;
    }[];
};

type Profile = null | {
    profilePicture?: string;
    profileLock: boolean;
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

// Profile
type MyProfile = {
    bio: string;
    details?: string[];
    dateOfBirth?: string;
    profilePicture?: string;
    media?: string[];
    lastSeen?: string;
    isOnline: boolean;
    wallet: {
        availableBalance: number,
        escrowedBalance: number,
    };
    flagged: boolean;
    circleMembers: number;
    profileLock: boolean;
    chatLock: boolean;
}

declare type Me = {
    _id: string;
    email: string;
    invitedUser: User[];
    isEmailVerified: boolean;
    isPremium: boolean;
    isModerator: boolean;
    isCore: boolean;
    isSuspended: boolean;
    discoverable: boolean;
    circlesJoined: number;
    totalPosts: number;
    profile: null | MyProfile;
    referralPrivilege: number;
    suspendedDuration: number;
    suspensionStartDate: null | string | Date;
    username: string;
    createdAt: string;
}

type UserProfile = {
    bio: string;
    details?: string[];
    dateOfBirth?: string;
    profilePicture?: string;
    media: string[];
    circleMembers: number;
    profileLock: boolean;
    chatLock: boolean;
    lastSeen?: string;
    isOnline: boolean;
    flagged: boolean;
}

declare type UserDetails = {
    username: string;
    email: string;
    isEmailVerified: boolean;
    isPremium: boolean;
    isModerator: boolean;
    isCore: boolean;
    isSuspended: boolean;
    discoverable: boolean;
    circlesJoined: number;
    totalPosts: number;
    relationship: {
        inCircle: boolean;
        hasReported: boolean;
        hasBlocked: boolean;
        isBlocked: boolean;
    }
    profile: null | UserProfile;
    createdAt: string;
}

// Edit Profile Payload
declare type EditProfilePayload = {
    bio?: string;
    details?: string[];
    dateOfBirth?: string;
    profilePicture?: string;
    media?: string[];
    location?: {
        longitude: number;
        latitude: number;
    };
    profileLock?: boolean;
    discoverable?: boolean;
    chatLock?: boolean;
}

// New Report
declare type ReportPayload = {
    reportedUser: string,
    reason: string,
    shouldBlock?: boolean
}

// New Post
declare type PostPayload = {
    content: string,
    hashtags: string[],
    media: string[],
    isPrivate: boolean,
}

// Cursor and Limit
declare type CursorQueries = {
    cursor?: string;
    limit?: number;
}

// Tags
declare type Tags = {
    tag: string,
    count: number,
    formattedCount: string
}

// Post
declare type Post = {
    _id: string;
    postId: string;
    user: User;
    createdAt: string;
    edited: boolean;
    content: string;
    media: string[];
    hashtags: string[];
    vibes: number;
    comments: number;
    views: number;
    isThread: boolean;
    threadRoot: string;
    threadParent: string;
    flags: number;
    hasFlagged: boolean;
    hasVibed: boolean;
    isPrivate: boolean;
    thread?: Post[]
}

// Nearby People
type GeoPoint = {
    type: 'Point';
    coordinates: [number, number];
};

type UserMeta = {
    isCore: boolean;
    isPremium: boolean;
    isSuspended: boolean;
    isModerator: boolean;
    username: string;
    _id: string;
};

declare type NearbyProfile = {
    _id: string;
    bio: string;
    distance: number | null;
    distanceKm: number | null;
    isOnline: boolean;
    location: GeoPoint;
    profileLock: boolean;
    profilePicture: string;
    user: UserMeta;
};

declare type PeopleQueries = {
    radiusKm?: number;
    state?: string;
    limit?: number;
    cursor?: string;
    premiumOnly?: boolean;
    onlineOnly?: boolean;
}