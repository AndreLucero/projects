import { Router } from "express";
import { BadRequestException, GenericException, NotFoundException } from "../lib/utils/Exceptions.js";

import { ChatService } from "./ChatService.js";

import { SERVER_FRONTEND } from "../lib/config.js";

export const chatRouter = Router();

chatRouter.get('/', (req,res) => {
    
    return res.json('Hola soy cocu');
});

chatRouter.post('/conversation/create', async (req,res) => {
    /*
        Body = { conversationName:string, participants:uuid[] }
    */
    
    try{
        const newConversation = await ChatService.createNewConversation( {... req.body, currentUserId: req.access_token.id } );
        return res.status(201).json({status: true, message: 'Se creó la conversación', result: newConversation})
    }catch(err){
        
        if( err instanceof BadRequestException) return res.status(400).json({status:false, message: err.message});
        if( err instanceof GenericException) return res.status(400).json({status:false, message: err.message});
        
        console.log(err);
        return res.status(500).json({status:false, message: 'Internal Server Error'});
    };

});

chatRouter.get('/conversation/me', async (req,res) => {
    
    try{
        const conversations = await ChatService.getConversationsByUserId( req.access_token.id );

        return res.status(200).json({status:true, message: `Se obtuvieron ${conversations.length} conversaciones`, result: conversations});
    }catch(err){

        if( err instanceof NotFoundException ) return res.status(404).json({status:false, message: 'El usuario actual no cuenta con conversaciones activas'})
        if( err instanceof BadRequestException ) return res.status(400).json({status:false, message: err.message});
        if( err instanceof GenericException ) return res.status(500).json({status:false, message: 'Ocurrió un problema del lado del servidor'});

        console.log(err);
        return res.status(500).json({status: false, message: 'Internal Server Error'});
    }

});

chatRouter.get('/conversation/:conversationId', async (req,res) => {
    /*
        Params: { conversationId:ObjectId }
    */

    try{
        const conversation = await ChatService.getConversationById( req.params );
        
        return res.status(200).json({status: true, message: 'Se obtuvo la información de la conversacion', result: conversation});
    }catch(err){

        if( err instanceof BadRequestException ) return res.status(400).json({status:false, message: err.message });
        if( err instanceof GenericException ) return res.status(400).json({status:false, message: err.message });


        console.log(err);
        return res.status(500).json({status: false, message: 'Internal Server Error'});
    }

});

chatRouter.patch('/conversation/:conversationId/exit', async (req,res) => {
    /*
        Params = { conversationId:ObjectId }
    */

    try{
        const conversation = await ChatService.exitConversation({ ...req.params, userId: req.access_token.id, username: req.access_token.username });
        
        return res.status(200).json({status: true, message: 'Se salió de la conversación con éxito', result: conversation});
    }catch(err){
        if( err instanceof BadRequestException ) return res.status(400).json({status:false, message: err.message});
        if( err instanceof GenericException ) return res.status(400).json({status:false, message: 'Ocurrió un error mientras se procesaba la consulta'});

        console.log(err);
        return res.status(500).json({status:false, message: 'Internal Server Error'});
    }

})

chatRouter.post('/invitation/create', async (req, res) => {
    /*
        Body = { conversationId:ObjectId() }
    */

    try{
        
        let invitationLink = await ChatService.createInvitation( req.body );

        return res.status(201).json({ status:true, message: 'Se creó la invitación con éxito', result: invitationLink });
    }catch(err){
        if( err instanceof NotFoundException ) return res.status(404).json({status:false, message: 'No se encontró la conversación a la que se hace referencia'});
        if( err instanceof BadRequestException ) return res.status(400).json({status:false, message: err.message});
        if( err instanceof GenericException ) return res.status(400).json({status:false, message: err.message});

        console.log(err);
        return res.status(500).json({status:false, message: 'Internal Server Error'});
    }

});

chatRouter.get('/invitation/:invitationId', async (req,res) => {
    /*
        Params = { invitationId:uuid }
    */

    try{

        const conversationId = await ChatService.useInvitation({...req.params, userId: req.access_token.id, username: req.access_token.username });
        
        return res.redirect(301, `${SERVER_FRONTEND}/chatApp/${ conversationId }`);
    }catch(err){

        if( err instanceof BadRequestException ) return res.redirect(301, `${SERVER_FRONTEND}/chatApp/notFound`);
        if( err instanceof NotFoundException ) return res.redirect(301, `${SERVER_FRONTEND}/chatApp/invitationExpired`);

        console.log(err);
        return res.redirect(301, `${SERVER_FRONTEND}/chatApp/notFound`);
    }

});