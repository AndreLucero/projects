import { conn } from "../connection.js";

export async function usersSeed(){

    await createTable();
    await setPrincipalUsers();

}

async function createTable(){
    const sQuery = `
        CREATE TABLE IF NOT EXISTS users_server(
            id uuid  DEFAULT gen_random_uuid() UNIQUE,
            numempleado bigint,
            nombre text,
            alias character varying(2),
            color text,
            password text,
            password_last_update date DEFAULT CURRENT_DATE,
            roltype text,
            lvl_roltype integer,
            avatar text,
            preferencias jsonb,
            fecha_insercion timestamp DEFAULT now(),
            is_active boolean DEFAULT true
        );
    `;

    await conn.query(sQuery);
}

async function setPrincipalUsers() {
    const sQuery = `
        INSERT INTO users_server
        (id, numempleado, nombre, alias, color, password, roltype, lvl_roltype, fecha_insercion, is_active) VALUES
        ('d041d52f-2f0f-45dc-8a55-8eaea1dc9ac3', 1, 'SystemUser', 'SS', 'cyan', '$2b$04$KnLBY7N2eCGuB2WtK404lO3GnYSDkp0WO.jbFdQmXGe.7NGOfjOCO', 'ADMIN', 99, CURRENT_TIMESTAMP, false),
        ('aec664e3-dcb3-4090-a40c-1fef52e93129', 11, 'Administrator', 'AD', 'gray', '$2b$04$KnLBY7N2eCGuB2WtK404lO3GnYSDkp0WO.jbFdQmXGe.7NGOfjOCO', 'ADMIN', 99, CURRENT_TIMESTAMP, false)
        ON CONFLICT (id) DO NOTHING;
    `;

    await conn.query(sQuery);
}