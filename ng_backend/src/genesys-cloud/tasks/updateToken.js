import { updateToken } from '../utils/tokenControl.js';

export const jobGenesysCloudDefinitions = async (agenda) => {

    agenda.define("UpdateAccessTokenGenesysCloud_organization2", async (job) => {
        console.log(`Iniciando UpdateAccessTokenGenesysCloud_organization2 ${ Date() }`);

        await updateToken('organization2');

        console.log('Se actualizó el access_token para organization2');
    });
    
    agenda.define("UpdateAccessTokenGenesysCloud_organization3", async (job) => {
        console.log(`Iniciando UpdateAccessTokenGenesysCloud_organization3 ${ Date() }`);

        await updateToken('organization3');

        console.log('Se actualizó el access_token para organization3');
    });
    
    await agenda.every('0 3 * * *','UpdateAccessTokenGenesysCloud_organization2'); //Todos los domingos a las 03:00 AM
    await agenda.every('5 3 * * *','UpdateAccessTokenGenesysCloud_organization3'); //Todos los domingos a las 03:05 AM
}