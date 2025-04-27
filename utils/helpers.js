const formatValue = (value) => value || '-';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function withRetry(fn, retries = 3, delayMs = 8000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (err) {
      if (i === retries - 1) throw err;
      console.log(`Retry ${i + 1}/${retries} after error:`, err.message);
      await delay(delayMs * (i + 1)); // Exponential backoff
    }
  }
}

module.exports = {
  formatValue,
  delay,
  withRetry
};