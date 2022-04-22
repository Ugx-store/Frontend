export interface Boost{
    id: number,
    productId: number,
    username: string,
    boosted: boolean,
    boostPrice: number,
    boostStartTime: Date,
    boostEndTime: Date
}