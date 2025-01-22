import express from 'express';
import { CachedLegacyClient } from './legacy/cached-legacy-client';
import { LegacyClient } from './legacy/legacy-client';
import { createClient, RedisClientType } from 'redis';
import axios from 'axios';

const CACHE_DURATION_IN_SECONDS = 10;
const LEGACY_SERVICE_API = 'http://legacy-backend:9991/api';

const redisClient: RedisClientType = createClient({
  url: 'redis://backend_redis:6379',
});

(async () => {
  redisClient.on('error', err => console.log('Redis Client Error', err));

  console.debug('Connecting to Redis');

  await redisClient.connect();
  
  // Since the legacy creates everything at the start make sure to flush the cache here
  redisClient.flushAll();
})();


const app = express()
const port = 3000

const legacyClient = new CachedLegacyClient(redisClient, CACHE_DURATION_IN_SECONDS, new LegacyClient(LEGACY_SERVICE_API, axios));

app.get('/api/products', async (req, res) => {
  try {
    return res.json(await legacyClient.getProducts());
  }
  catch (err) {
    return res.status(500).json({error: err.message});
  }
})

app.get('/api/products/:productId', async (req, res) => {
  
  try {
    const productId = req.params.productId;

    if(isNaN(Number(productId))) {
      return res.status(404).json({error: 'Product not found'});
    }

    const products = await legacyClient.getProducts();
    const product = products.find(product => product.id === productId);
    
    if(product) {
      const price = await legacyClient.getPrice(productId);
      if(price) {
        return res.json({...product, price});
      }
    }
    
    return res.status(404).json({error: 'Product not found'});
  } catch (err) {
    return res.status(500).json({error: err.message});
  }

})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
