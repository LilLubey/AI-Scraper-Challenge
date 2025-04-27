# AI-Powered E-Commerce Scraper
Scrape product data from e-commerce sites using DeepSeek API (no Puppeteer/Cheerio required).

## Quick Start

### 1. Clone the Project
```bash
git clone https://github.com/your-repo/ecommerce-scraper.git
cd ecommerce-scraper
```
### 2. Install Dependencies
```bash
npm install
*(Requires Node.js 16+)*
```

### 3. Set Up .env File

Create .env in the project root:
```env
DEEPSEEK_API_KEY=your_api_key_here  # Get from DeepSeek dashboard
PORT=3000                           # Server port (default: 3000)
```
### 4. Run the Server
```bash
node app.js
(or npm start if using package.json scripts)
```
## API Endpoints
### 1. Scrape Single Product
```
POST /api/products/scrape-product
Body:

json
{
  "url": "https://www.amazon.com/dp/B08N5KWB9H"
}
Response:

json
{
  "name": "Product Name",
  "price": "$99.99",
  "description": "Product details...",
  "imageUrl": "https://example.com/image.jpg",
  "rating": "4.5",
  "seller": "Amazon",
  "source": "DeepSeek",
  "url": "https://www.amazon.com/dp/B08N5KWB9H"
}
```
### 2. Scrape Search Results
```
POST /api/search/scrape-search
Body:

json
{
  "searchUrl": "https://www.amazon.com/s?k=laptops"
}
Response:

json
{
  "searchUrl": "https://www.amazon.com/s?k=laptops",
  "products": [
    { "name": "Laptop 1", "price": "$999", ... },
    { "name": "Laptop 2", "price": "$799", ... }
  ],
  "count": 10
}

```
## Configuration

| Variable | Description | Default |
| ------------- | ------------- | ------------- | 
| DEEPSEEK_API_KEY | DeepSeek API key (required) | - |
| PORT  | Server port  | 3000 |
| MAX_PRODUCTS_PER_SEARCH  | Max products per search  | 50 |
| DELAY_BETWEEN_REQUESTS | Delay between API calls (ms) | 2000 |


## Troubleshooting

### Common Errors

| Error | Solution |
| ------------- | ------------- | 
| 401 Unauthorized | Check .env file for correct DEEPSEEK_API_KEY |
| 402 Payment Required  | Upgrade DeepSeek API plan or wait for quota reset  | 
| Timeout  | Increase timeout in config.js |

Debugging
```bash
# Log API requests/responses
DEBUG=axios node app.js
```
## Project Structure
```
ecommerce-scraper/
├── app.js                 # Main server
├── config.js              # Config loader
├── services/
│   ├── scraper.js         # Product scraping logic
│   └── searchScraper.js   # Search result scraping
├── routes/
│   ├── productRoutes.js   # Single product API
│   └── searchRoutes.js    # Search API
└── utils/
    └── helpers.js         # Retry/delay utilities
```
