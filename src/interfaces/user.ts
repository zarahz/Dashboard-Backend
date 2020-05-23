export interface Credentials {
    access_token: string;
    refresh_token: string;
    scope: string;
    token_type: string;
    expiry_date: number;
}

export interface GoogleUser {
    id: string;
    email: string;
    given_name: string;
    family_name: string;
    picture?: string | null;
}