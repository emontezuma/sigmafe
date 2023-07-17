export interface ProfileData {
    animate: boolean;
    fiestName: string;
    lastName: string;
    userProfile: string;
    id: string;
}

export interface ProfileState {
    loading: boolean;
    profileData: ProfileData;
}