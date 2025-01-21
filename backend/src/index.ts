import express from 'express';
import { CachedLegacyClient } from './legacy/cached-legacy-client';
import { LegacyClient } from './legacy/legacy-client';


const app = express()
const port = 3000

const LEGACY_SERVICE_API = 'http://legacy-backend:9991/api';



const legacyClient = new CachedLegacyClient(new LegacyClient(LEGACY_SERVICE_API));


app.get('/api/products', async (req, res) => {
  return res.json(await legacyClient.getProducts());
})

app.get('/api/products/:productId', async (req, res) => {


  const productId = req.params.productId;
  console.log(productId);

  const products = await legacyClient.getProducts();

  const product = products.find(product => product.id === productId);


  if(product) {
    return res.json(product);
  }
  else {
    return res.status(404).json({error: 'Product not found'});
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
