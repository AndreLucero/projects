import { Router } from "express";
import { agenda } from "./agenda/agenda.js";

export const scheduleRouter = Router();

scheduleRouter.get('/', (req,res) => {
    return res.json('hola')
});


scheduleRouter.post('/createTask', async (req, res) => {
    /*
        Body = { message:string, every:string }
    */

    const { message, every } = req.body;

    if( !message || !every ) return res.status(400).json('Faltan campos');

    await agenda.create('taskSchedule', { message })
        .repeatEvery( every )
        .unique({ 'data.message': message })
        .save();

    return res.json('Se agrego la tarea');
});