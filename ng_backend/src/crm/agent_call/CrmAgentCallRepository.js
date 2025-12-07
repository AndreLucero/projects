import { conn } from "../../lib/database/postgres/connection.js";
import { PgQueryError } from "../../lib/database/postgres/exceptions.js";
import { TABLE_CATALOGO, TABLE_CELULARES, TABLE_CRM_AGENT_CALL } from './config/config.js';
import { validateExistTable } from '../../lib/utils/generalPgsqlFunctions.js';
import { dateFormat } from "../../lib/utils/utils.js";

export class CrmAgentCallRepository{

    static async getDeepFines(){
        const sQuery = `
            SELECT
                tipo_fingestion,
                fingestion,
                CASE subfingestion
                    WHEN 'Equipos celulares (todos los modelos)' THEN modelo
                    ELSE subfingestion
                END AS subfingestion
            FROM ${TABLE_CATALOGO} crm
            LEFT JOIN ${TABLE_CELULARES}
            ON crm.subfingestion = 'Equipos celulares (todos los modelos)'
            ORDER BY 1,2,3;`;

        let query;
        try{
            query = await conn.query(sQuery);
        }catch(err){ throw new PgQueryError('Ocurrió un problema al consultar la información'); }

        return query.rows;
    }

    static async getAllFines(){
        const sQuery = `SELECT id, tipo_fingestion, fingestion, subfingestion FROM ${TABLE_CATALOGO};`;
        
        let query;
        try{
            query = await conn.query(sQuery);
        }catch(err){ throw new PgQueryError('Ocurrió un problema al consultar la información'); }

        return query.rows;
    }

    static async getAllModeloCelulares(){
        const sQuery = `SELECT id, modelo FROM ${TABLE_CELULARES} ORDER BY modelo;`;

        let query;
        try{
            query = await conn.query(sQuery);
        }catch(err){ throw new PgQueryError('Ocurrió un problema al consultar la información'); }

        return query.rows;
    }

    static async insertPrerecord({id_llamada, numero_empleado, telefono, fecha_llamadainicio}){
        const sQuery = `INSERT INTO ${TABLE_CRM_AGENT_CALL} (id_llamada, numero_empleado, telefono, fecha_llamadainicio)
                        VALUES ($1, $2, $3, $4)
                        RETURNING id_llamada, numero_empleado, telefono, fecha_llamadainicio;`;

        let query;
        try{
            query = await conn.query(sQuery, [id_llamada, numero_empleado, telefono, fecha_llamadainicio]);
        }catch(err){ throw new PgQueryError('Ocurrió un problema al consultar la información'); }

        return query.rows.at(0);
    }

    static async updatePrerecord({
        id_llamada, fecha_llamadainicio, fecha_llamadafin, numero_empleado, nombre_empleado, 
        nombre_cliente, apellidopaterno_cliente, apellidomaterno_cliente, telefono,
        telefonoadicional, numero_factura, fecha_compra, imei_equipo, id_contacto,
        comentario, categoria, fingestion, subfingestion
    }){
        const sQuery = `UPDATE ${TABLE_CRM_AGENT_CALL} SET fecha_llamadafin = $5, nombre_empleado = $6, nombre_cliente = $7, apellidopaterno_cliente = $8,
                        apellidomaterno_cliente = $9, telefonoadicional = $10, numero_factura = $11, fecha_compra = $12, imei_equipo = $13,
                        id_contacto = $14, comentario = $15, categoria = $16, fingestion = $17, subfingestion = $18
                        WHERE id_llamada = $1 AND fecha_llamadainicio = $2 AND numero_empleado = $3 AND telefono = $4;`;

        try{
            await conn.query(sQuery, [
                id_llamada, fecha_llamadainicio, numero_empleado, telefono,

                fecha_llamadafin, nombre_empleado, nombre_cliente, apellidopaterno_cliente,
                apellidomaterno_cliente, telefonoadicional, numero_factura, fecha_compra, imei_equipo,
                id_contacto, comentario, categoria, fingestion, subfingestion
            ]);

        }catch(err){ throw new PgQueryError('Ocurrió un problema al consultar la información'); }

        return true;
    }

    static async getCallPrerecord({id_llamada, numero_empleado, telefono, fecha_llamadainicio}){
        const sQuery = `SELECT id_llamada, fecha_llamadainicio, fecha_llamadafin, numero_empleado, nombre_empleado, nombre_cliente,
                            apellidopaterno_cliente, apellidomaterno_cliente, telefono, telefonoadicional, numero_factura, fecha_compra,
                            imei_equipo, id_contacto, comentario, categoria, fingestion, subfingestion
                        FROM  ${TABLE_CRM_AGENT_CALL} WHERE id_llamada = $1 AND numero_empleado = $2 AND telefono = $3 AND fecha_llamadainicio = $4;`;

        let query;
        try{
            query = await conn.query(sQuery, [id_llamada, numero_empleado, telefono, fecha_llamadainicio]);
        }catch(err){ throw new PgQueryError('Ocurrió un problema al consultar la información'); }

        return query.rows.at(0);
    }

    static async existCrmTable(){
        return await validateExistTable( TABLE_CRM_AGENT_CALL );
    }
    static async existCatalogoTable(){
        return await validateExistTable( TABLE_CATALOGO );
    }
    static async existCatalogoCelulares(){
        return await validateExistTable( TABLE_CELULARES );
    }

    static async getEncuestaPrb(){
        // const sQuery = `SELECT 100.00::numeric(5,2) as tcr, 85.52::numeric(5,2) as nps, 50.24::numeric(5,2) as amabilidad, 6 as total_encuestas;`;
        const sQuery = `SELECT 0.00::numeric(5,2) as tcr, 0.00::numeric(5,2) as nps, 0.00::numeric(5,2) as amabilidad, 0 as total_encuestas;`;

        let data;
        try{
            data = await conn.query(sQuery);
        }catch(err){ console.log('yama') }

        return data.rows.at(0);
    }

    static async getFinesCount({numempleado}){
        const sQuery = `
            SELECT 
                COUNT(CASE WHEN UPPER(categoria) LIKE 'ASESOR_A' THEN 1 END) as asesoria,
                COUNT(CASE WHEN UPPER(categoria) LIKE 'QUEJAS' THEN 1 END) as quejas,
                COUNT(CASE WHEN UPPER(categoria) LIKE 'SYG%TIENDA' THEN 1 END) as syg_tienda,
                COUNT(CASE WHEN UPPER(categoria) LIKE 'OTROS' THEN 1 END) as otros,
                COUNT(*) as total_llamadas
            FROM ${TABLE_CRM_AGENT_CALL}
            WHERE numero_empleado = $1 AND fecha_llamadainicio::DATE = $2;
        `;

        let data;
        try{
            data = await conn.query(sQuery, [numempleado, dateFormat(new Date(), 'Y-m-d')]);
        }catch(err){ throw new PgQueryError('Ocurrió un problema al obtener los fines de gestión del usuario') }

        return data.rows.at(0);
    }
    

}