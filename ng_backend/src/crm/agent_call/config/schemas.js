import * as z from 'zod';


export const crm_record = z.object({
    id_llamada: z.uuid(),
    fecha_llamadainicio: z.date(),
    fecha_llamadafin: z.date(),
    numero_empleado: z.string(),
    nombre_empleado: z.string().optional(),
    nombre_cliente: z.string().optional(),
    apellidopaterno_cliente: z.string().optional(),
    apellidomaterno_cliente: z.string().optional(),
    telefono: z.string(),
    telefonoadicional: z.string().optional(),
    numero_factura: z.string().optional(),
    fecha_compra: z.string().optional(),
    imei_equipo: z.string().optional(),
    id_contacto: z.string().optional(),
    comentario: z.string().optional(),
    categoria: z.string(),
    fingestion: z.string(),
    subfingestion: z.string()
});


export const crm_prerecord = crm_record.pick({
    id_llamada: true,
    fecha_llamadainicio: true,
    numero_empleado: true,
    telefono: true
}).required();