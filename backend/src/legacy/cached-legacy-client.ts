
import { Client } from "./client";
import { Product } from "./products";
import { RedisClientType } from "redis";

export class CachedLegacyClient implements Client {

    constructor(private readonly redisClient: RedisClientType, private readonly cacheDurationInSeconds: number, private readonly client: Client) {}

    public async getProducts(): Promise<Product[]> {
      return this.fetchAndCache(`products`, () => this.client.getProducts());
    }

    public async getPrice(productId: string): Promise<number> {
      return this.fetchAndCache(`price:${productId}`, () => this.client.getPrice(productId));
    }


    private async fetchAndCache<T>(cacheKey: string, fetch: () => Promise<T>): Promise<T> {
      const cachedData = await this.redisClient.get(cacheKey);

      if(cachedData) {
        console.debug(`Found ${cacheKey} in cache`);
        return JSON.parse(cachedData);
      }

      console.debug(`Fetching fetching data from remote service`);
      const data = await fetch();

      console.debug(`Caching ${cacheKey}`);
      await this.redisClient.set(cacheKey, JSON.stringify(data), {EX: this.cacheDurationInSeconds});

      return data;
    };

}