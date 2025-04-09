// backend/models/nannyProfileModel.js
const { Pool } = require('pg');
const config = require('../config/database');
const pool = new Pool(config);

module.exports = {
    findOne: async (whereClause) => {
        let query = 'SELECT * FROM nanny_profiles WHERE ';
        const values = [];
        let index = 1;
        const conditions = [];

        for (const key in whereClause) {
            conditions.push(`${key} = $${index}`);
            values.push(whereClause[key]);
            index++;
        }

        query += conditions.join(' AND ');

        if (conditions.length === 0) {
            return null; // Or handle as needed
        }

        const result = await pool.query(query, values);
        return result.rows[0];
    },
    update: async (updateData, whereClause) => {
        let query = 'UPDATE nanny_profiles SET ';
        const setClauses = [];
        const values = [];
        let index = 1;

        for (const key in updateData) {
            setClauses.push(`${key} = $${index}`);
            values.push(updateData[key]);
            index++;
        }

        query += setClauses.join(', ');
        query += ' WHERE ';

        const whereConditions = [];
        for (const key in whereClause) {
            whereConditions.push(`${key} = $${index}`);
            values.push(whereClause[key]);
            index++;
        }
        query += whereConditions.join(' AND ');
        query += ' RETURNING *';

        const result = await pool.query(query, values);
        return result.rows;
    },
    findAll: async (whereClause) => {
        let query = 'SELECT * FROM nanny_profiles WHERE ';
        const values = [];
        let index = 1;
        const conditions = [];

        for (const key in whereClause) {
            conditions.push(`${key} = $${index}`);
            values.push(whereClause[key]);
            index++;
        }

        query += conditions.join(' AND ');
        query += ' ORDER BY user_id DESC'; // Example ordering

        if (conditions.length === 0) {
            query = 'SELECT * FROM nanny_profiles ORDER BY user_id DESC';
        }

        const result = await pool.query(query, values);
        return result.rows;
    },
    // ... other nanny profile related database operations
};