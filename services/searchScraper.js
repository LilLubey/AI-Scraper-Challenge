const axios = require('axios');
const { DEEPSEEK_API_KEY, MAX_PRODUCTS_PER_SEARCH, DELAY_BETWEEN_REQUESTS } = require('../config');
const { delay, withRetry } = require('../utils/helpers');
const scraperService = require('./scraper');

class SearchScraper {
  constructor() {
    this.baseUrl = 'https://api.deepseek.com/v1/chat/completions';
  }

  async extractProductLinksFromSearch(url) {
    const response = await axios.post(
      this.baseUrl,
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `Analyze this e-commerce search results page and extract ONLY the URLs of product listings.
                      Return a JSON array of product URLs. Ignore ads, sponsored content, and non-product links.
                      Example: ["https://example.com/product1", "https://example.com/product2"]`
          },
          {
            role: "user",
            content: `Extract product URLs from: ${url}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.1 // Lower temperature for more consistent results
      },
      {
        headers: {
          'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 20000
      }
    );

    const content = response.data.choices[0].message.content;
    const result = typeof content === 'string' ? JSON.parse(content) : content;
    
    // Extract the array of URLs from the response
    const urls = result.urls || result.products || [];
    return urls.slice(0, MAX_PRODUCTS_PER_SEARCH);
  }

  async scrapeSearchResults(searchUrl) {
    try {
      // First extract all product URLs from the search page
      const productUrls = await withRetry(() => 
        this.extractProductLinksFromSearch(searchUrl)
      );

      // Then scrape each product individually
      const products = [];
      for (const url of productUrls) {
        try {
          await delay(DELAY_BETWEEN_REQUESTS);
          const product = await scraperService.scrapeSingleProduct(url);
          products.push(product);
        } catch (error) {
          console.error(`Error scraping product at ${url}:`, error.message);
          products.push({
            url,
            name: 'Error loading product',
            price: '-',
            description: '-',
            imageUrl: '-',
            source: 'Error'
          });
        }
      }

      return {
        searchUrl,
        products,
        count: products.length
      };
    } catch (error) {
      console.error('Search scraping error:', error);
      throw error;
    }
  }
}

module.exports = new SearchScraper();