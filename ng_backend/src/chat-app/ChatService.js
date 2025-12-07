import mongoose from 'mongoose';
import { validate as validUuid, v4 as uuid } from 'uuid';

import ChatRepository from './ChatRepository.js';
import UserRepository  from '../login-app/UserRepository.js';
import { getRandomColor, getAlias } from '../login-app/utils.js';

import { BadRequestException, GenericException, NotFoundException } from '../lib/utils/Exceptions.js';
import {MongoValidationError, MongoConnectionError, MongoDocumentError} from '../lib/database/mongo/exceptions.js';

import { SYSTEM_USER_ID, SERVER_THIS } from '../lib/config.js';
import { getIO } from '../websockets/io-instance.js';


const invitationsActive = [
    // {'56b77bce-d05f-4e0a-afe6-28a426253d4e': '685f09aa85f26cb7a081ea95'} //Ejemplo de cómo se ve una invitacion { invitacionId : conversationId }
];


export class ChatService{

    static async getConversationById({ conversationId }){

        if( conversationId == undefined || conversationId == null ) throw new BadRequestException('No se encontró un conversationId');
        if( !mongoose.Types.ObjectId.isValid( conversationId ) ) throw new BadRequestException('La conversacion no tiene un id valido');

        let conversation;
        try{
            conversation = await ChatRepository.getById( conversationId );
        }catch(err){
            if( err instanceof MongoValidationError ) throw new BadRequestException('El id proporcionado no es valido');
            if( err instanceof MongoConnectionError ) throw new GenericException('Ocurrió un problema al obtener la información');
            if( err instanceof MongoDocumentError ) throw new GenericException('Ocurrió un problema al obtener la información');

            console.log(err)
            throw new Error('Error desconocido');
        }

        if( !conversation ) throw new NotFoundException(`No se encontró una conversación con el id ${conversationId}`);

        return conversation;
    
    }

    static async createNewConversation({conversationName, participants, currentUserId}){

        if( !conversationName ||
            !participants
        ) throw new BadRequestException('Los campos conversationName y participants deben estar en el cuerpo de la petición.');

        if( !Array.isArray( participants ) ) throw new BadRequestException('El campo participants debe ser de tipo arreglo');
        if( participants.length < 1 ) throw new BadRequestException('Es necesario agregar al menos un participante a la conversacion');

        let existConversation;
        try{
            existConversation = await ChatRepository.getByConversationName( conversationName );
        }catch(err){
            if( err instanceof MongoValidationError ) throw new BadRequestException('Ocurrió un problema mientras se creaba la conversación');
            if( err instanceof MongoConnectionError ) throw new GenericException('Ocurrió un problema al conectar el servidor');
            if( err instanceof MongoDocumentError ) throw new GenericException('Ocurrió un problema al conectar la base de datos');

            console.log(err)
            throw new Error('Error desconocido');
        }
        if( existConversation.length > 0 ) throw new BadRequestException('El nombre de la conversación ya está en uso');

        const validParticipants = await Promise.all(
            participants.map(async (user) => {
                if( !validUuid(user) ) return false;

                try{
                    const userData = await UserRepository.getUserById( user );
                    if( !userData ) return false;

                    return true;
                }catch(err){ return false }
            })
        );

        const participantsIsValid = validParticipants.some( e => !e );
        if( participantsIsValid ) throw new BadRequestException('Hay al menos un participante que no es válido para la conversacion');
        
        const newConversation = await ChatRepository.newConversation({
            conversationName,
            participants: [...participants, currentUserId ],
            messages: [],
            alias: getAlias( conversationName ),
            color: getRandomColor()
        });
        
        return newConversation;
    }

    static async getConversationsByUserId( userId ){

        if( !userId ) throw new BadRequestException('No se encontró un userId válido');
        if( !validUuid( userId ) ) throw new BadRequestException('El userId no es válido');

        let conversations
        try{
            conversations = await ChatRepository.getByUserId( userId );
        }catch(err){
            if( err instanceof MongoValidationError ) throw new BadRequestException('El id proporcionado no es valido');
            if( err instanceof MongoConnectionError ) throw new GenericException('Ocurrió un problema al conectar el servidor');
            if( err instanceof MongoDocumentError ) throw new GenericException('Ocurrió un problema al conectar la base de datos');

            console.log(err);
            throw new Error('Error desconocido');
        }

        if( conversations.length < 1 ) throw new NotFoundException('No se encontró ninguna conversación para este usuario');

        return conversations;
    }
    
