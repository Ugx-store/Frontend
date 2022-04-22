import { ProductImage } from "./productImage";
import { Like } from "./like";
import { Boost } from "./boost";

export interface Product{
    id: number;
    description: string;
    condition: string;
    itemPrice: number;
    originalPrice: number;
    ownerName: string;
    category: string;
    subCategory: string;
    brand: string;
    color: string;
    age: string;
    town: string;
    city: string;
    size: string;
    quantity: number;
    freeDelivery: boolean;
    dateTimeAdded: Date;
    productImages: ProductImage[]
    like: Like[],
    boost: Boost[]
}

export interface LikesChecker {
    [key: number]: any
}