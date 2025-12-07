import { conn } from "../database/postgres/connection.js";

export async function validateExistTable(tableName) {
    const sQuery = `SELECT true FROM information_schema.tables WHERE UPPER(table_name) = UPPER($1);`;

    try{
        const exist = await conn.query(sQuery, [tableName]);
        if( exist.rowCount > 0 ) return true;
    }catch(err){};

    return false;
}