    static async getConversationByName({conversationName}){

        if( !conversationName ) throw new BadRequestException('Es necesario enviar el conversationName');

        let conversation;
        try{
            conversation = await ChatRepository.getByConversationName(conversationName);
        }catch(err){
            if( err instanceof MongoValidationError ) throw new BadRequestException('Ocurrió un problema validando la conversacion proporcionada');
            if( err instanceof MongoConnectionError ) throw new GenericException('Ocurrió un problema al conectar el servidor');
            if( err instanceof MongoDocumentError ) throw new GenericException('Ocurrió un problema al conectar la base de datos');

            console.log(err);
            throw new Error('Error desconocido');
        }

        if( conversation.length < 1 ) throw new NotFoundException('No se encontró la conversación a la que se hace referencia');

        return conversation;
    }

    static async pushNewMessageToConversation({conversationName, currentUserId, text}){

        if( !conversationName || !currentUserId || !text ) throw new BadRequestException('Faltan campos en la petición');
        if( !validUuid(currentUserId) ) throw new BadRequestException('El userId actual no es válido');

        const existConversation = await ChatService.getConversationByName({ conversationName }); //Validamos si la conversación existe

        let message;
        try{
            const newMessage = { owner: currentUserId, text }
            message = await ChatRepository.pushNewMessageByConversationName(conversationName, newMessage);
        }catch(err){
            if( err instanceof MongoValidationError ) throw new BadRequestException('Ocurrió un problema con los datos proporcionados');
            if( err instanceof MongoConnectionError ) throw new GenericException('Ocurrió un problema al conectar el servidor');
            if( err instanceof MongoDocumentError ) throw new GenericException('Ocurrió un problema al conectar la base de datos');

            console.log(err);
            throw new Error('Error desconocido');
        }

        return message;
    }

    static async createInvitation({ conversationId }){

        if( !conversationId ) throw new BadRequestException('Es necesario agregar el conversationId');
        if( !mongoose.Types.ObjectId.isValid( conversationId ) ) throw new BadRequestException('El conversationId proporcionado no es válido');

       let existConversation;
        try{
            existConversation = await ChatRepository.getById( conversationId );
        }catch(err){
            if( err instanceof MongoValidationError ) throw new BadRequestException('Ocurrió un problema mientras se creaba la conversación');
            if( err instanceof MongoConnectionError ) throw new GenericException('Ocurrió un problema al conectar el servidor');
            if( err instanceof MongoDocumentError ) throw new GenericException('Ocurrió un problema al conectar la base de datos');

            console.log(err);
            throw new Error('Error desconocido');
        }
        if( existConversation.length < 1 ) throw new NotFoundException('La conversación a la que se hace referencia no existe');

        let invitationId = uuid();
        invitationsActive.push({ [invitationId]: conversationId });
        let link = `${SERVER_THIS}/chat/invitation/${invitationId}`;

        return link;
    }

    static async useInvitation({ invitationId, userId, username }){

        if( !invitationId ) throw new BadRequestException('Es necesario enviar el invitationId');
        if( !validUuid(invitationId) ) throw new BadRequestException('La invitación que estas tratando de utilizar no es válida');

        let index = invitationsActive.findIndex(elem => elem[invitationId] !== undefined );
        if( index < 0 ) throw new NotFoundException('La invitación no es válida o ya fue utilizada');

        let invitationData = invitationsActive.splice( index, 1 ).at(0);
        let conversationId = invitationData[ invitationId ];

        if( !mongoose.Types.ObjectId.isValid(conversationId) ) throw new BadRequestException('La invitación esta corrupta');

        let existConversation;
        try{
            existConversation = await ChatRepository.getById( conversationId );
        }catch(err){
            if( err instanceof MongoValidationError ) throw new BadRequestException('Ocurrió un problema mientras se creaba la conversación');
            if( err instanceof MongoConnectionError ) throw new GenericException('Ocurrió un problema al conectar el servidor');
            if( err instanceof MongoDocumentError ) throw new GenericException('Ocurrió un problema al conectar la base de datos');

            console.log(err);
            throw new Error('Error desconocido');
        }
        if( existConversation.length < 1 ) throw new NotFoundException('La conversación a la que se hace referencia no existe');

        let conversationUpdated;
        try{
            conversationUpdated = await ChatRepository.pushNewParticipantByConversationId( conversationId, userId);
        }catch(err){
            if( err instanceof MongoValidationError ) throw new BadRequestException('Ocurrió un problema mientras se creaba la conversación');
            if( err instanceof MongoConnectionError ) throw new GenericException('Ocurrió un problema al conectar el servidor');
            if( err instanceof MongoDocumentError ) throw new GenericException('Ocurrió un problema al conectar la base de datos');

            console.log(err);
            throw new Error('Error desconocido');
        }

        try{
            const io = getIO();

            const newComment = {
                conversationName: conversationUpdated.conversationName,
                currentUserId: SYSTEM_USER_ID,
                text: `El usuario ${username} se unió a la conversación`
            }

            const comment = await ChatService.pushNewMessageToConversation( newComment );

            io.to(`room-${conversationUpdated.conversationName}`).emit('room-message',{
                room: conversationUpdated.conversationName,
                message: comment.messages.at(-1)
            });
            io.to(`room-${conversationUpdated.conversationName}`).emit('notification-chat-info', 'hola')

        }catch(err){
            if(err instanceof GenericException ) throw new GenericException('Ocurrió un problema mientras se notificaba a los usuarios');

            if( err instanceof MongoValidationError ) throw new BadRequestException('Ocurrió un problema mientras se actualizaba la conversación');
            if( err instanceof MongoConnectionError ) throw new GenericException('Ocurrió un problema al conectar el servidor');
            if( err instanceof MongoDocumentError ) throw new GenericException('Ocurrió un problema al conectar la base de datos');

            console.log(err);
            throw new Error('Error desconocido');
        }
        

        return conversationId;
    }

