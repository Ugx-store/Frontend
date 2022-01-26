export interface ProfilePic{
    Id: number;
    Username: string;
    ImageData: FormData;
}

export interface ProfilePictures{
    Id: number;
    Username: string;
    imageData: Uint8Array[];
}

export interface LooseObject {
    [key: string]: any
}