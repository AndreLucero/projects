import { conn } from "../../../lib/database/postgres/connection.js";
import { PgQueryError } from "../../../lib/database/postgres/exceptions.js";
import { TABLE_CATALOGO, TABLE_CELULARES, TABLE_CRM_AGENT_CALL } from './config.js';

export async function createCrmTable(){
    const sQuery = `
        CREATE TABLE IF NOT EXISTS ${TABLE_CRM_AGENT_CALL}(
            id_llamada text,
            fecha_llamadainicio timestamp,
            fecha_llamadafin timestamp,
            numero_empleado text,
            nombre_empleado text,
            nombre_cliente text,
            apellidopaterno_cliente text,
            apellidomaterno_cliente text,
            telefono text,
            telefonoadicional text,
            numero_factura text,
            fecha_compra text,
            imei_equipo text,
            id_contacto text,
            comentario text,
            categoria text,
            fingestion text,
            subfingestion text
        );
    `;

    try{
        await conn.query(sQuery);
    }catch(err){ throw new PgQueryError('Ocurrió un problema en la creación de la tabla'); }
}

export async function createCatalogo(){
    const sQuery = `
        CREATE TABLE IF NOT EXISTS ${TABLE_CATALOGO}(
            id SERIAL,
            tipo_fingestion text,
            fingestion text,
            subfingestion text
        );
    `;
    
    try{
        await conn.query(sQuery);
    }catch(err){ throw new PgQueryError('Ocurrió un problema en la creación de la tabla'); }

    try{
        await fillCatalogo();
    }catch(err){ throw new PgQueryError('Ocurrió un problema al llenar el catalogo'); }
    
}

export async function createCatalogoCelulares(){
    const sQuery = `
        CREATE TABLE IF NOT EXISTS ${TABLE_CELULARES}(
            id SERIAL,
            modelo text
        );
    `;
    
    try{
        await conn.query(sQuery);
    }catch(err){ throw new PgQueryError('Ocurrió un problema en la creación de la tabla'); }

    
    try{
        await fillCatalogoCelulares();
    }catch(err){ throw new PgQueryError('Ocurrió un problema al llenar el catalogo'); }
}

async function fillCatalogo(){
    const sQuery  = `INSERT INTO ${TABLE_CATALOGO} (id, tipo_fingestion, fingestion, subfingestion) VALUES 
        (1,'Asesoría','Garantía','Equipos celulares (todos los modelos)'),
        (2,'Asesoría','Bloqueo por IMEI','Equipos celulares (todos los modelos)'),
        (3,'Asesoría','Hardware','Equipos celulares (todos los modelos)'),
        (4,'Asesoría','Características generales','Equipos celulares (todos los modelos)'),
        (5,'Asesoría','Existencia artículos','Equipos celulares (todos los modelos)'),
        (6,'Asesoría','Software','Equipos celulares (todos los modelos)'),
        (7,'Asesoría','Reparación con costo','Equipos celulares (todos los modelos)'),
        (8,'Asesoría','Precios de equipos','Equipos celulares (todos los modelos)'),
        (9,'Asesoría','Hard reset','Equipos celulares (todos los modelos)'),
        (10,'Asesoría','Funcionamiento básico de equipos','Equipos celulares (todos los modelos)'),
        (11,'Asesoría','Módem LIBERI','Equipos celulares (todos los modelos)'),
        (12,'SYG Tienda','Fallas en el equipo Celular','Equipos celulares (todos los modelos)'),
        (13,'SYG Tienda','Equipo no Enciende','Equipos celulares (todos los modelos)'),
        (14,'SYG Tienda','Equipo C/ problema de cámara','Equipos celulares (todos los modelos)'),
        (15,'SYG Tienda','Equipo C/ problema de batería - poca duración','Equipos celulares (todos los modelos)'),
        (16,'SYG Tienda','Equipo C / problema de conectividad Wifi/Bluetooth','Equipos celulares (todos los modelos)'),
        (17,'SYG Tienda','Bloqueo antirrobo','Equipos celulares (todos los modelos)'),
        (18,'SYG Tienda','Bloqueo cuenta Google','Equipos celulares (todos los modelos)'),
        (19,'SYG Tienda','Dispositivo inestable/bloquea/congela','Equipos celulares (todos los modelos)'),
        (20,'SYG Tienda','Equipo se reinicia','Equipos celulares (todos los modelos)'),
        (21,'SYG Tienda','Equipo no carga','Equipos celulares (todos los modelos)'),
        (22,'SYG Tienda','Equipo no inicia','Equipos celulares (todos los modelos)'),
        (23,'SYG Tienda','Equipo no vibra','Equipos celulares (todos los modelos)'),
        (24,'SYG Tienda','Problema con conexión de cables o accesorios','Equipos celulares (todos los modelos)'),
        (25,'SYG Tienda','Problema con pantalla táctil/touch','Equipos celulares (todos los modelos)'),
        (26,'SYG Tienda','Problema con tarjeta de memoria externa','Equipos celulares (todos los modelos)'),
        (27,'SYG Tienda','Problema con tarjeta SIM/sin servicio','Equipos celulares (todos los modelos)'),
        (28,'SYG Tienda','Problema con adaptador de corriente/USB','Equipos celulares (todos los modelos)'),
        (29,'SYG Tienda','Problema de auricular/altavoz','Equipos celulares (todos los modelos)'),
        (30,'SYG Tienda','Problema de calentamiento','Equipos celulares (todos los modelos)'),
        (31,'SYG Tienda','Problema de display','Equipos celulares (todos los modelos)'),
        (32,'SYG Tienda','Problema de enlace/caída de llamadas','Equipos celulares (todos los modelos)'),
        (33,'SYG Tienda','Problema de micrófono/no lo escuchan','Equipos celulares (todos los modelos)'),
        (34,'SYG Tienda','Problemas de software/aplicaciones','Equipos celulares (todos los modelos)'),
        (35,'Otros','Colgó','Equipos celulares (todos los modelos)'),
        (36,'Otros','Interferencia','Equipos celulares (todos los modelos)'),
        (37,'Otros','Llamada de prueba','Equipos celulares (todos los modelos)'),
        (38,'Otros','Transferencia a otra área','Equipos celulares (todos los modelos)'),
        (39,'Otros','Llamada broma','Equipos celulares (todos los modelos)'),
        (40,'Quejas','Seguimiento de Quejas','Equipos celulares (todos los modelos)'),
        (41,'Quejas','Registro de Quejas','No aplica RCC en equipos básicos'),
        (42,'Quejas','Registro de Quejas','No está disponible servicio reparación con costo'),
        (43,'Quejas','Registro de Quejas','No apoyaron con bloqueo por IMEI'),
        (44,'Quejas','Registro de Quejas','El SIM no está activo porque compré en línea'),
        (45,'Quejas','Registro de Quejas','No hacen válida mi garantía porque no cuento con ticket'),
        (46,'Quejas','Registro de Quejas','No me quieren hacer cambio de equipo (dentro de los 30 días)');
    `;

    await conn.query(sQuery);
}

