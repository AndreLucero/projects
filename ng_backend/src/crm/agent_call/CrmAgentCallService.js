import NodeCache from 'node-cache';
import { PgException, PgQueryError } from '../../lib/database/postgres/exceptions.js';
import { BadRequestException, GenericException, NotFoundException } from '../../lib/utils/Exceptions.js';
import { CrmAgentCallRepository } from './CrmAgentCallRepository.js';
import { crm_prerecord, crm_record } from './config/schemas.js';
import { createCrmTable, createCatalogo, createCatalogoCelulares } from './config/seed.js'
import { numEmpleadoSchema } from '../../lib/utils/generalSchemas.js';

const cache = new NodeCache({ sdTTL: 43200 }); //12 hrs de vida

export class CrmAgentCallService {

    static async getFines(){

        try{
            const existCatalogoTable = await CrmAgentCallRepository.existCatalogoTable();
            if( !existCatalogoTable ) await createCatalogo();
        }catch(err){ console.log('ERROR: Creación de tabla CATALOGO AGENT CALL'); }
        
        let data;
        try{
            data = await CrmAgentCallRepository.getAllFines();
        }catch(err){
            if( err instanceof PgException ) throw new GenericException('Ocurrió un problema mientras se consultaba la base de datos');

            console.log(err);
            throw new Error('Error desconocido');
        }

        return data;

    }

    static async getAllCelulares(){

        if( cache.get('allCelulares') ) return cache.get('allCelulares');

        try{
            const existCatCelTable = await CrmAgentCallRepository.existCatalogoCelulares();
            if( !existCatCelTable ) await createCatalogoCelulares();
        }catch(err){ console.log('ERROR: Creación de tabla CATALOGO CELULARES AGENT CALL'); }

        let data;
        try{
            data = await CrmAgentCallRepository.getAllModeloCelulares();
            cache.set('allCelulares', data);
        }catch(err){
            if( err instanceof PgException ) throw new GenericException('Ocurrió un problema mientras se consultaba la base de datos');

            console.log(err);
            throw new Error('Error desconocido');
        }

        return data;
    }
    
    static async insertPreRecord(data){

        const validReq = crm_prerecord.safeParse( data )
        if( !validReq ) throw new BadRequestException('La petición no cuenta con la estructura correcta');

        try{
            const existCrmTable = await CrmAgentCallRepository.existCrmTable();
            if( !existCrmTable ) await createCrmTable();
        }catch(err){ console.log('ERROR: Creación de tabla CRM AGENT CALL'); }

        let resp;
        try{
            resp = await CrmAgentCallRepository.insertPrerecord(data);
        }catch(err){
            if( err instanceof PgQueryError ) throw new GenericException('Ocurrió un error al guardar el preregristro de la llamada');

            console.log(err);
            throw new Error('Error Desconocido');
        }

        return resp;
    }

    static async updatePrerecord(data){

        const validReq = crm_record.safeParse(data);
        if( !validReq ) throw new BadRequestException('La petición no cuenta con la estructura correcta');

        let existPrerecord
        try{
            existPrerecord = await CrmAgentCallRepository.getCallPrerecord(data);
        }catch(err){
            if( err instanceof PgQueryError ) throw new GenericException('Ocurrió un error al guardar el preregristro de la llamada');

            console.log(err);
            throw new Error('Error Desconocido');
        }

        if ( !existPrerecord ) throw new NotFoundException('No existe un preregistro para esta llamada');

        try{
            await CrmAgentCallRepository.updatePrerecord(data);
        }catch(err){
            if( err instanceof PgQueryError ) throw new GenericException('Ocurrió un error al guardar el preregristro de la llamada');

            console.log(err);
            throw new Error('Error Desconocido');
        }

        return true;
    }

    static async getKpiIndicators({numempleado}){
        
        let data = await CrmAgentCallRepository.getEncuestaPrb();

        return data;
    }

    static async getFinesCount({numempleado}){

        const validReq = numEmpleadoSchema.safeParse(numempleado);
        if( !validReq.success ) throw new BadRequestException('El número de empleado proporcionado no es válido');

        let data;
        try{
            data = await CrmAgentCallRepository.getFinesCount({numempleado});
        }catch(err){
            if( err instanceof PgQueryError ) throw new GenericException('No se pudieron obtener los anteriores fines de gestión del usuario');

            console.log(err);
            throw new Error('Error Desconocido');
        }

        return data;
    }

}