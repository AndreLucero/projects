import * as z from 'zod';

export const userId = z.uuid();
export const conversationId = z.uuid();
export const participantId = z.uuid();

export const organization = z.enum(['organization2','organization3']);

export const finishCallSchema = z.object({
    conversationId: conversationId,
    participantId: participantId,
    wrapupCode: z.string()
})