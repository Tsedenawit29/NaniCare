// backend/server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const momsRoutes = require('./routes/moms');
const nanniesRoutes = require('./routes/nannies');
const config = require('./config/database'); // Assuming database config

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/moms', momsRoutes);
app.use('/api/nannies', nanniesRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Basic database connection test (optional for now)
const { Pool } = require('pg');
const pool = new Pool(config);

pool.connect()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Error connecting to PostgreSQL', err));