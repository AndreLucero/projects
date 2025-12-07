import { GenericException } from "../lib/utils/Exceptions.js";

let io = null;

export const setIO = (ioInstance) => {
  io = ioInstance;
};

export const getIO = () => {
  if (!io) throw new GenericException("Socket.IO no ha sido inicializado");
  return io;
};
