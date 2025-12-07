import { Conversation } from '../lib/database/mongo/models/Conversation.js';
import {MongoValidationError, MongoConnectionError, MongoDocumentError} from '../lib/database/mongo/exceptions.js';

export default class ChatRepository{

    static async getById( conversationId ){
        try{
            const data = await Conversation.findById( conversationId );
            return data;
        }catch(err){
            
            if( err.name = 'CastError' ) throw new MongoValidationError('Error al castear los tipos');
            if( err.name = 'ValidationError' ) throw new MongoValidationError('Error al castear los tipos');
            if( err.name = 'DisconnectedError' ) throw new MongoConnectionError('Ocurrió un problema con la conexión');
            if( err.name = 'DocumentNotFoundError' ) throw new MongoDocumentError('Ocurrió un problema obteniendo el documento Conversation');
            
            console.log(err);
            throw new Error('Error Desconocido');
        }
    }

    static async getByConversationName( conversationName ){
        try{
            const data = await Conversation.find({conversationName});
            return data;
        }catch(err){
            
            if( err.name = 'CastError' ) throw new MongoValidationError('Error al castear los tipos');
            if( err.name = 'ValidationError' ) throw new MongoValidationError('Error al castear los tipos');
            if( err.name = 'DisconnectedError' ) throw new MongoConnectionError('Ocurrió un problema con la conexión');
            if( err.name = 'DocumentNotFoundError' ) throw new MongoDocumentError('Ocurrió un problema obteniendo el documento Conversation');
            
            console.log(err);
            throw new Error('Error Desconocido');

        }
    }

    static async newConversation( conversationData ){
        try{
            const data = await Conversation.insertOne( conversationData );
            data.save();

            return data;
        }catch(err){
            
            if( err.name = 'CastError' ) throw new MongoValidationError('Error al castear los tipos');
            if( err.name = 'ValidationError' ) throw new MongoValidationError('Error al castear los tipos');
            if( err.name = 'DisconnectedError' ) throw new MongoConnectionError('Ocurrió un problema con la conexión');
            if( err.name = 'DocumentNotFoundError' ) throw new MongoDocumentError('Ocurrió un problema obteniendo el documento Conversation');
            
            console.log(err);
            throw new Error('Error Desconocido');

        }
    }

    static async getByUserId( userId ){
        try{
            const data = await Conversation.find({ participants: { $in: userId }})
            return data;
        }catch(err){

            if( err.name = 'CastError' ) throw new MongoValidationError('Error al castear los tipos');
            if( err.name = 'ValidationError' ) throw new MongoValidationError('Error al castear los tipos');
            if( err.name = 'DisconnectedError' ) throw new MongoConnectionError('Ocurrió un problema con la conexión');
            if( err.name = 'DocumentNotFoundError' ) throw new MongoDocumentError('Ocurrió un problema obteniendo el documento Conversation');
            
            console.log(err);
            throw new Error('Error Desconocido');
        }
    }

    static async pushNewMessageByConversationName(conversationName, newMessage){
        try{
            const data = await Conversation.findOneAndUpdate({ conversationName }, { $push: { messages: newMessage } }, { new: true });
            return data;
        }catch(err){
            if( err.name = 'CastError' ) throw new MongoValidationError('Error al castear los tipos');
            if( err.name = 'ValidationError' ) throw new MongoValidationError('Error al castear los tipos');
            if( err.name = 'DisconnectedError' ) throw new MongoConnectionError('Ocurrió un problema con la conexión');
            if( err.name = 'DocumentNotFoundError' ) throw new MongoDocumentError('Ocurrió un problema obteniendo el documento Conversation');
            
            console.log(err);
            throw new Error('Error Desconocido');
        }

    }

    static async pushNewParticipantByConversationId(conversationId, newParticipantId){
        try{
            const conver = await Conversation.findByIdAndUpdate( conversationId, {$addToSet: {participants: newParticipantId} }, { new:true });
            return conver;
        }catch(err){
            if( err.name = 'CastError' ) throw new MongoValidationError('Error al castear los tipos');
            if( err.name = 'ValidationError' ) throw new MongoValidationError('Error al castear los tipos');
            if( err.name = 'DisconnectedError' ) throw new MongoConnectionError('Ocurrió un problema con la conexión');
            if( err.name = 'DocumentNotFoundError' ) throw new MongoDocumentError('Ocurrió un problema obteniendo el documento Conversation');
            
            console.log(err);
            throw new Error('Error Desconocido');
        }

    }

    static async deleteParticipantByConversationId(conversationId, participantId){
        try{
            const data = await Conversation.findByIdAndUpdate( conversationId, { $pull: {participants:participantId} }, { new:true });
            return data;
        }catch(err){
            if( err.name = 'CastError' ) throw new MongoValidationError('Error al castear los tipos');
            if( err.name = 'ValidationError' ) throw new MongoValidationError('Error al castear los tipos');
            if( err.name = 'DisconnectedError' ) throw new MongoConnectionError('Ocurrió un problema con la conexión');
            if( err.name = 'DocumentNotFoundError' ) throw new MongoDocumentError('Ocurrió un problema obteniendo el documento Conversation');
            
            console.log(err);
            throw new Error('Error Desconocido');
        }
    }

    static async deleteConversationById( conversationId ){
        try{
            const data = await Conversation.findByIdAndDelete( conversationId );
            return data;
        }catch(err){
            if( err.name = 'CastError' ) throw new MongoValidationError('Error al castear los tipos');
            if( err.name = 'ValidationError' ) throw new MongoValidationError('Error al castear los tipos');
            if( err.name = 'DisconnectedError' ) throw new MongoConnectionError('Ocurrió un problema con la conexión');
            if( err.name = 'DocumentNotFoundError' ) throw new MongoDocumentError('Ocurrió un problema obteniendo el documento Conversation');
            
            console.log(err);
            throw new Error('Error Desconocido');
        }

    }
    

}