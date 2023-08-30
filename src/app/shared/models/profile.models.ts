export interface ProfileData {
    animate?: boolean;
    firstName?: string;
    avatar?: string;
    lastName?: string;
    userProfile: string;
    email?: string;
    id: string;
}

export interface ProfileState {
    loading: boolean;
    profileData: ProfileData;
}