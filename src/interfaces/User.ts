
export interface User {
    uid: string;
    displayName: string;
    email: string;
    password?: string;
    photo: string;
    emailVerification: boolean;
    codeVerification?: string | null;
}