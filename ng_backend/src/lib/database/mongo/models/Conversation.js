import mongoose from 'mongoose';
const { model, models, Schema } = mongoose;

import '../mongoConnection.js';

const messageSchema = new Schema({
    owner: String,
    text: String
},{
    versionKey: false,
});

messageSchema.set('toJSON',{
    transform: (_doc, returnedObject, _opts) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
    }
});


const conversationSchema = new Schema({
    participants: Array,
    conversationName: String,
    alias: String,
    color: String,
    messages: [ messageSchema ]
},{
    versionKey: false
});

conversationSchema.set('toJSON',{
    transform: (_doc, returnedObject, _opts) => {
        returnedObject.id = returnedObject._id;
        delete returnedObject._id;
    }
});

export const Conversation = models.Conversation ?? model('Conversation', conversationSchema);