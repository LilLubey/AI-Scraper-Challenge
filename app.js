const express = require('express');
const cors = require('cors');
const { PORT } = require('./config');
const productRoutes = require('./routes/productRoutes');
const searchRoutes = require('./routes/searchRoutes');
const { DEEPSEEK_API_KEY } = require('./config');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/search', searchRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

console.log("[DEBUG] API Key:", DEEPSEEK_API_KEY ? "✅ Loaded" : "❌ Missing");
