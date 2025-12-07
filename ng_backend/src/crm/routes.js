import { Router } from "express";
import { crmAgentCallRouter } from "./agent_call/routes.js";

export const crmRouter = Router();

crmRouter.use('/agent_call', crmAgentCallRouter);


crmRouter.get('/', (req,res) => {
    return res.json('home CRM')
});