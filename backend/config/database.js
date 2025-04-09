// backend/config/database.js
require('dotenv').config(); // This line loads the variables from .env

module.exports = {
    user: process.env.DB_USER || 'default_user_if_not_set',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'default_db_name',
    password: process.env.DB_PASSWORD || 'default_password',
    port: parseInt(process.env.DB_PORT || 5432), // Ensure port is a number
};