async function fillCatalogoCelulares() {
    const sQuery  = `INSERT INTO ${TABLE_CELULARES} (id, modelo) VALUES 
        (1,'Akus'), (2,'Akus Pro'), (3,'Akus Z'), (4,'Akus Z1'), (5,'Akus P1'), (6,'Astro'), 
        (7,'Astro Plus'), (8,'Aura'), (9,'Aura Plus JLO'), (10,'Aura Pro'), (11,'Aura Pro JLO'), (12,'AURA Z'),
        (13,'Aura M1'), (14,'Aura Plus'), (15,'Aura Prime'), (16,'Aura Pro'), (17,'Blaze'), (18,'Brix 2'),
        (19,'Brix C10'), (20,'Brix R'), (21,'Brix R2'), (22,'Covet'), (23,'Covet Mini'), (24,'Covet Pro'),
        (25,'Covet Pro Lite Rojo'), (26,'Covet Z'), (27,'Covet X'), (28,'Domos'), (29,'DreamTech'), (30,'Envy'),
        (31,'Forza'), (32,'Fun 3G'), (33,'Fun R'), (34,'Grant'), (35,'Gravity M'), (36,'Gravity'),
        (37,'Gravity M Verde'), (38,'Gravity Z rosa'), (39,'Hidra'), (40,'Hidra 2'), (41,'Hidra R'), (42,'Kindo'),
        (43,'Limit'), (44,'Luxo'), (45,'LIBERI'), (46,'MAGNO  AZUL'), (47,'Magno C'), (48,'Magno C1 Menta'),
        (49,'Magno dorado'), (50,'Magno Plus'), (51,'Magno S'), (52,'Magno C Plus'), (53,'Magno C1'), (54,'Magno C2'),
        (55,'Magno MINI'), (56,'Magno P1'), (57,'Magno Pro'), (58,'Magnux'), (59,'Nova'), (60,'Novus Tab'),
        (61,'Onix'), (62,'Onix S'), (63,'Orion'), (64,'Orvit'), (65,'Rocket'), (66,'Rocket 2'),
        (67,'Rocket 3'), (68,'Roni'), (69,'Rubeck C.Negra'), (70,'Rubeck CAJA GRIS'), (71,'Rubeck R'), (72,'Sens 1'),
        (73,'Sens 2'), (74,'Sens M1'), (75,'Starpad'), (76,'Starpad Plus'), (77,'Sirus'), (78,'Skip'),
        (79,'Skip 2 negro'), (80,'Skip 2 Rosa'), (81,'Skip 3'), (82,'Skip C.Negra'), (83,'Stedi'), (84,'Stellar'),
        (85,'Stellar C'), (86,'Stellar M1'), (87,'Stellar M1 32 GB'), (88,'Stellar M2'), (89,'stellar m3'), (90,'Stellar M4'),
        (91,'Stellar M5'), (92,'Stellar M6'), (93,'Stellar Max'), (94,'stellar mini'), (95,'Stellar P1'), (96,'Stellar P3'),
        (97,'Stellar P4'), (98,'Stellar P5'), (99,'Stellar P6'), (100,'Stellar P7'), (101,'Stellar P8'), (102,'Stellar Plus'),
        (103,'Stellar Pro'), (104,'Stellar Z Rose Gold'), (105,'Tablet lightyear'), (106,'Titan'), (107,'Ultra'), (108,'Ultra Z'),
        (109,'Uniq'), (110,'Vibe Dorado'), (111,'Vibe Dorado'), (112,'Volta Kids'), (113,'Volta X'), (114,'PAD KIDS'),
        (115,'PAD LIGHTYEAR'), (116,'Ziro'), (117,'Sonic'), (118,'Atlas'), (119,'Aura X'), (120,'Gravity Life'),
        (121,'Nox'), (122,'Rubeck Gris');
    `;

    await conn.query(sQuery);
}