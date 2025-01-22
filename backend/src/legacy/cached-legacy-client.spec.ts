import { before } from "node:test";
import { CachedLegacyClient } from "./cached-legacy-client";

describe(CachedLegacyClient.name, () => {
  let cachedLegacyClient: CachedLegacyClient;
  let legacyClientMock: any;
  let redisClientMock: any;

  beforeEach(() => {
    redisClientMock = {
      get: jest.fn(),
      set: jest.fn()
    }


    legacyClientMock = {
      getProducts: jest.fn(),
      getPrice: jest.fn()
    }

    cachedLegacyClient = new CachedLegacyClient(redisClientMock, 1, legacyClientMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {

    let fakeProducts;

    beforeEach(() => {

      fakeProducts = [{
        id: '1',
        name: 'product1'
      }, {
        id: '2',
        name: 'product2'
      }];
    });

    it('should call the legacy client and cache the result',async () => {
      redisClientMock.get.mockResolvedValue(null);


      legacyClientMock.getProducts.mockResolvedValue(fakeProducts);

      const products = await cachedLegacyClient.getProducts();

      expect(legacyClientMock.getProducts).toHaveBeenCalled();
      expect(redisClientMock.set).toHaveBeenCalledWith('products', JSON.stringify(fakeProducts), {EX: 1});
      expect(products).toEqual(fakeProducts);
    });

    it('should return the cached data if available', async() => {
      redisClientMock.get.mockResolvedValue(JSON.stringify(fakeProducts));

      const products = await cachedLegacyClient.getProducts();

      expect(legacyClientMock.getProducts).not.toHaveBeenCalled();
      expect(redisClientMock.set).not.toHaveBeenCalled();
      expect(products).toEqual(fakeProducts);
    });

    it('should fail and not cache if the remote service is failing', async () => {
      redisClientMock.get.mockResolvedValue(null);

      legacyClientMock.getProducts.mockRejectedValue(new Error('Failed to fetch products'));

      await expect(cachedLegacyClient.getProducts()).rejects.toThrow('Failed to fetch products');
      expect(redisClientMock.set).not.toHaveBeenCalled();
    })

  });

  describe('getPrice', () => {

    let fakePrice;

    beforeEach(() => {
      fakePrice = 100;
    });

    it('should call the legacy client and cache the result',async () => {
      redisClientMock.get.mockResolvedValue(null);

      legacyClientMock.getPrice.mockResolvedValue(fakePrice);

      const price = await cachedLegacyClient.getPrice('1');

      expect(legacyClientMock.getPrice).toHaveBeenCalled();
      expect(redisClientMock.set).toHaveBeenCalledWith('price:1', JSON.stringify(fakePrice), {EX: 1});
      expect(price).toEqual(fakePrice);
    });

    it('should return the cached data if available', async() => {
    
      redisClientMock.get.mockResolvedValue(JSON.stringify(fakePrice));

      const price = await cachedLegacyClient.getPrice('1');

      expect(legacyClientMock.getPrice).not.toHaveBeenCalled();
      expect(redisClientMock.set).not.toHaveBeenCalled();
      expect(price).toEqual(fakePrice);
    });

    it('should fail and not cache if the remote service is failing', async () => {
      redisClientMock.get.mockResolvedValue(null);

      legacyClientMock.getPrice.mockRejectedValue(new Error('Failed to fetch price'));

      await expect(cachedLegacyClient.getPrice('1')).rejects.toThrow('Failed to fetch price');
      expect(redisClientMock.set).not.toHaveBeenCalled();
    })

    
  });

});