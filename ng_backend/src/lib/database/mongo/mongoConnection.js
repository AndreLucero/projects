import { MONGO_URL } from "../../config.js";
import mongoose from "mongoose";

mongoose.connect( MONGO_URL )
    .then(() => console.log("Conexión con mongodb establecida") )
    .catch(err => console.log("Ocurrió un error al conectar con mongodb"))