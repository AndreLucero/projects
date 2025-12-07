import { Uuid } from "./definitions";
import { GenericResponse } from "./definitions";

export type UserId = Uuid;

export interface UserGenesys{
    userId: UserId;
    nombre: string;
    numempleado: string;
    email: string;
    username: string;
}

/******************** RESPONSES ********************/
export interface ResponseUserGenesys extends Omit<GenericResponse, 'result'>{
    result: UserGenesys
}