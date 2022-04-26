import { Follow } from "./follow";
import { ProfilePictures } from "./profilepic";

export interface User{
    id: number;
    name: string; 
    username: string;
    password: string;
    email: string;
    bio: string,
    phoneNumber: string;
    profileVisits: number;
    receiveEmailConsent: boolean;
    promoCode: string;
    facebookLink: string;
    twitterLink: string;
    instagramLink: string;
    dateTimeJoined: Date;
    followings: Follow[];
    profilePicture: ProfilePictures[]
}