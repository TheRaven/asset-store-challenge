import { LegacyClient } from "./legacy-client";

describe(LegacyClient.name, () => {
  let legacyClient: LegacyClient;
  let axiosMock: any;

  beforeEach(() => {
    axiosMock = {
      get: jest.fn()
    }
    legacyClient = new LegacyClient('http://legacy-backend:9991/api', axiosMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should get the products list', () => {
      const fakeProducts = [
        {
          id: '1',
          name: 'Product 1',
        },
        {
          id: '2',
          name: 'Product 2',
        }
      ]

      axiosMock.get.mockResolvedValue({status: 200, data: {products: fakeProducts}});
      const products = legacyClient.getProducts();
      
      expect(axiosMock.get).toHaveBeenCalledWith('http://legacy-backend:9991/api/products');
      expect(products).resolves.toEqual(fakeProducts);
    });

    it('should fail if the remote service doesnt return a 200 status code', async () => {
      axiosMock.get.mockResolvedValue({status: 404, statusText: 'not found'});

      await expect(legacyClient.getProducts()).rejects.toThrow('not found');
    });

    it.each([
      undefined,
      null,
    ])('should fail if the remote service is returning %s', async (data) => {
      axiosMock.get.mockResolvedValue({status: 200,data});

      await expect(legacyClient.getProducts()).rejects.toThrow('Failed to fetch products');
    })

  });

  describe('getPrice', () => {

    let productId: string;

    beforeEach(() => {
      productId = '1';
    });


    it('should get the product price', () => {
      const fakePrice = {
        price: 100
      }

      axiosMock.get.mockResolvedValue({status: 200, data: {price: fakePrice}});
      const price = legacyClient.getPrice(productId);
      
      expect(axiosMock.get).toHaveBeenCalledWith(`http://legacy-backend:9991/api/products/price?id=${productId}`);
      expect(price).resolves.toEqual(fakePrice);
    });

    it('should fail if the remote service doesnt return a 200 status code', async () => {
      axiosMock.get.mockResolvedValue({status: 404, statusText: 'not found'});

      await expect(legacyClient.getPrice(productId)).rejects.toThrow('not found');
    });

    it.each([
      undefined,
      null,
    ])('should fail if the remote service is returning %s', async (data) => {
      axiosMock.get.mockResolvedValue({status: 200, data});

      await expect(legacyClient.getPrice(productId)).rejects.toThrow('Failed to fetch price');
    })
  });

});