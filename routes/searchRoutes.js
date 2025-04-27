const express = require('express');
const router = express.Router();
const searchScraper = require('../services/searchScraper');
const { withRetry } = require('../utils/helpers');

router.post('/scrape-search', async (req, res) => {
  try {
    const { searchUrl } = req.body;
    
    if (!searchUrl) {
      return res.status(400).json({ error: 'searchUrl is required' });
    }

    const results = await withRetry(() => 
      searchScraper.scrapeSearchResults(searchUrl)
    );

    res.json(results);
  } catch (error) {
    console.error('Search scraping error:', error);
    res.status(500).json({ 
      error: 'Search scraping failed',
      details: error.message
    });
  }
});

module.exports = router;