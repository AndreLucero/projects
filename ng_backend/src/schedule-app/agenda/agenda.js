import Agenda from "agenda";
import { MONGO_URL } from '../../lib/config.js';
import { jobDefinitions } from "./jobs.js";
import { jobGenesysCloudDefinitions } from "../../genesys-cloud/tasks/updateToken.js";

export const agenda = new Agenda({
    db: {
        address: MONGO_URL
    }
});

export async function initAgenda(){

    await jobDefinitions( agenda );
    await jobGenesysCloudDefinitions( agenda );

    await agenda.start();
    
    // Limpiar jobs bloqueados
    const mongoClient = agenda._mdb;
    const collection = mongoClient.collection('agendaJobs');

    await collection.updateMany(
        { lockedAt: { $ne: null } },
        { $set: { lockedAt: null } }
    );

    return true;
}