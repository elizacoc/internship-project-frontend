import { Product } from "./product.model";

export interface Stock {
    id: number;
    quantity: number;
    price: number;
    product: Product;
}
