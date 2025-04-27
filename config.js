require('dotenv').config();

if (!process.env.DEEPSEEK_API_KEY) {
  throw new Error("❌ Missing DEEPSEEK_API_KEY in .env file");
}

module.exports = {
  PORT: process.env.PORT || 3000,
  DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
  USER_AGENTS: [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  ],
  RETRY_CONFIG: {
    retries: 3,
    delayMs: 8000
  },
  MAX_PRODUCTS_PER_SEARCH: 50, // Limit for demo purposes
  DELAY_BETWEEN_REQUESTS: 2000 // 2 seconds
};