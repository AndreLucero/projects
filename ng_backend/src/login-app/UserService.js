import bcrypt from 'bcrypt';
import { validate as validUuid } from 'uuid';

import { SALT_ROUNDS } from "../lib/config.js";
import { PgNoResult, PgQueryError } from '../lib/database/postgres/exceptions.js';
import { GenericException, BadRequestException, NotFoundException, ForbiddenException } from '../lib/utils/Exceptions.js';

import { unLogginUserSchema, userToLoggin, userToUpdate, user_preferences } from "./schemas.js";
import { getAlias, getRandomColor, getLvlRoltype } from './utils.js';

import UserRepository from "./UserRepository.js";


export class UserService{


    static async checkPassword( {empleado, password} ){
        
        const validData = unLogginUserSchema.safeParse({numempleado:empleado, password});
        if( !validData.success ) throw new GenericException('Las credenciales no coinciden');
        
        let user;

        try{
            user = await UserRepository.getUserToValidate( empleado );
        }catch(err){
            if( err instanceof PgNoResult ) throw new BadRequestException('Usuario no existe');
            if( err instanceof PgQueryError ) throw new GenericException('Ocurrió un problema al buscar el empleado');
            
            throw new Error('Error desconocido');
        }

        let dbPassword = user['password'];
        let validPass = await bcrypt.compareSync( password, dbPassword);
        return {validPass, userChecked: user};
    }

    static async verifyUser({empleado, password}){

        const {validPass, userChecked} = await UserService.checkPassword({empleado, password});
        if( !validPass ) throw new BadRequestException('Usuario o contraseña no coinciden');

        let userData;
        try{
            userData = await UserRepository.getUserById( userChecked['id'] );
        }catch(err){
            if( err instanceof PgNoResult ) throw new GenericException('Ocurrió un problema mientras se procesaba la solicitud');
            if( err instanceof PgQueryError ) throw new GenericException('Ocurrió un problema al obtener la información');
            console.log(err)
            throw new Error('Error desconocido');
        }

        return userData;

    }

    static async create({nombre, empleado, password}){
        
        const validData = userToLoggin.safeParse({
            numempleado:empleado, nombre, password
        });
        if( !validData.success ) throw new BadRequestException('Los valores dados no son válidos');

        let userExist;
        try{
            userExist = await UserRepository.getUserByEmpleado( empleado );
        }catch(err){
            if( err instanceof PgQueryError ) throw new GenericException('Ocurrió un error al validar la información del empleado');
            throw new Error('Error desconocido');
        }

        if( !!userExist ) throw new BadRequestException('El empleado ya se encuentra registrado');

        const hashedPass = await UserService.hashPass( password );
        const newUser = {
            numempleado: empleado,
            nombre,
            alias: getAlias( nombre ),
            color: getRandomColor(),
            password: hashedPass,
            roltype: 'EJECUTIVO',
            lvl_roltype: 1,
            preferencias: JSON.stringify({ popupMessages: true, bubbleGeneral: true })
        }

        const newUserData = await UserRepository.setNewUser( newUser );

        return newUserData;
    }

    static async updatePassword({ empleado, old_pass, new_pass }){

        const { validPass } = await UserService.checkPassword({ empleado, password: old_pass });
        if( !validPass ) throw new BadRequestException('Usuario o contraseña no coinciden');

        try{
            const hashedPass = await UserService.hashPass( new_pass );
            await UserRepository.updatePass( empleado, hashedPass );
        }catch(err){
            if( err instanceof PgQueryError ) throw new GenericException('Ocurrió un problema mientras se verificaba la información');
            throw new Error('Error desconocido');
        }

        return true;
    }

    static async hashPass(password){
        return await bcrypt.hashSync(password, parseInt(SALT_ROUNDS));
    }

    static async getUserById({empleado}){
        
        if( !validUuid(empleado) ) throw new BadRequestException('El userId no es válido');

        let userData;
        try{
            userData = await UserRepository.getUserById( empleado );
        }catch(err){
            if( err instanceof PgNoResult ) throw new GenericException('Ocurrió un problema mientras se procesaba la solicitud');
            if( err instanceof PgQueryError ) throw new GenericException('Ocurrió un problema al obtener la información');

            console.log(err)
            throw new Error('Error desconocido');
        }

        if( !userData ) throw new NotFoundException('Usuario no encontrado');

        return {...userData, numempleado: parseInt( userData.numempleado ) };
    }

    static async getAllUsers(){

        try{
            const users = await UserRepository.getAllUsers();
            return users;
        }catch(err){
            if( err instanceof PgQueryError ) throw new GenericException('Ocurrió un problema mientras se buscaba la información de los usuarios');

            console.log(err);
            throw new Error('Error desconocido');
        }

    }

    static async updateUser(currentUser, {userId, nombre, alias, color, avatar, roltype}){
        
        //Validaciones generales
        if( !userId ) throw new BadRequestException('Faltan parametros en la petición');
        if( !validUuid(userId) ) throw new BadRequestException('El usuario proporcionado no es válido');

        const validData = userToUpdate.safeParse({ nombre, alias, color, avatar, roltype });
        if( !validData.success ) throw new BadRequestException('Los valores dados no son válidos');


        //Validamos que no estan tratando de actualizar el roltype por encima del propio;
        let lvl_roltype;
        if( roltype ){
            lvl_roltype = getLvlRoltype( roltype );
            if( currentUser.lvl_roltype < lvl_roltype ) throw new ForbiddenException('No es posible asignar un rol superior al propio');
        }

        //Actualizamos el usuario utilizando el repositorio
        let updatedUser;
        try{
            updatedUser = await UserRepository.updateUser(userId, nombre, alias, color, avatar, roltype, lvl_roltype);
        }catch(err){
            if( err instanceof PgQueryError ) throw new GenericException('Ocurrió un problema al obtener la información');

            console.log(err)
            throw new Error('Error Desconocido');
        }

        if( !updatedUser) throw new NotFoundException('No se encontró el usuario solicitado');

        return updatedUser;
    }

    static async updateUserPreferences(userId, preferences){

        if( !userId ) throw new BadRequestException('Faltan parametros en la petición');
        if( !validUuid(userId) ) throw new BadRequestException('El usuario proporcionado no es válido');

        const preferencesChecked = user_preferences.safeParse(preferences);
        if( !preferencesChecked.success ) throw new BadRequestException('Las preferencias que intentas agregar no son válidas');

        let updatedUser;
        try{
            updatedUser = await UserRepository.updateUserPreferences(userId, preferencesChecked.data);
        }catch(err){
            if( err instanceof PgQueryError ) throw new GenericException('Ocurrió un problema mientras se consultaba la base de datos');

            console.log(err);
            throw new Error('Error desconocido');
        }
        if( !updatedUser) throw new NotFoundException('No se encontró el usuario solicitado');

        return updatedUser;
    }

    static async deleteUser({ userId }){
        if( !userId ) throw new BadRequestException('Faltan parametros en la petición');
        if( !validUuid(userId) ) throw new BadRequestException('El usuario proporcionado no es válido');

        try{

            let user = await UserRepository.deleteUser( userId );

            return true;
        }catch(err){
            if( err instanceof PgQueryError ) throw new GenericException('Ocurrió un problema mientras se consultaba la base de datos');

            console.log(err);
            throw new Error('Error desconocido');
        }

    }


}