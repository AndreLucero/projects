import { getPlatformClient } from './utils/cloudClient.js';
import { finishCallSchema, organization, userId as userSchema } from './schemas.js';

import { BadRequestException, GenericException } from '../lib/utils/Exceptions.js'
import { GenesysCloudException } from './utils/exceptions.js';

export class GenesysCloudService {

    static async validOrganization(org){
        const validOrg = organization.safeParse(org);
        return validOrg.success;
    }

    static async check(org){

        try{
            
            const pt = await getPlatformClient(org);
            if( !pt ) throw new GenericException('Ocurrió un problema mientras se consultaba genesysCloud');

        }catch(err){ 
            console.log(err);
            throw new GenericException('Ocurrió un problema mientras se consultaba genesysCloud')
         }

        return true;
    }

    static async finishCall(org, {conversationId, participantId, wrapupCode}){

        if( !wrapupCode ) throw new BadRequestException('Es necesario agregar wrapupCode en el cuerpo de la peticion');

        const validParams = finishCallSchema.safeParse({conversationId, participantId, wrapupCode});
        if( !validParams.success ) throw new BadRequestException('Los parametros proporcionados no son válidos');

        const ptCte = await getPlatformClient(org);
        const conversationApi = new ptCte.ConversationsApi();

        const body = {
            state: 'disconnected',
            wrapup: {
                code: wrapupCode
            }
        };


        try{
            await conversationApi.patchConversationParticipant(conversationId, participantId, body);
        }catch(err){

            console.log({err})

            let error = err.body.errors.at(0);
            if( error ) throw new GenesysCloudException( error.status, error.message );

            throw new Error(err)
        }

    }

    static async getUserById(org, { userId }){

        const validUserId = userSchema.safeParse(userId);
        if( !validUserId.success ) throw new BadRequestException('El userId proporcionado no es valido');

        const ptCte = await getPlatformClient(org);
        const userApi = new ptCte.UsersApi();

        let userData;
        try{
            const user = await userApi.getUser(userId);

            userData = {
                userId: user.id,
                nombre: user.name,
                numempleado: user.department,
                email: user.email,
                username: user.username
            };

        }catch(err){
            
            let error = err.body?.error;
            if( error ) throw new GenesysCloudException( err.status, error );
            if( err.response ) throw new GenesysCloudException(502, 'Ocurrió un problema al consultar con Genesys Cloud');
            
            // console.log({error, err})
            throw new Error('Error Desconocido');
        }

        return userData;
    }

}