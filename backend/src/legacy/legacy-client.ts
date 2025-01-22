import { Client } from "./client";
import { Product } from "./products";
import { AxiosStatic } from 'axios';


export class LegacyClient implements Client {

    constructor(private readonly legacyUrl: string, private readonly axios: AxiosStatic) { }


    public async getProducts(): Promise<Product[]> {

      const productsUrl = `${this.legacyUrl}/products`;

      console.debug(`Fetching products`);
      const products = await this.axios.get(productsUrl);

      if(products.status !== 200) {
        throw new Error(products.statusText);
      }


      if(products.data && products.data.products) {
        console.debug(`Found ${products.data.products.length} products. Sorting by name`);
        return products.data.products.sort((a: Product, b: Product) => a.name.localeCompare(b.name));
      }
      
      throw new Error('Failed to fetch products');
      
    }

    public async getPrice(productId: string): Promise<number> {
      const price = await this.axios.get(`${this.legacyUrl}/products/price?id=${productId}`);

      if(price.status !== 200) {
        throw new Error(price.statusText);
      }


      if(price.data && price.data.price) {
        console.log(`Found price ${price.data.price} for product ${productId}`);
        return price.data.price;
      }

      throw new Error('Failed to fetch price');
    }

}