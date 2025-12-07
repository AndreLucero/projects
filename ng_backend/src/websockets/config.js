import { SERVER_FRONTEND } from "../lib/config.js";

export const configWebSocket = {
    path: '/ws',
    cors: {
        origin: SERVER_FRONTEND,
        methods: ['GET','POST'],
        credentials: true
    }
};
