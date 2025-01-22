import { Product } from "./products";

export interface Client {

    getProducts(): Promise<Product[]>;

    getPrice(productId: string): Promise<number>;
}