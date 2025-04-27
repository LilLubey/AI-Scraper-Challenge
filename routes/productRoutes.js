const express = require('express');
const router = express.Router();
const scraperService = require('../services/scraper');
const { withRetry } = require('../utils/helpers');

router.post('/scrape-product', async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const productData = await withRetry(() => scraperService.scrapeSingleProduct(url));
    res.json(productData);
    
  } catch (error) {
    console.error('Scraping error:', error);
    res.status(500).json({ 
      error: 'Scraping failed',
      details: error.message
    });
  }
});

router.post('/scrape-products', async (req, res) => {
  try {
    const { urls } = req.body;
    
    if (!urls || !Array.isArray(urls)) {
      return res.status(400).json({ error: 'Array of URLs is required' });
    }

    const products = await scraperService.scrapeMultipleProducts(urls);
    res.json({ products, total: products.length });
    
  } catch (error) {
    console.error('Batch scraping error:', error);
    res.status(500).json({ 
      error: 'Batch scraping failed',
      details: error.message
    });
  }
});

module.exports = router;