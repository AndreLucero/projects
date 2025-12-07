import * as z from 'zod';

export const mongo_objectId = z.string();

export const tailwindcss_colors = z.enum(['red','yellow','blue','sky','purple','violet','green','pink','gray','orange','amber','cyan','emerald','indigo','lime','rose','slate','teal']);

// export const numEmpleadoSchema = z.number().int().min(90000000).max(99999999);
export const numEmpleadoSchema = z.union([
    z.number().int().min(90000000).max(99999999),
    z.string().length(8)
]);