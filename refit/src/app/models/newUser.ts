import { Follow } from "./follow";

export interface User{
    id: number;
    name: string; 
    username: string;
    password: string;
    email: string;
    bio: string,
    phoneNumber: string;
    receiveEmailConsent: boolean;
    promoCode: string;
    FacebookLink: string;
    TwitterLink: string;
    InstagramLink: string;
    dateTimeJoined: Date;
    followings: Follow[];
}