    static async exitConversation({ conversationId, userId, username }){

        if( !conversationId ) throw new BadRequestException('Es necesario enviar un conversationId válido');
        if( !mongoose.Types.ObjectId.isValid(conversationId) ) throw new BadRequestException('Es necesario enviar un conversationId válido');

        let existConversation;
        try{
            existConversation = await ChatRepository.getById( conversationId );
        }catch(err){
            if( err instanceof MongoValidationError ) throw new BadRequestException('Ocurrió un problema mientras se creaba la conversación');
            if( err instanceof MongoConnectionError ) throw new GenericException('Ocurrió un problema al conectar el servidor');
            if( err instanceof MongoDocumentError ) throw new GenericException('Ocurrió un problema al conectar la base de datos');

            console.log(err);
            throw new Error('Error desconocido');
        }
        if( existConversation.length < 1 ) throw new NotFoundException('La conversación a la que se hace referencia no existe');

        let conversation;
        try{
            conversation = await ChatRepository.deleteParticipantByConversationId( conversationId, userId );
        }catch(err){
            if( err instanceof MongoValidationError ) throw new BadRequestException('Ocurrió un problema mientras se creaba la conversación');
            if( err instanceof MongoConnectionError ) throw new GenericException('Ocurrió un problema al conectar el servidor');
            if( err instanceof MongoDocumentError ) throw new GenericException('Ocurrió un problema al conectar la base de datos');

            console.log(err);
            throw new Error('Error desconocido');
        }
        
        try{

            const io = getIO();

            const newComment = {
                conversationName: conversation.conversationName,
                currentUserId: SYSTEM_USER_ID,
                text: `El usuario ${username} salió de la conversación`
            };

            const comment = await ChatService.pushNewMessageToConversation(newComment);

            io.to(`room-${conversation.conversationName}`).emit('room-message',{
                room: conversation.conversationName,
                message: comment.messages.at(-1)
            });
            io.to(`room-${conversation.conversationName}`).emit('notification-chat-info', 'hola')


        }catch(err){
            if(err instanceof GenericException ) throw new GenericException('Ocurrió un problema mientras se notificaba a los usuarios');

            if( err instanceof MongoValidationError ) throw new BadRequestException('Ocurrió un problema mientras se actualizaba la conversación');
            if( err instanceof MongoConnectionError ) throw new GenericException('Ocurrió un problema al conectar el servidor');
            if( err instanceof MongoDocumentError ) throw new GenericException('Ocurrió un problema al conectar la base de datos');

            console.log(err);
            throw new Error('Error desconocido');
        }
        
        if( conversation.participants.length > 0 ) return conversation;

        /* ***************************************************************************************************************** */
        /* ************************** SI LA CONVERSACIÓN QUEDÓ SIN PARTICIPANTES LA ELIMINAREMOS *************************** */
        /* ***************************************************************************************************************** */


        let oldConver;
        try{
            oldConver = await ChatRepository.deleteConversationById( conversationId );
        }catch(err){
            if( err instanceof MongoValidationError ) throw new BadRequestException('Ocurrió un problema mientras se creaba la conversación');
            if( err instanceof MongoConnectionError ) throw new GenericException('Ocurrió un problema al conectar el servidor');
            if( err instanceof MongoDocumentError ) throw new GenericException('Ocurrió un problema al conectar la base de datos');

            console.log(err);
            throw new Error('Error desconocido');
        }

        return oldConver;
        
    }

}