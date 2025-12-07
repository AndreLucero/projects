import { GenericResponse, Uuid } from "@lib/definitions";

export interface FinGestion{
    id: number;
    tipo_fingestion: string;
    fingestion: string;
    subfingestion: string;
}

export interface InfoCelular{
    id: number;
    modelo: string;
}

export interface CrmRow{
    id_llamada: Uuid,
    fecha_llamadainicio: string;
    fecha_llamadafin?: string;
    numero_empleado: string|null;
    nombre_empleado: string|null;
    nombre_cliente?: string;
    apellidopaterno_cliente?: string;
    apellidomaterno_cliente?: string;
    telefono: string|null;
    telefonoadicional?: string;
    numero_factura?: string;
    fecha_compra?: string;
    imei_equipo?: string;
    id_contacto?: string;
    comentario?: string;
    categoria: string;
    fingestion: string;
    subfingestion: string;
}

export interface CrmRowPrerecord extends Pick<CrmRow, 'id_llamada'|'fecha_llamadainicio'|'numero_empleado'|'telefono'>{}

/******************** RESPONSES ********************/
export interface ResponseFinesGestion extends Omit<GenericResponse, 'result'>{
    result: FinGestion[]
}

export interface ResponseInfoCelulares extends Omit<GenericResponse, 'result'>{
    result: InfoCelular[]
}