const axios = require('axios');
const { DEEPSEEK_API_KEY, DELAY_BETWEEN_REQUESTS } = require('../config'); // Add DELAY_BETWEEN_REQUESTS
const { withRetry, formatValue, delay } = require('../utils/helpers'); // Make sure delay is imported

class ScraperService {
  constructor() {
    this.baseUrl = 'https://api.deepseek.com/v1/chat/completions';
  }

  async scrapeProduct(url) {
    const response = await axios.post(
      this.baseUrl,
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: `Extract product information as JSON with these fields: name, price, description, imageUrl, rating, seller. 
                      Follow these rules:
                      1. Only extract ACTUAL product information
                      2. Ignore navigation, search options, filters
                      3. Exclude sponsored/promoted content
                      4. For price, extract the current price, ignore original/discounted prices unless it's the only price
                      5. Return missing fields as '-'`
          },
          {
            role: "user",
            content: `Extract COMPLETE product data from: ${url}`
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
        timeout: 20000 // Increased timeout
      }
    );

    const productData = response.data.choices[0].message.content;
    const parsedData = typeof productData === 'string' ? JSON.parse(productData) : productData;

    return {
      name: formatValue(parsedData.name),
      price: formatValue(parsedData.price),
      description: formatValue(parsedData.description),
      imageUrl: formatValue(parsedData.imageUrl),
      rating: formatValue(parsedData.rating),
      seller: formatValue(parsedData.seller),
      source: 'DeepSeek',
      url: url
    };
  }

  async scrapeSingleProduct(url) {
    try {
      const product = await withRetry(() => this.scrapeProduct(url));
      return product;
    } catch (error) {
      console.error(`Error scraping product at ${url}:`, error.message);
      return this.createErrorProduct(url, error.message);
    }
  }

  async scrapeMultipleProducts(urls) {
    const results = [];
    for (const url of urls) {
      try {
        await delay(DELAY_BETWEEN_REQUESTS); // Use configurable delay
        const product = await this.scrapeSingleProduct(url);
        results.push(product);
      } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        results.push(this.createErrorProduct(url, error.message));
      }
    }
    return results;
  }

  createErrorProduct(url, errorMessage = '') {
    return {
      name: 'Error loading product',
      price: '-',
      description: errorMessage || 'Failed to load product',
      imageUrl: '-',
      rating: '-',
      seller: '-',
      source: 'Error',
      url: url
    };
  }
}

module.exports = new ScraperService();