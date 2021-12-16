export interface newUser{
    id: number;
    name: string; 
    username: string;
    password: string;
    email: string;
    phoneNumber: string;
    receiveEmailConsent: boolean;
    promoCode: string;
    FacebookLink: string;
    TwitterLink: string;
    InstagramLink: string;
    dateTimeJoined: Date;
}