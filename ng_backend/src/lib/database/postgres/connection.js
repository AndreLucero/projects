import { Pool } from "pg";
import { DATABASE_HOST, DATABASE_PORT, DATABASE_NAME, DATABASE_USER, DATABASE_PASS } from "../../config.js";

const conn = new Pool({
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    database: DATABASE_NAME,
    user: DATABASE_USER,
    password: DATABASE_PASS
});

export { conn };