const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');

dotenv.config();

const apiRoutes = require('./src/routes/api');
const { notFoundHandler, errorHandler } = require('./src/middlewares/errorMiddleware');

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 300 });
app.use('/api/', limiter);
app.use('/api/v1', apiRoutes);

app.get('/health', (req, res) => res.status(200).json({ status: 'healthy' }));

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
