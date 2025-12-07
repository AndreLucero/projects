import type { Uuid, TailwindColor, GenericResponse } from '@lib/definitions';

export type RolType = 'EJECUTIVO' | 'COACH' | 'EJECUTIVO STAFF' | 'SUPERVISOR' | 'JEFE' | 'JEFE STAFF' |
                        'ANALISTA' | 'ANALISTA CREACION' | 'GERENTE' | 'GERENTE ZONA' | 'COORDINADOR' | 'ADMIN';

export interface UserPreferences{
    popupMessages?: boolean;
    bubbleGeneral?: boolean;
}

export interface UserPreferencesOptional extends Partial<UserPreferences>{}

export interface GeneralUserData{
    id: Uuid;
    numempleado: number;
    nombre: string;
    alias: string;
    color: TailwindColor;
    password: string;
    password_last_update: string;
    roltype: RolType;
    lvl_roltype: number;
    avatar?: string;
    preferencias: UserPreferences;
    is_active: boolean;
};

export interface UserData extends Omit<GeneralUserData, 'password'|'password_last_update'|'is_active'>{};

export interface UserToken{
    id: Uuid;
    username: string;
    roltype: RolType;
    lvl_roltype: number;
}


/******************** RESPONSES ********************/
export interface ResponseUserData extends Omit<GenericResponse, 'result'>{
    result: UserData;
}

export interface ResponseUsersData extends Omit<GenericResponse, 'result'>{
    result: UserData[];
}

export interface ResponseUserToken extends Omit<GenericResponse, 'result'>{
    result: UserToken
}