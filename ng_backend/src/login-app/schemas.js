import * as z from 'zod';

export const user_roltype = z.enum([
    'EJECUTIVO','COACH','EJECUTIVO STAFF',
    'SUPERVISOR',
    'JEFE', 'JEFE STAFF',
    'ANALISTA','ANALISTA CREACION',
    'GERENTE','GERENTE ZONA',
    'COORDINADOR'
]);

export const user_preferences = z.object({
    popupMessages: z.boolean().optional(),
    bubbleGeneral: z.boolean().optional()
});

export const userSchema = z.object({
    id: z.uuid(),
    numempleado: z.number().int().min(90000000).max(99999999),
    nombre: z.string(),
    alias: z.string().length(2, {message: 'Alias debe ser de dos digitos'}),
    color: z.string(),
    password: z.string(),
    password_last_update: z.date(),
    roltype: user_roltype,
    lvl_roltype: z.number().int(),
    avatar: z.string().optional().nullable(),
    preferencias: user_preferences,
    is_active: z.boolean()
});

export const publicUserSchema = userSchema.omit({
    password: true,
    is_active: true
}).extend({
    id: z.uuid().optional().nullable()
});

export const unLogginUserSchema = userSchema.pick({
    numempleado: true,
    password: true
});

export const userToLoggin = userSchema.pick({
    numempleado: true,
    nombre: true,
    password: true
})

export const userToUpdate = userSchema.pick({
    nombre: true,
    alias: true,
    color: true,
    avatar:true,
    roltype: true,
}).partial()