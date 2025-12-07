import { GenericResponse, Uuid, Url } from "@lib/definitions";

export type UserId = Uuid;

export interface User{
  id: UserId;
  name: string;
  alias: string;
  color: string;
}

export interface Message {
    id?: string;
    owner: UserId;
    text: string;
}

export interface Conversation{
  conversationName: string;
  id: string;
  participants: string[];
  alias: string;
  color: string;
  messages: Message[];
}

export interface SocketRoomMessage{
  room: string;
  message: Message
}



/******************** RESPONSES ********************/
export interface ResponseUser extends Omit<GenericResponse, 'result'>{
  result: User
}
export interface ResponseUsers extends Omit<GenericResponse, 'result'>{
  result: User[]
}

export interface ResponseConversation extends Omit<GenericResponse, 'result'>{
  result: Conversation
}

export interface ResponseConversations extends Omit<GenericResponse, 'result'>{
  result: Conversation[]
}

export interface ResponseInvitationLink extends Omit<GenericResponse, 'result'>{
  result: Url
}