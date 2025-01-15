import pool from '../src/lib/db';
import fs from 'fs';
import path from 'path';

async function initializeDatabase() {
    try {
        const schemaPath = path.join(__dirname, '../src/lib/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        await pool.query(schema);
        console.log('Database schema initialized successfully');
        
        await pool.end();
    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initializeDatabase();
