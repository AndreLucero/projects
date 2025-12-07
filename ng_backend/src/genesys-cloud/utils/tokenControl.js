import { getPlatformClient,  } from './cloudClient.js';
import { updateFile, getFileByOrg } from '../config/configCloud.js';

export async function updateToken(org){

    const newToken = await genNewToken(org);
    let jsonConfig = await getFileByOrg(org);

    const newJson = {
        ...jsonConfig,
        access_token: newToken
    };

    await updateFile({ [org]: newJson });
}

async function genNewToken(org) {

    const ptCte = await getPlatformClient(org);
    const client = ptCte.ApiClient.instance;

    const config = await getFileByOrg( org );
    const clientId = config.clientId;
    const clientSecret = config.clientSecret;
    
    const resp = await client.loginClientCredentialsGrant( clientId, clientSecret );
    
    return resp.accessToken;
}