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