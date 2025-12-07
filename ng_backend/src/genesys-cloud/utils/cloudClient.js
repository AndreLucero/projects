import platformClient from 'purecloud-platform-client-v2';
import { getFileByOrg } from '../config/configCloud.js';

export async function getPlatformClient(org){

    const platformInstance = platformClient;

    let configuration = await getFileByOrg( org );
    if( !configuration ) return false;

    const client = platformInstance.ApiClient.instance;
    client.setEnvironment( platformInstance.PureCloudRegionHosts.us_east_1 );
    client.setAccessToken( configuration.access_token );
    
    return platformInstance;
}