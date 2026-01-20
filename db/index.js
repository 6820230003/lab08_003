//const { Pool } = require('pg');
import { Pool } from 'pg';

//require('dotenv').config();
import dotenv from "dotenv";
dotenv.config()

const pool = new Pool({
 connectionString: process.env.DATABASE_URL,
});

// module.exports = pool;
export default pool;