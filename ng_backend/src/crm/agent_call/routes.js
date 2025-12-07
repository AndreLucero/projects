import { Router } from "express";
import { GenericException, NotFoundException } from "../../lib/utils/Exceptions.js";
import { CrmAgentCallService } from "./CrmAgentCallService.js";

export const crmAgentCallRouter = Router();

crmAgentCallRouter.get('/', (req,res) => {
    return res.json('home crm agent call')
});

crmAgentCallRouter.get('/allfines', async (req,res) => {

    try{
        const data = await CrmAgentCallService.getFines();

        return res.status(200).json({status:true, message: 'Se obtuvieron los registros', result: data});
    }catch(err){
        if( err instanceof GenericException ) return res.status(400).json({status:false, message: err.message});

        console.log(err);
        return res.status(500).json({status: false, message: 'Internal Server Error'});
    }

});

crmAgentCallRouter.get('/celulares/modelos', async (req,res) =>{

    try{

        const data = await CrmAgentCallService.getAllCelulares();

        return res.status(200).json({status:true, message: 'Se obtuvieron los registros', result: data});
    }catch(err){
        if( err instanceof GenericException ) return res.status(400).json({status:false, message: err.message});

        console.log(err);
        return res.status(500).json({status: false, message: 'Internal Server Error'});
    }

});


crmAgentCallRouter.post('/insertPrerecord', async (req,res) => {
    /*
        Body = { telefono:string, numepleado:string, id_audio:uuid, fechahorainicio:string }
    */

    try{
        let data = await CrmAgentCallService.insertPreRecord({ ...req.body });
        
        return res.status(201).json({status:true, message: 'Se creó el preregistro con éxito', result: data});
    }catch(err){
        if( err instanceof GenericException ) return res.status(400).json({status:false, message: err.message});

        console.log(err);
        return res.status(500).json({status: false, message: 'Internal Server Error'});
    }

});

crmAgentCallRouter.patch('/savefinishcall', async (req,res) => {
    /*
        Body = {
            id_llamada:uuid, fecha_llamadainicio:string, fecha_llamadafin:string, numero_empleado:string, nombre_empleado?:string, 
            nombre_cliente?:string, apellidopaterno_cliente?:string, apellidomaterno_cliente?:string, telefono:string,
            telefonoadicional?:string, numero_factura?:string, fecha_compra?:string, imei_equipo?:string id_contacto?:string,
            comentario?:string, categoria:string, fingestion:string, subfingestion:string
        }
    */

    try{
        let data = await CrmAgentCallService.updatePrerecord({ ...req.body });

        return res.status(200).json({status: true, message: 'Se actualizó el registro con éxito'});
    }catch(err){
        if( err instanceof NotFoundException ) return res.status(404).json({status:false, message: err.message});
        if( err instanceof GenericException ) return res.status(400).json({status:false, message: err.message});

        console.log(err);
        return res.status(500).json({status: false, message: 'Internal Server Error'});
    }

});


crmAgentCallRouter.get('/user/:numempleado/kpi-indicators', async (req,res) => {
    /*
        Params = { numempleado:number }
    */

    try{
        // let data = await CrmAgentCallService.getKpiIndicators({ ...req.params });
        // return res.status(200).json({status:true, message: 'Se obtuvieron los kpi del usuario', result: data});
        
        return res.status(200).json({status:true, message: 'Se obtuvieron los kpi del usuario', result:{tcr:100.00, nps:85.52, amabilidad: 50.24, total_encuestas: 6}})
    }catch(err){

        console.log(err);
        return res.status(500).json({status:false, message: 'Internal Server Error'});
    }
});

crmAgentCallRouter.get('/user/:numempleado/kpi-fingestion', async (req,res) => {
    /*
        Params = { numempleado:number }
    */

    try{
        let data = await CrmAgentCallService.getFinesCount({ ...req.params });
        return res.status(200).json({status:true, message: 'Se obtuvieron los kpi del usuario', result: data});
    }catch(err){

        console.log(err);
        return res.status(500).json({status:false, message: 'Internal Server Error'});
    }  
});