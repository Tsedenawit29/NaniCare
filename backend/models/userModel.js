// backend/models/userModel.js
const { Pool } = require('pg');
const config = require('../config/database');
const bcrypt = require('bcrypt');
const pool = new Pool(config);

module.exports = {
    create: async (userData) => {
        const { name, phone, location, role, email, password } = userData;
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10
        }
        const query = 'INSERT INTO users (name, phone, location, role, email, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
        const values = [name, phone, location, role, email, hashedPassword];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    findByEmail: async (email) => {
        try {
            const query = {
                text: 'SELECT * FROM users WHERE email = $1',
                values: [email],
            };
            const result = await pool.query(query);
            return result.rows[0];
        } catch (error) {
            console.error('Error in findByEmail:', error);
            throw error; // Re-throw the error to be caught in the controller
        }
    },
    
    findByPhone: async (phone) => {
        try {
            const query = {
                text: 'SELECT * FROM users WHERE phone = $1',
                values: [phone],
            };
            const result = await pool.query(query);
            return result.rows[0];
        } catch (error) {
            console.error('Error in findByPhone:', error);
            throw error; // Re-throw the error
        }
    },
    findById: async (id) => {
        const query = 'SELECT * FROM users WHERE id = $1';
        const values = [id];
        const result = await pool.query(query);
        return result.rows[0];
    },
    findAll: async (whereClause) => {
        let query = 'SELECT * FROM users WHERE ';
        const values = [];
        let index = 1;
        const conditions = [];

        for (const key in whereClause) {
            conditions.push(`${key} = $${index}`);
            values.push(whereClause[key]);
            index++;
        }

        query += conditions.join(' AND ');
        query += ' ORDER BY id DESC';

        if (conditions.length === 0) {
            query = 'SELECT * FROM users ORDER BY id DESC';
        }

        const result = await pool.query(query, values);
        return result.rows;
    },
  // backend/models/userModel.js

comparePassword: async (plainPassword, hashedPassword) => {
    if (!hashedPassword) {
        console.warn('Warning: hashedPassword is null or undefined for a user.');
        return false; // Or handle this case as appropriate for your logic
    }
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
        console.error('Error in comparePassword:', error);
        throw error; // Re-throw the error
    }
},
};