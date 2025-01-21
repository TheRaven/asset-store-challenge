import { Client } from "./client";
import { Product } from "./products";
import axios from 'axios';


export class CachedLegacyClient implements Client {

    constructor(private readonly client: Client) {}


    public async getProducts(): Promise<Product[]> {
      return this.client.getProducts();
    }

    public async getPrice(productId: string): Promise<Product> {
      return this.client.getPrice(productId);
    }
}