import { conn } from "../lib/database/postgres/connection.js";
import { PgNoResult, PgQueryError } from '../lib/database/postgres/exceptions.js';

const TABLE_USERS = 'users_server';

export default class UserRepository{


    static async getUserById( id ){
        const sQuery = `SELECT id, numempleado, nombre, alias, color, roltype, lvl_roltype, avatar, preferencias FROM ${TABLE_USERS} WHERE is_active AND id = $1`;
        
        let query;
        try{
            query = await conn.query(sQuery, [ id ]);
        }catch(err){ throw new PgQueryError('Ocurrió un error en la consulta'); }

        return query.rows.at(0);
    }

    static async getUserByEmpleado( empleado ){
        
        const sQuery = `SELECT id, numempleado, nombre, alias, color, roltype, lvl_roltype, avatar, preferencias FROM ${TABLE_USERS} WHERE is_active AND numempleado = $1`;
        
        let query;
        try{
            query = await conn.query(sQuery, [ empleado ]);
        }catch(err){ throw new PgQueryError('Ocurrió un error en la consulta'); }

        // if( query.rowCount < 1 ) throw new PgNoResult('No existe este empleado en la base de datos');

        return query.rows.at(0);
    }

    static async getUserToValidate( empleado ){
        const sQuery = `SELECT id, numempleado, password FROM ${TABLE_USERS} WHERE is_active AND numempleado = $1;`;
        
        let query;
        try{
            query = await conn.query(sQuery, [ empleado ]);
        }catch(err){ throw new PgQueryError('Ocurrió un error en la consulta'); }

        if( query.rowCount < 1 ) throw new PgNoResult('No existe este empleado en la base de datos');

        return query.rows.at(0);
    }

    static async setNewUser( userData ){

        const sQuery = `INSERT INTO ${TABLE_USERS}
                        (numempleado, nombre, alias, color, password, password_last_update, roltype, lvl_roltype, preferencias, fecha_insercion, is_active)
                        VALUES($1, $2, $3, $4, $5, CURRENT_DATE, $6, $7, $8, CURRENT_TIMESTAMP, TRUE)
                        RETURNING id, numempleado, nombre, alias, color, roltype, lvl_roltype, avatar, preferencias;`;

        let query;
        try{
            query = await conn.query(sQuery, [
                userData.numempleado,
                userData.nombre,
                userData.alias,
                userData.color,
                userData.password,
                userData.roltype,
                userData.lvl_roltype,
                userData.preferencias
            ]);
        }catch(err){ throw new PgQueryError('Ocurrió un error en la consulta'); }

        return query.rows.at(0);
    }

    static async updatePass( empleado, newPass ){
        const sQuery = `UPDATE ${TABLE_USERS} SET password = $1 WHERE numempleado = $2;`;

        let query;
        try{
            query = await conn.query( sQuery, [newPass, empleado])
        }catch(err){ throw new PgQueryError('Ocurrió un error en la consulta'); }

        return true;
    }

    static async getAllUsers(){
        const sQuery = `SELECT id, numempleado, nombre, alias, color, roltype, lvl_roltype, avatar, preferencias FROM ${TABLE_USERS} WHERE is_active ORDER BY nombre, roltype;`;
        
        let query, rowCount, rows;
        try{
            query = await conn.query( sQuery );
            
            rowCount = query.rowCount;
            rows = query.rows;
        }catch(err){ throw new PgQueryError('Ocurrió un error en la consulta'); }

        return {count:rowCount, data: rows};
    }

    static async updateUser(userId, nombre, alias, color, avatar, roltype, lvl_roltype){
        const sQuery = `UPDATE ${TABLE_USERS}
                        SET nombre = COALESCE($2, nombre), alias = COALESCE($3, alias), color = COALESCE($4, color),
                            avatar = COALESCE($5, avatar), roltype = COALESCE($6, roltype), lvl_roltype = COALESCE($7, lvl_roltype)
                        WHERE id = $1
                        RETURNING id, numempleado, nombre, alias, color, roltype, lvl_roltype, avatar, preferencias, is_active;`;
        let query;
        try{
            query = await conn.query(sQuery, [userId, nombre, alias, color, avatar, roltype, lvl_roltype]);
        }catch(err){
            console.log(err)
            throw new PgQueryError('Ocurrió un error en la consulta');
        }

        return query.rows.at(0);
    }

    static async updateUserPreferences( userId, preferences ){
        const sQuery = `UPDATE ${TABLE_USERS}
                        SET preferencias = (preferencias || $2)
                        WHERE id = $1
                        RETURNING id, numempleado, nombre, alias, color, roltype, lvl_roltype, avatar, preferencias, is_active;`;

        let query;
        try{
            query = await conn.query(sQuery, [userId, preferences]);
        }catch(err){ throw new PgQueryError('Ocurrió un error en la consulta'); }

        return query.rows.at(0);
    }

    static async deleteUser(userId){
        const sQuery = `UPDATE ${TABLE_USERS} SET is_active = false WHERE id = $1;`;

        let query;
        try{
            query = await conn.query(sQuery, [userId]);
        }catch(err){ throw new PgQueryError('Ocurrió un error en la consulta'); }
        
        return query.rows.at(0);
    }

}