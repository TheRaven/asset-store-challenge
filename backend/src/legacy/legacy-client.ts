import { Client } from "./client";
import { Product } from "./products";
import axios from 'axios';


export class LegacyClient implements Client {

    constructor(private readonly legacyUrl: string) { 

    }


    public async getProducts(): Promise<Product[]> {
        const products = await axios.get(`${this.legacyUrl}/products`);

        if(products.data && products.data.products && products.status === 200) {
          return products.data.products.sort((a: Product, b: Product) => a.name.localeCompare(b.name));
        }

        return [];

    }

    public async getPrice(productId: string): Promise<number> {
      const price = await axios.get(`${this.legacyUrl}/products/price?id=${productId}`);

      if(price.data && price.data.price && price.status === 200) {
        return price.data.price;
      }

      return 0;


    }

}