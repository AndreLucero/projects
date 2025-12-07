import * as z from 'zod';
import { mongo_objectId, tailwindcss_colors } from '../lib/utils/generalSchemas';

export const messageSchema = z.object({
    id: mongo_objectId,
    owner: z.string(),
    text: z.string()
});

export const conversationSchema = z.object({
    id: mongo_objectId,
    participants: z.array( z.string() ).nonempty(),
    messages: z.array( messageSchema ),
    conversationName: z.string(),
    alias: z.string().length(2),
    color: tailwindcss_colors
});
