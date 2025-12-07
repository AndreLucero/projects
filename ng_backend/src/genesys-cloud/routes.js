import { Router } from "express";
import { GenesysCloudService } from './GenesysCloudService.js';
import { BadRequestException, GenericException, NotFoundException } from "../lib/utils/Exceptions.js";
import { GenesysCloudException } from "./utils/exceptions.js";

export const genesysCloudRouter = Router();

genesysCloudRouter.use('/', async (req,res,next) => {

    const orgIsValid = await GenesysCloudService.validOrganization( req.genesys_cloud_org );

    if( orgIsValid ) return next();
    return res.status(404).json({status:false, message: 'La organización proporcionada no se encuentra disponible'});
})

genesysCloudRouter.get('/', async (req,res) => {
    
    try{
        await GenesysCloudService.check( req.genesys_cloud_org );
        
        return res.status(200).json({status:true, message: 'Hay conexión con Genesys Cloud', result: req.genesys_cloud_org});
    }catch(err){
        if( err instanceof GenericException ) return res.status(200).json({status: false, message: 'No hay conexión con Genesys Cloud'});

        console.log(err)
        return res.status(500).json({status:false, message: 'Internal Server Error'});
    }
});

genesysCloudRouter.patch('/conversations/finishCall/:conversationId/:participantId', async (req,res) => {
    /*
        Params = { conversationId: uuid, participantId: uuid }
        Body = { wrapupCode: string }
    */ 


    try{
        await GenesysCloudService.finishCall(req.genesys_cloud_org, {...req.body, ...req.params});
        return res.status(200).json({status:true, message: 'Se finalizo la llamada con éxito'});
    }catch(err){

        if(err instanceof GenesysCloudException ) return res.status( err.status ).json({status:false, message: err.message});
        if(err instanceof BadRequestException ) return res.status(400).json({status:false, message: err.message});
        if(err instanceof NotFoundException ) return res.status(404).json({status:false, message: err.message});

        console.log(err);
        return res.status(500).json({status:false, message: 'Internal Server Error'});
    }

});


genesysCloudRouter.get('/user/:userId', async (req,res) => {
    /*
        Params = { userId:uuid }
    */

    try{
        const userData = await GenesysCloudService.getUserById(req.genesys_cloud_org, {...req.params });

        return res.status(200).json({status:true, message: 'Se obtuvo la información del usuario', result: userData});
    }catch(err){
       
        if(err instanceof GenesysCloudException ) return res.status( err.status ).json({status:false, message: err.message});
        if(err instanceof BadRequestException ) return res.status(400).json({status:false, message: err.message});
        if(err instanceof NotFoundException ) return res.status(404).json({status:false, message: err.message});

        console.log(err)
        return res.status(500).json({status:false, message: 'Internal Server Error'});
    }

})