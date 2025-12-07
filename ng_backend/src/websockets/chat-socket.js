import { ChatService } from "../chat-app/ChatService.js";
import { BadRequestException, GenericException } from "../lib/utils/Exceptions.js";
import { NotFoundException } from "../lib/utils/Exceptions.js";
import { SYSTEM_USER_ID } from "../lib/config.js";


export const chatHandler = (socket, io) => {

    socket.on('join-to', async (room) => {
        // console.log(`Usuario se unió a la room ${room}`);
        socket.join(`room-${room}`);
        
        // const notification = {
        //     room,
        //     message: {
        //         id: '',
        //         owner: SYSTEM_USER_ID,
        //         text: `El usuario ${socket.user.username} entró en la conversación`
        //     }
        // }
        // socket.to(`room-${room}`).emit('notification-chat-info', notification);
    });
    
    socket.on('join-to-own-room', () => {
        const userId = socket.user.id;
        console.log(`Se unió al chat personal ${userId}`);
        socket.join(`personal-${userId}`);
    });
    
    socket.on('leave-room', async (room) => {
        console.log(`Usuario salió de la room ${room}`);
        socket.leave(`room-${room}`);

        // const notification = {
        //     room,
        //     message: {
        //         id: '',
        //         owner: SYSTEM_USER_ID,
        //         text: `El usuario ${socket.user.id} salió del chat`
        //     }
        // }
        // socket.to(`room-${room}`).emit('notification-chat-info', notification);

    });

    socket.on('message-room', async (data, callback) => {
        const { room, message } = data;
        const owner = socket.user.id;

        try{
            
            const newRow = await ChatService.pushNewMessageToConversation({ conversationName:room, currentUserId: owner, text: message });
            
            socket.to(`room-${room}`).emit(`room-message`, {room, message: newRow.messages.at(-1)});
            callback({ status: true, message: 'Mensaje recibido', result: newRow.messages.at(-1)});
        }catch(err){
            console.log(err)
            callback({ status: false, message: 'Ocurrio un error al recibir el mensaje'});
        }

    });

    socket.on('invite-user-to-room', data => {
        const { userId, newRoomName } = data;
        socket.to(`room-${userId}`).emit('notification-join', { roomName: newRoomName, userId })
    });

    socket.on('listen-all-my-rooms', async (callback) => {

        try{

            const conversationsNames = [];

            const conver = await ChatService.getConversationsByUserId( socket.user.id );
            conver.forEach(e => { 
                conversationsNames.push( e.conversationName );
                socket.join(`room-${e.conversationName}`);
            });

            return callback({ status:false, message: 'Se obtuvieron todas la conversaciones del usuario', result: conver});

        }catch(err){

            if( err instanceof BadRequestException) return callback({status:false, message: err.message});
            if( err instanceof GenericException) return callback({status:false, message: err.message});
            if( err instanceof NotFoundException) return callback({status:false, message: 'No se encontraron conversaciones para este usuario'});

            console.log(err)
            return callback({status:false, message: 'Ocurrio un error desconocido'});
        }

    });

    socket.on('invite-user-to-room', data => {
        const { userId, newRoomName } = data;
        socket.to(`personal-${userId}`).emit('notification-join', { roomName: newRoomName });
    });
    
}