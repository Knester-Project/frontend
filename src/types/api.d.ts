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